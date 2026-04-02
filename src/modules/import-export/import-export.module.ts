import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportExportService } from './import-export.service';
import { ImportExportController } from './import-export.controller';
import { ArticlesModule } from '../articles/articles.module';
import { ArticlesService } from '../articles/articles.service';
import { Article } from '../articles/article.entity';
import { Category } from '../articles/category.entity';
import { Tag } from '../articles/tag.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([Article, Category, Tag]),
    ArticlesModule,
  ],
  controllers: [ImportExportController],
  providers: [ImportExportService],
  exports: [ImportExportService],
})
export class ImportExportModule {}