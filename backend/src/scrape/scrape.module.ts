import { Module } from '@nestjs/common';
import { ScrapeController } from './scrape.controller';
import { ScrapeService } from './scrape.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ScraperOrchestratorService } from '../scraper/scraper-orchestrator.service';

@Module({
  imports: [PrismaModule],
  controllers: [ScrapeController],
  providers: [ScrapeService, ScraperOrchestratorService],
})
export class ScrapeModule {}
