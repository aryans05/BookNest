import { chromium } from 'playwright';

export type ProductListItem = {
  title: string;
  author: string | null;
  price: string | null;
  imageUrl: string | null;
  productUrl: string;
};

export async function scrapeProductList(
  collectionUrl: string,
  limit = 15, // 🔒 MAX 15
): Promise<ProductListItem[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  try {
    await page.goto(collectionUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await page.waitForSelector('li.ais-InfiniteHits-item', {
      timeout: 15000,
    });

    const products = await page.$$eval(
      'li.ais-InfiniteHits-item',
      (items, max) => {
        const results: {
          title: string;
          author: string | null;
          price: string | null;
          imageUrl: string | null;
          productUrl: string;
        }[] = [];

        for (const item of items) {
          if (results.length >= max) break;

          const titleAnchor =
            item.querySelector<HTMLAnchorElement>('h3.card__heading a');
          if (!titleAnchor) continue;

          const title = titleAnchor.textContent?.trim() ?? '';
          const href = titleAnchor.getAttribute('href') ?? '';

          if (!title || !href) continue;

          const author =
            item
              .querySelector<HTMLParagraphElement>('p.author')
              ?.textContent?.trim() ?? null;

          const price =
            item
              .querySelector<HTMLDivElement>('div.price')
              ?.textContent?.trim() ?? null;

          const imageUrl =
            item.querySelector<HTMLImageElement>('img')?.getAttribute('src') ??
            null;

          results.push({
            title,
            author,
            price,
            imageUrl,
            productUrl: href.startsWith('http')
              ? href
              : `https://www.worldofbooks.com${href}`,
          });
        }

        return results;
      },
      limit,
    );

    return products;
  } finally {
    await browser.close();
  }
}
