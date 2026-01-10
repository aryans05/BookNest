import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { NavigationModule } from './navigation/navigation.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ScrapeModule } from './scrape/scrape.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    NavigationModule,
    CategoryModule,
    ProductModule,
    ScrapeModule,
  ],
})
export class AppModule {}
