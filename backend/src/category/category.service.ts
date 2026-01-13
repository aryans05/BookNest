import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { chromium } from 'playwright';

// ✅ Navbar-based scrapers (FINAL)
import { scrapeFictionSubHeadings } from '../scraper/fiction/fiction.subheading.scraper';
import { scrapeNonFictionSubHeadings } from '../scraper/non-fiction/non-fiction.subheading.scraper';
import { scrapeChildrenSubHeadings } from '../scraper/children/children.subheading.scraper';
import { scrapeRareBooksSubHeadings } from '../scraper/rare/rare-books.subheading.scraper';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({ data });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: {
        navigation: true,
        parent: true,
        children: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        navigation: true,
        parent: true,
        children: true,
        products: true,
      },
    });
  }

  update(id: number, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        navigationId: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  findByNavigation(navigationId: number) {
    return this.prisma.category.findMany({
      where: { navigationId },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });
  }

  async scrapeAndSaveCategories(navigationId: number) {
    const navigation = await this.prisma.navigation.findUnique({
      where: { id: navigationId },
    });

    if (!navigation) {
      throw new NotFoundException('Navigation not found');
    }

    let items: { name: string; slug: string }[] = [];

    //  Fiction
    if (navigation.slug === 'fiction-books') {
      const fictionItems = await scrapeFictionSubHeadings();
      items = fictionItems.map((item) => ({
        name: item.name,
        slug: item.slug,
      }));
    }

    //  Non-Fiction
    if (navigation.slug === 'non-fiction-books') {
      items = await scrapeNonFictionSubHeadings();
    }

    //  Children
    if (navigation.slug === 'childrens-books') {
      items = await scrapeChildrenSubHeadings();
    }

    //  Rare Books
    if (navigation.slug === 'rare-books') {
      const rareItems = await scrapeRareBooksSubHeadings();
      items = rareItems.map((item) => ({
        name: item.name,
        slug: item.slug,
      }));
    }

    if (!items.length) {
      return {
        message: `No sub-category scraper implemented for ${navigation.slug}`,
        saved: 0,
      };
    }

    let saved = 0;

    for (const item of items) {
      const exists = await this.prisma.category.findFirst({
        where: {
          navigationId,
          slug: item.slug,
        },
      });

      if (exists) continue;

      await this.prisma.category.create({
        data: {
          title: item.name,
          slug: item.slug,
          navigationId,
          lastScrapedAt: new Date(),
        },
      });

      saved++;
    }

    return {
      message: 'Sub-categories scraped successfully',
      saved,
    };
  }

  // ======================
  // SCRAPING (GENERIC – FALLBACK ONLY)
  // ======================

  async scrapeAndSaveFromUrl(navigationId: number, pageUrl: string) {
    const navigation = await this.prisma.navigation.findUnique({
      where: { id: navigationId },
    });

    if (!navigation) {
      throw new NotFoundException('Navigation not found');
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    });

    try {
      await page.goto(pageUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      const items = await page.$$eval('a[href*="/collections/"]', (anchors) =>
        anchors
          .map((a) => ({
            name: a.textContent?.replace(/\s+/g, ' ').trim() || '',
          }))
          .filter((a) => a.name.length > 2)
          .slice(0, 5),
      );

      let saved = 0;

      for (const item of items) {
        const name = item.name.replace(/’/g, "'").trim();
        const slug = name
          .toLowerCase()
          .replace(/'/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const exists = await this.prisma.category.findFirst({
          where: {
            navigationId,
            slug,
          },
        });

        if (exists) continue;

        await this.prisma.category.create({
          data: {
            title: name,
            slug,
            navigationId,
            lastScrapedAt: new Date(),
          },
        });

        saved++;
      }

      return {
        message: 'Categories scraped successfully (generic)',
        saved,
      };
    } finally {
      await browser.close();
    }
  }
}
