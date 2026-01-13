import { chromium } from 'playwright';

export type NavigationItem = {
  title: string;
  slug: string;
};

const REQUIRED_TITLES = [
  'Fiction Books',
  'Non-Fiction Books',
  "Children's Books",
  'Rare Books',
];

export async function scrapeTopNavigation(): Promise<NavigationItem[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.worldofbooks.com', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    //  DO NOT wait for visibility – just read DOM
    const texts = await page.$$eval('a', (anchors) =>
      anchors.map((a) => a.textContent?.trim() || ''),
    );

    const found: NavigationItem[] = [];

    for (const raw of texts) {
      if (!raw) continue;

      const normalized = raw.replace(/’/g, "'").replace(/\s+/g, ' ').trim();

      if (!REQUIRED_TITLES.includes(normalized)) continue;

      // avoid duplicates
      if (found.some((f) => f.title === normalized)) continue;

      const slug = normalized
        .toLowerCase()
        .replace(/'/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      found.push({ title: normalized, slug });
    }

    return found;
  } finally {
    await browser.close();
  }
}
