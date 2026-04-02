import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Article, ArticleStatus } from './article.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AddCategoriesTagsDto } from './dto/add-categories-tags.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createArticleDto: CreateArticleDto, authorId: number): Promise<Article> {
    const { categoryIds, tagIds, ...articleData } = createArticleDto;

    const article = this.articlesRepository.create({
      ...articleData,
      author: { id: authorId },
    });

    // Handle categories
    if (categoryIds && categoryIds.length > 0) {
      article.categories = await this.categoriesRepository.find({
        where: { id: In(categoryIds) }
      });
    }

    // Handle tags
    if (tagIds && tagIds.length > 0) {
      article.tags = await this.tagsRepository.find({
        where: { id: In(tagIds) }
      });
    }

    return this.articlesRepository.save(article);
  }

  async findAll(page: number = 1, limit: number = 10, status?: ArticleStatus): Promise<[Article[], number]> {
    const queryBuilder = this.articlesRepository.createQueryBuilder('article');

    if (status) {
      queryBuilder.andWhere('article.status = :status', { status });
    }

    return queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('article.createdAt', 'DESC')
      .getManyAndCount();
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['author', 'categories', 'tags']
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);

    const { categoryIds, tagIds, ...updateData } = updateArticleDto;
    Object.assign(article, updateData);

    // Handle categories
    if (categoryIds) {
      if (categoryIds.length > 0) {
        article.categories = await this.categoriesRepository.find({
          where: { id: In(categoryIds) }
        });
      } else {
        article.categories = [];
      }
    }

    // Handle tags
    if (tagIds) {
      if (tagIds.length > 0) {
        article.tags = await this.tagsRepository.find({
          where: { id: In(tagIds) }
        });
      } else {
        article.tags = [];
      }
    }

    return this.articlesRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articlesRepository.remove(article);
  }

  async publish(id: number): Promise<Article> {
    const article = await this.findOne(id);
    article.status = ArticleStatus.PUBLISHED;
    return this.articlesRepository.save(article);
  }

  async unpublish(id: number): Promise<Article> {
    const article = await this.findOne(id);
    article.status = ArticleStatus.DRAFT;
    return this.articlesRepository.save(article);
  }

  async search(keyword: string, page: number = 1, limit: number = 10): Promise<[Article[], number]> {
    return this.articlesRepository.findAndCount({
      where: [
        { title: Like(`%${keyword}%`) },
        { content: Like(`%${keyword}%`) },
        { summary: Like(`%${keyword}%`) },
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async addCategoriesAndTags(id: number, addCategoriesTagsDto: AddCategoriesTagsDto): Promise<Article> {
    const article = await this.findOne(id);

    const { categoryIds, tagIds } = addCategoriesTagsDto;

    // Handle categories
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoriesRepository.find({
        where: { id: In(categoryIds) }
      });
      article.categories = [...article.categories, ...categories];
    }

    // Handle tags
    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagsRepository.find({
        where: { id: In(tagIds) }
      });
      article.tags = [...article.tags, ...tags];
    }

    return this.articlesRepository.save(article);
  }
}