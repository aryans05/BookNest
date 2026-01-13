import { chromium } from 'playwright';

export type FictionSubHeading = {
  name: string;
  slug: string;
  url: string;
};

export async function scrapeFictionSubHeadings(): Promise<FictionSubHeading[]> {
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
      'a[data-menu_category="Fiction Books"]',
      (anchors) =>
        anchors
          .map((a) => ({
            name: a.getAttribute('data-menu_subcategory')?.trim() || '',
            href: a.getAttribute('href') || '',
          }))
          .filter(
            (a) =>
              a.name.length > 0 &&
              a.href.includes('/collections/') &&
              !a.href.endsWith('/fiction-books'),
          )
          .slice(0, 5), // ✅ MAX 5 (same rule as Non-Fiction)
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
