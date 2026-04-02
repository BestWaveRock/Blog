import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private articlesService: ArticlesService,
  ) {}

  async uploadFile(
    originalName: string,
    fileName: string,
    path: string,
    mimeType: string,
    size: number,
    articleId?: number,
  ): Promise<File> {
    let article: Article | null = null;
    if (articleId) {
      article = await this.articlesService.findOne(articleId);
    }

    const file = this.filesRepository.create({
      originalName,
      fileName,
      path,
      mimeType,
      size,
      article: article || undefined,
    });

    return this.filesRepository.save(file);
  }

  async getFileById(id: number): Promise<File | null> {
    return this.filesRepository.findOne({ where: { id } });
  }

  async getFilesByArticleId(articleId: number): Promise<File[]> {
    return this.filesRepository.find({ where: { article: { id: articleId } } });
  }

  async deleteFile(id: number): Promise<void> {
    await this.filesRepository.delete(id);
  }
}