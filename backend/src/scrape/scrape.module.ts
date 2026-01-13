import { Module, forwardRef } from '@nestjs/common';
import { ScrapeService } from './scrape.service';
import { ScrapeController } from './scrape.controller';
import { ScraperOrchestratorService } from '../scraper/scraper-orchestrator.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [forwardRef(() => ProductModule)],
  controllers: [ScrapeController],
  providers: [ScrapeService, ScraperOrchestratorService],
  exports: [ScraperOrchestratorService],
})
export class ScrapeModule {}
