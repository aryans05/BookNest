import { Controller, Get, Post } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller('navigations')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  // GET /navigations
  @Get()
  findAll() {
    return this.navigationService.findAll();
  }

  // POST /navigations/scrape
  @Post('scrape')
  scrapeNavigation() {
    return this.navigationService.scrapeAndSaveNavigation();
  }
}
