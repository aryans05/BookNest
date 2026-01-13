import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductService } from '../product/product.service';

@Injectable()
export class ScraperOrchestratorService {
  private isScraping = false;

  constructor(private readonly productService: ProductService) {}

  /**
   * Full category refresh
   *  Ensure product list exists (DB-first, scrape-if-needed)
   *  Scrape product details for that category
   */
  async scrapeFullCategory(params: {
    categoryId: number;
    collectionUrl: string;
    limit: number;
  }) {
    const { categoryId, collectionUrl, limit } = params;

    if (this.isScraping) {
      throw new BadRequestException(
        'Scraping already in progress. Please wait.',
      );
    }

    this.isScraping = true;

    try {
      /*  Trigger list scraping via pagination logic */
      await this.productService.findByCategoryPaginated(
        categoryId,
        1, // page
        limit, // how many to ensure exist
        collectionUrl, // REQUIRED for scraping
      );

      /*  Trigger detail scraping for this category */
      const detailResult =
        await this.productService.scrapeAndSaveProductDetailsByCategory(
          categoryId,
        );

      return {
        success: true,
        message: 'Category refreshed successfully',
        categoryId,
        details: detailResult,
      };
    } finally {
      this.isScraping = false;
    }
  }
}
