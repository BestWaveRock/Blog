import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Article, ArticleStatus } from '../articles/article.entity';
import { Category } from '../articles/category.entity';
import { Tag } from '../articles/tag.entity';
import { ArticlesService } from '../articles/articles.service';
import { User } from '../../users/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Cron, CronExpression } from '@nestjs/schedule';
import { parse } from 'csv-parse/sync';

@Injectable()
export class ImportExportService {
  private readonly logger = new Logger(ImportExportService.name);

  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    private articlesService: ArticlesService,
  ) {}

  // 导出所有文章为Markdown格式
  async exportArticlesToMarkdown(): Promise<string> {
    const articles = await this.articlesRepository.find({
      relations: ['author', 'categories', 'tags']
    });

    let markdownContent = '# Blog Articles Export\n\n';

    for (const article of articles) {
      markdownContent += `## ${article.title}\n\n`;
      markdownContent += `**Author:** ${article.author.username}\n\n`;
      markdownContent += `**Status:** ${article.status}\n\n`;
      markdownContent += `**Created:** ${article.createdAt.toISOString()}\n\n`;
      markdownContent += `**Updated:** ${article.updatedAt.toISOString()}\n\n`;

      if (article.categories && article.categories.length > 0) {
        markdownContent += `**Categories:** ${article.categories.map(c => c.name).join(', ')}\n\n`;
      }

      if (article.tags && article.tags.length > 0) {
        markdownContent += `**Tags:** ${article.tags.map(t => t.name).join(', ')}\n\n`;
      }

      if (article.summary) {
        markdownContent += `### Summary\n\n${article.summary}\n\n`;
      }

      markdownContent += `### Content\n\n${article.content}\n\n`;
      markdownContent += '---\n\n';
    }

    return markdownContent;
  }

  // 导出所有文章为JSON格式
  async exportArticlesToJson(): Promise<string> {
    const articles = await this.articlesRepository.find({
      relations: ['author', 'categories', 'tags']
    });

    return JSON.stringify(articles, null, 2);
  }

  // 导出所有文章为CSV格式
  async exportArticlesToCsv(): Promise<string> {
    const articles = await this.articlesRepository.find({
      relations: ['author', 'categories', 'tags']
    });

    // CSV header
    let csvContent = 'ID,Title,Summary,Content,Status,Author,Categories,Tags,CreatedAt,UpdatedAt\n';

    // CSV rows
    for (const article of articles) {
      const row = [
        article.id,
        `"${article.title.replace(/"/g, '""')}"`,
        `"${(article.summary || '').replace(/"/g, '""')}"`,
        `"${article.content.replace(/"/g, '""')}"`,
        article.status,
        article.author.username,
        `"${(article.categories || []).map(c => c.name).join(';')}"`,
        `"${(article.tags || []).map(t => t.name).join(';')}"`,
        article.createdAt.toISOString(),
        article.updatedAt.toISOString()
      ].join(',');

      csvContent += row + '\n';
    }

    return csvContent;
  }

  // 导出所有分类为CSV格式
  async exportCategoriesToCsv(): Promise<string> {
    const categories = await this.categoriesRepository.find();

    // CSV header
    let csvContent = 'ID,Name,Description,CreatedAt,UpdatedAt\n';

    // CSV rows
    for (const category of categories) {
      const row = [
        category.id,
        `"${category.name.replace(/"/g, '""')}"`,
        `"${(category.description || '').replace(/"/g, '""')}"`,
        category.createdAt.toISOString(),
        category.updatedAt.toISOString()
      ].join(',');

      csvContent += row + '\n';
    }

    return csvContent;
  }

  // 导出所有标签为CSV格式
  async exportTagsToCsv(): Promise<string> {
    const tags = await this.tagsRepository.find();

    // CSV header
    let csvContent = 'ID,Name,CreatedAt,UpdatedAt\n';

    // CSV rows
    for (const tag of tags) {
      const row = [
        tag.id,
        `"${tag.name.replace(/"/g, '""')}"`,
        tag.createdAt.toISOString(),
        tag.updatedAt.toISOString()
      ].join(',');

      csvContent += row + '\n';
    }

    return csvContent;
  }

  // 解析CSV数据并导入文章
  async importArticlesFromCsv(csvData: string): Promise<number> {
    try {
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ',',
      });

      let importedCount = 0;

      for (const record of records as any[]) {
        // 查找或创建作者
        let author = await this.articlesRepository.manager.getRepository(User)
          .findOne({ where: { username: record.Author } });

        if (!author) {
          // 如果作者不存在，创建一个默认作者
          const userRepository = this.articlesRepository.manager.getRepository(User);
          author = userRepository.create({
            username: record.Author,
            email: `${record.Author}@example.com`,
            password: 'password', // 实际应用中应加密密码
          });
          author = await userRepository.save(author);
        }

        // 处理分类
        let categories: Category[] = [];
        if (record.Categories) {
          const categoryNames = record.Categories.split(';').map((name: string) => name.trim());
          categories = await this.categoriesRepository.find({
            where: { name: In(categoryNames) }
          });

          // 创建不存在的分类
          const existingCategoryNames = categories.map(cat => cat.name);
          const missingCategories = categoryNames.filter(
            (name: string) => !existingCategoryNames.includes(name)
          );

          for (const categoryName of missingCategories) {
            if (categoryName) {
              const newCategory = this.categoriesRepository.create({
                name: categoryName,
                description: `Category ${categoryName}`,
              });
              categories.push(await this.categoriesRepository.save(newCategory));
            }
          }
        }

        // 处理标签
        let tags: Tag[] = [];
        if (record.Tags) {
          const tagNames = record.Tags.split(';').map((name: string) => name.trim());
          tags = await this.tagsRepository.find({
            where: { name: In(tagNames) }
          });

          // 创建不存在的标签
          const existingTagNames = tags.map(tag => tag.name);
          const missingTags = tagNames.filter(
            (name: string) => !existingTagNames.includes(name)
          );

          for (const tagName of missingTags) {
            if (tagName) {
              const newTag = this.tagsRepository.create({ name: tagName });
              tags.push(await this.tagsRepository.save(newTag));
            }
          }
        }

        // 创建文章
        const article = this.articlesRepository.create({
          title: record.Title,
          summary: record.Summary || '',
          content: record.Content,
          status: record.Status || ArticleStatus.DRAFT,
          author: author,
          categories: categories,
          tags: tags,
        });

        await this.articlesRepository.save(article);
        importedCount++;
      }

      return importedCount;
    } catch (error) {
      this.logger.error('Failed to import articles from CSV', error.stack);
      throw new BadRequestException('Failed to import articles from CSV');
    }
  }

  // 从JSON数据导入文章
  async importArticlesFromJson(jsonData: string): Promise<number> {
    try {
      const articlesData = JSON.parse(jsonData);

      let importedCount = 0;

      for (const articleData of articlesData) {
        // 查找或创建作者
        let author = await this.articlesRepository.manager.getRepository(User)
          .findOne({ where: { username: articleData.author.username } });

        if (!author) {
          // 如果作者不存在，创建一个默认作者
          const userRepository = this.articlesRepository.manager.getRepository(User);
          author = userRepository.create({
            username: articleData.author.username,
            email: articleData.author.email || `${articleData.author.username}@example.com`,
            password: 'password', // 实际应用中应加密密码
          });
          author = await userRepository.save(author);
        }

        // 处理分类
        let categories: Category[] = [];
        if (articleData.categories && articleData.categories.length > 0) {
          const categoryNames = articleData.categories.map((cat: any) => cat.name);
          categories = await this.categoriesRepository.find({
            where: { name: In(categoryNames) }
          });

          // 创建不存在的分类
          const existingCategoryNames = categories.map(cat => cat.name);
          const missingCategories = categoryNames.filter(
            (name: string) => !existingCategoryNames.includes(name)
          );

          for (const categoryName of missingCategories) {
            if (categoryName) {
              const newCategory = this.categoriesRepository.create({
                name: categoryName,
                description: `Category ${categoryName}`,
              });
              categories.push(await this.categoriesRepository.save(newCategory));
            }
          }
        }

        // 处理标签
        let tags: Tag[] = [];
        if (articleData.tags && articleData.tags.length > 0) {
          const tagNames = articleData.tags.map((tag: any) => tag.name);
          tags = await this.tagsRepository.find({
            where: { name: In(tagNames) }
          });

          // 创建不存在的标签
          const existingTagNames = tags.map(tag => tag.name);
          const missingTags = tagNames.filter(
            (name: string) => !existingTagNames.includes(name)
          );

          for (const tagName of missingTags) {
            if (tagName) {
              const newTag = this.tagsRepository.create({ name: tagName });
              tags.push(await this.tagsRepository.save(newTag));
            }
          }
        }

        // 创建文章
        const article = this.articlesRepository.create({
          title: articleData.title,
          summary: articleData.summary || '',
          content: articleData.content,
          status: articleData.status || ArticleStatus.DRAFT,
          author: author,
          categories: categories,
          tags: tags,
        });

        await this.articlesRepository.save(article);
        importedCount++;
      }

      return importedCount;
    } catch (error) {
      this.logger.error('Failed to import articles from JSON', error.stack);
      throw new BadRequestException('Failed to import articles from JSON');
    }
  }

  // 保存导出文件到指定路径
  saveToFile(content: string, filename: string): string {
    const exportDir = path.join(process.cwd(), 'exports');

    // 确保导出目录存在
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filePath = path.join(exportDir, filename);
    fs.writeFileSync(filePath, content);

    return filePath;
  }

  // 定时备份所有数据
  async backupAllData(): Promise<string[]> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const files: string[] = [];

    // 备份文章为Markdown
    const markdownContent = await this.exportArticlesToMarkdown();
    const markdownFile = this.saveToFile(markdownContent, `articles-${timestamp}.md`);
    files.push(markdownFile);

    // 备份文章为JSON
    const jsonContent = await this.exportArticlesToJson();
    const jsonFile = this.saveToFile(jsonContent, `articles-${timestamp}.json`);
    files.push(jsonFile);

    // 备份文章为CSV
    const articlesCsvContent = await this.exportArticlesToCsv();
    const articlesCsvFile = this.saveToFile(articlesCsvContent, `articles-${timestamp}.csv`);
    files.push(articlesCsvFile);

    // 备份分类为CSV
    const categoriesCsvContent = await this.exportCategoriesToCsv();
    const categoriesCsvFile = this.saveToFile(categoriesCsvContent, `categories-${timestamp}.csv`);
    files.push(categoriesCsvFile);

    // 备份标签为CSV
    const tagsCsvContent = await this.exportTagsToCsv();
    const tagsCsvFile = this.saveToFile(tagsCsvContent, `tags-${timestamp}.csv`);
    files.push(tagsCsvFile);

    return files;
  }

  // 每天凌晨2点执行自动备份
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyBackup() {
    try {
      this.logger.log('Starting daily backup...');
      const files = await this.backupAllData();
      this.logger.log(`Daily backup completed. Files created: ${files.join(', ')}`);
    } catch (error) {
      this.logger.error('Daily backup failed', error.stack);
    }
  }
}