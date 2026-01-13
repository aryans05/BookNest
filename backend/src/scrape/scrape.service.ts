import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { scrapeProductDetailPage } from '../scraper/product/product-detail.scraper';
import { Product, ProductDetail, Prisma } from '@prisma/client';
import { chromium, Page } from 'playwright';

@Injectable()
export class ScrapeService {
  private readonly logger = new Logger(ScrapeService.name);

  private readonly SAFE_LIMIT = 20;

  constructor(private readonly prisma: PrismaService) {}

  async backfillDescriptions(limit = 10) {
    const safeLimit = Math.min(Number(limit) || 10, this.SAFE_LIMIT);

    const products = await this.prisma.product.findMany({
      where: {
        OR: [{ detail: { is: null } }, { detail: { description: null } }],
      },
      include: { detail: true },
      take: safeLimit,
    });

    if (products.length === 0) {
      return { message: 'Nothing to backfill', total: 0 };
    }

    this.logger.log(`Backfilling ${products.length} products`);

    const result = await this.processProducts(products);

    return {
      message: 'Description backfill completed',
      ...result,
    };
  }

  async backfillDescriptionsByCategory(categoryId: number, limit = 10) {
    const safeLimit = Math.min(Number(limit) || 10, this.SAFE_LIMIT);

    const products = await this.prisma.product.findMany({
      where: {
        categoryId,
        OR: [{ detail: { is: null } }, { detail: { description: null } }],
      },
      include: { detail: true },
      take: safeLimit,
    });

    if (products.length === 0) {
      return { message: 'Nothing to backfill', total: 0 };
    }

    this.logger.log(
      `Backfilling ${products.length} products for category ${categoryId}`,
    );

    const result = await this.processProducts(products);

    return {
      message: 'Category description backfill completed',
      categoryId,
      ...result,
    };
  }

  async forceFetchAllDescriptions(limit = 10) {
    const safeLimit = Math.min(Number(limit) || 10, this.SAFE_LIMIT);

    const products = await this.prisma.product.findMany({
      include: { detail: true },
      take: safeLimit,
    });

    if (products.length === 0) {
      return { message: 'No products found', total: 0 };
    }

    this.logger.warn(`Force scraping ${products.length} products`);

    const result = await this.processProducts(products);

    return {
      message: 'Force description scrape completed',
      ...result,
    };
  }

  private async processProducts(
    products: (Product & { detail: ProductDetail | null })[],
  ) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let success = 0;
    let failed = 0;

    try {
      for (const product of products) {
        const ok = await this.processSingleProduct(product, page);
        ok ? success++ : failed++;
      }
    } finally {
      await browser.close();
    }

    return {
      total: products.length,
      success,
      failed,
    };
  }

  private async processSingleProduct(
    product: Product & { detail: ProductDetail | null },
    page: Page,
  ): Promise<boolean> {
    if (!product.sourceUrl) {
      this.logger.warn(`SKIPPED (missing sourceUrl) → ${product.title}`);
      return false;
    }

    try {
      this.logger.log(`Scraping → ${product.title}`);

      await page.goto(product.sourceUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      const extra = await scrapeProductDetailPage(page);

      if (!extra.description || extra.description.length < 200) {
        this.logger.warn(`SKIPPED (invalid description) → ${product.title}`);
        return false;
      }

      if (!product.detail) {
        await this.prisma.productDetail.create({
          data: {
            productId: product.id,
            description: extra.description,
            specs: extra.specs ?? Prisma.DbNull,
            editorialReviews: extra.editorialReviews ?? Prisma.DbNull,
            recommendedProducts: extra.recommendedProducts ?? Prisma.DbNull,
          },
        });
      } else {
        await this.prisma.productDetail.update({
          where: { productId: product.id },
          data: {
            description: extra.description,
            specs: extra.specs ?? Prisma.DbNull,
            editorialReviews: extra.editorialReviews ?? Prisma.DbNull,
            recommendedProducts: extra.recommendedProducts ?? Prisma.DbNull,
          },
        });
      }

      this.logger.log(`SAVED → ${product.title}`);
      return true;
    } catch (err) {
      this.logger.error(
        `ERROR scraping ${product.title}`,
        err instanceof Error ? err.stack : String(err),
      );
      return false;
    }
  }
}
