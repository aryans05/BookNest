import { Page } from 'playwright';

export async function scrapeProductDetailPage(page: Page) {
  return page.evaluate(() => {
    const clean = (value: string | null): string | null => {
      if (!value) return null;
      return value.replace(/\s+/g, ' ').trim();
    };

    const description = clean(
      document.querySelector('.product-accordion .panel p')?.textContent ??
        null,
    );

    const specs: Record<string, string> = {};

    document
      .querySelectorAll('table.additional-info-table tr')
      .forEach((row) => {
        const key = clean(
          row.querySelector('td:first-child')?.textContent ?? null,
        );
        const value = clean(
          row.querySelector('td:last-child')?.textContent ?? null,
        );

        if (key && value) {
          specs[key] = value;
        }
      });

    const editorialReviews: string[] = [];

    const reviewsEl = document.querySelector(
      'section[id*="product_accordion_reviews"] .panel',
    );

    if (reviewsEl instanceof HTMLElement) {
      const lines = reviewsEl.innerText.split('\n');

      for (const line of lines) {
        const text = clean(line);
        if (text) {
          editorialReviews.push(text);
        }
      }
    }

    const recommendedProducts: {
      title: string;
      price: string | null;
      image: string | null;
    }[] = [];

    document
      .querySelectorAll(
        '.algolia-related-products-container .main-product-card',
      )
      .forEach((card) => {
        const title = clean(
          card.querySelector('h3, .card-title')?.textContent ?? null,
        );
        const price = clean(card.querySelector('.price')?.textContent ?? null);

        let image: string | null = null;
        const imgEl = card.querySelector('img');

        if (imgEl instanceof HTMLImageElement) {
          image = imgEl.src;
        }

        if (title) {
          recommendedProducts.push({
            title,
            price,
            image,
          });
        }
      });

    return {
      description,
      specs: Object.keys(specs).length > 0 ? specs : undefined,
      editorialReviews:
        editorialReviews.length > 0 ? editorialReviews : undefined,
      recommendedProducts:
        recommendedProducts.length > 0 ? recommendedProducts : undefined,
    };
  });
}
