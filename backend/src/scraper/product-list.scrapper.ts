import { chromium } from 'playwright';

export type ScrapedProduct = {
  title: string;
  price: string;
  imageUrl: string;
  sourceUrl: string;
};

export async function scrapeProductList(
  url: string,
): Promise<ScrapedProduct[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  await page.waitForSelector('a[href*="/products/"]', {
    timeout: 15000,
  });

  const products = await page.$$eval<ScrapedProduct[]>(
    'a[href*="/products/"]',
    (links) =>
      links.slice(0, 20).map((link) => {
        // ✅ Proper type narrowing inside browser context
        if (!(link instanceof HTMLAnchorElement)) {
          return {
            title: '',
            price: '',
            imageUrl: '',
            sourceUrl: '',
          };
        }

        const card = link.closest('div');

        return {
          title: link.textContent?.trim() ?? '',
          price:
            card?.querySelector('[data-testid="price"]')?.textContent?.trim() ??
            '',
          imageUrl: card?.querySelector('img')?.getAttribute('src') ?? '',
          sourceUrl: link.href,
        };
      }),
  );

  await browser.close();
  return products;
}
