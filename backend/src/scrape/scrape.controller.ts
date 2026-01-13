import { Controller, Post, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ScrapeService } from './scrape.service';

@Controller('scrape')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Post('backfill/descriptions')
  backfillDescriptions(@Query('limit') limit?: string) {
    const safeLimit = Math.min(Number(limit) || 10, 20);

    return this.scrapeService.backfillDescriptions(safeLimit);
  }

  @Post('backfill/descriptions/:categoryId')
  backfillDescriptionsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('limit') limit?: string,
  ) {
    const safeLimit = Math.min(Number(limit) || 10, 20);

    return this.scrapeService.backfillDescriptionsByCategory(
      categoryId,
      safeLimit,
    );
  }

  @Post('force/descriptions')
  forceFetchAllDescriptions(@Query('limit') limit?: string) {
    const safeLimit = Math.min(Number(limit) || 10, 20);

    return this.scrapeService.forceFetchAllDescriptions(safeLimit);
  }
}
