import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { scrapeTopNavigation } from '../scraper/navigation.scraper';

@Injectable()
export class NavigationService {
  private readonly logger = new Logger(NavigationService.name);

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.navigation.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        lastScrapedAt: true,
      },
    });
  }

  async scrapeAndSaveNavigation() {
    const items = await scrapeTopNavigation();

    let saved = 0;

    for (const item of items) {
      await this.prisma.navigation.upsert({
        where: { slug: item.slug },
        update: {
          title: item.title,
          lastScrapedAt: new Date(),
        },
        create: {
          title: item.title,
          slug: item.slug,
          lastScrapedAt: new Date(),
        },
      });

      saved++;
    }

    this.logger.log(`Navigation scraped. Saved: ${saved}`);

    return {
      message: 'ONLY main navigation headings scraped successfully',
      saved,
    };
  }
}
