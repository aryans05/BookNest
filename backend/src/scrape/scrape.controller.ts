import { Controller, Post } from '@nestjs/common';
import { ScrapeService } from './scrape.service';

@Controller('scrape')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Post('books')
  scrapeBooks() {
    return this.scrapeService.scrapeBooks();
  }
}
