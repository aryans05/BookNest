import { Injectable } from '@nestjs/common';
import { scrapeProductList } from '../../src/scraper/product-list.scrapper';

@Injectable()
export class ScrapeService {
  async scrapeBooks() {
    const products = await scrapeProductList('https://www.worldofbooks.com/');

    return {
      message: 'Scraping works',
      count: products.length,
      sample: products.slice(0, 3),
    };
  }
}
