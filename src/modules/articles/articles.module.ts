import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { File } from './file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Category, Tag, File]),
  ],
  controllers: [ArticlesController, FilesController],
  providers: [ArticlesService, FilesService],
  exports: [ArticlesService, FilesService, TypeOrmModule],
})
export class ArticlesModule {}