import { chromium } from 'playwright';

export type CategoryItem = {
  title: string;
  slug: string;
  sourceUrl: string;
};

export async function scrapeCategories(
  navigationUrl: string,
): Promise<CategoryItem[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(navigationUrl, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  const items = await page.$$eval('a[href^="/collections/"]', (links) => {
    const results: CategoryItem[] = [];

    for (const link of links) {
      const title = link.textContent?.trim();
      const href = link.getAttribute('href');

      if (!title || !href) continue;
      if (title.length < 3) continue;

      const lower = title.toLowerCase();

      if (
        lower.includes('sale') ||
        lower.includes('shop') ||
        lower.includes('clearance') ||
        lower.includes('gift') ||
        lower.includes('buy') ||
        lower.includes('offer')
      ) {
        continue;
      }

      results.push({
        title,
        slug: lower.replace(/\s+/g, '-'),
        sourceUrl: `https://www.worldofbooks.com${href}`,
      });
    }

    return results;
  });

  await browser.close();

  const unique = Array.from(
    new Map(items.map((item) => [item.slug, item])).values(),
  );

  return unique.slice(0, 5);
}
