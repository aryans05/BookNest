import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ScrapeModule } from '../scrape/scrape.module';

@Module({
  imports: [
    ScrapeModule, // ✅ THIS IS THE KEY FIX
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
