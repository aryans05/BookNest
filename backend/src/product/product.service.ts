import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { scrapeProductList } from '../scraper/product/product-list.scrapper';
import { scrapeProductDetailPage } from '../scraper/product/product-detail.scraper';
import { createHash } from 'crypto';
import { chromium } from 'playwright';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  private readonly SAFE_SCRAPE_LIMIT = 15;

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        price: true,
        currency: true,
        imageUrl: true,
        sourceUrl: true,
        categoryId: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findProductDetails(productId: number) {
    return this.prisma.productDetail.findUnique({
      where: { productId },
      select: {
        description: true,
        specs: true,
        editorialReviews: true,
        recommendedProducts: true,
        ratingsAvg: true,
        reviewsCount: true,
      },
    });
  }

  async findByCategoryPaginated(
    categoryId: number,
    page: number,
    limit: number,
    collectionUrl?: string,
  ) {
    page = Number(page) || 1;
    limit = Math.min(Number(limit) || 15, this.SAFE_SCRAPE_LIMIT);

    const skip = (page - 1) * limit;

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const dbProducts = await this.prisma.product.findMany({
      where: { categoryId },
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    const totalInDb = await this.prisma.product.count({
      where: { categoryId },
    });

    if (dbProducts.length === limit) {
      return {
        page,
        limit,
        total: totalInDb,
        products: dbProducts,
      };
    }

    if (!collectionUrl) {
      this.logger.warn(
        `Missing collectionUrl for category ${categoryId}, cannot scrape`,
      );

      return {
        page,
        limit,
        total: totalInDb,
        products: dbProducts,
      };
    }

    const missingCount = limit - dbProducts.length;

    this.logger.log(
      `Scraping ${missingCount} products for category ${categoryId}`,
    );

    const scrapedProducts = await scrapeProductList(
      collectionUrl,
      missingCount,
    );

    let saved = 0;

    for (const product of scrapedProducts) {
      const exists = await this.prisma.product.findUnique({
        where: { sourceUrl: product.productUrl },
      });

      if (exists) continue;

      let price: number | null = null;
      let currency: string | null = null;

      if (product.price) {
        const match = product.price.match(/([£$€])\s?([\d.,]+)/);
        if (match) {
          currency =
            match[1] === '£' ? 'GBP' : match[1] === '$' ? 'USD' : 'EUR';
          price = Number(match[2].replace(/,/g, ''));
        }
      }

      const sourceId = createHash('sha1')
        .update(product.productUrl)
        .digest('hex');

      await this.prisma.product.create({
        data: {
          sourceId,
          title: product.title,
          author: product.author || null,
          price,
          currency,
          imageUrl: product.imageUrl || null,
          sourceUrl: product.productUrl,
          categoryId,
          lastScrapedAt: new Date(),
        },
      });

      saved++;
    }

    if (saved > 0) {
      await this.prisma.category.update({
        where: { id: categoryId },
        data: {
          productCount: { increment: saved },
          lastScrapedAt: new Date(),
        },
      });
    }

    const finalProducts = await this.prisma.product.findMany({
      where: { categoryId },
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    const finalTotal = await this.prisma.product.count({
      where: { categoryId },
    });

    return {
      page,
      limit,
      total: finalTotal,
      products: finalProducts,
    };
  }

  async create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...data,
        lastScrapedAt: new Date(),
      },
    });
  }

  async update(id: number, data: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async scrapeAndSaveProductDetails() {
    return this.scrapeProductDetailsInternal();
  }

  async scrapeAndSaveProductDetailsByCategory(categoryId: number) {
    return this.scrapeProductDetailsInternal(categoryId);
  }

  private async scrapeProductDetailsInternal(categoryId?: number) {
    const products = await this.prisma.product.findMany({
      where: {
        detail: null,
        ...(categoryId ? { categoryId } : {}),
      },
      select: {
        id: true,
        sourceUrl: true,
      },
      take: this.SAFE_SCRAPE_LIMIT,
    });

    if (products.length === 0) {
      return { total: 0, success: 0, failed: 0 };
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let success = 0;
    let failed = 0;

    try {
      for (const product of products) {
        try {
          await page.goto(product.sourceUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
          });

          const details = await scrapeProductDetailPage(page);

          await this.prisma.productDetail.upsert({
            where: { productId: product.id },
            create: {
              productId: product.id,
              description: details.description ?? null,
              specs: details.specs ?? Prisma.DbNull,
              editorialReviews: details.editorialReviews ?? Prisma.DbNull,
              recommendedProducts: details.recommendedProducts ?? Prisma.DbNull,
            },
            update: {
              description: details.description ?? null,
              specs: details.specs ?? Prisma.DbNull,
              editorialReviews: details.editorialReviews ?? Prisma.DbNull,
              recommendedProducts: details.recommendedProducts ?? Prisma.DbNull,
            },
          });

          success++;
        } catch (err) {
          failed++;
          this.logger.error(
            `Detail scrape failed for ${product.sourceUrl}`,
            err instanceof Error ? err.stack : String(err),
          );
        }
      }
    } finally {
      await browser.close();
    }

    return {
      categoryId: categoryId ?? null,
      total: products.length,
      success,
      failed,
    };
  }
}
