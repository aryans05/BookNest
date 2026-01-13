import { chromium } from 'playwright';

export type RareBooksSubHeading = {
  name: string;
  slug: string;
  url: string;
};

export async function scrapeRareBooksSubHeadings(): Promise<
  RareBooksSubHeading[]
> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  try {
    await page.goto('https://www.worldofbooks.com/en-gb', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    const items = await page.$$eval(
      'div[aria-label="Rare Books"] a[href*="/collections/"]',
      (anchors) =>
        anchors
          .map((a) => ({
            name: a.textContent?.replace(/\s+/g, ' ').trim() || '',
            href: a.getAttribute('href') || '',
          }))
          .filter((a) => a.name.length > 0 && !a.href.endsWith('/rare-books'))
          .slice(0, 5),
    );

    return items.map((item) => {
      const name = item.name.replace(/’/g, "'").trim();

      return {
        name,
        slug: name
          .toLowerCase()
          .replace(/'/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        url: item.href.startsWith('http')
          ? item.href
          : `https://www.worldofbooks.com${item.href}`,
      };
    });
  } finally {
    await browser.close();
  }
}
