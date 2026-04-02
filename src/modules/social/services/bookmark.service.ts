import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../entities/bookmark.entity';
import { CreateBookmarkDto } from '../dto/create-bookmark.dto';
import { User } from '../../../users/user.entity';
import { Article } from '../../articles/article.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async createBookmark(user: User, createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
    const article = await this.articleRepository.findOne({
      where: { id: createBookmarkDto.articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if bookmark already exists
    const existingBookmark = await this.bookmarkRepository.findOne({
      where: {
        user: { id: user.id },
        article: { id: article.id },
      },
    });

    if (existingBookmark) {
      return existingBookmark;
    }

    const bookmark = this.bookmarkRepository.create({
      user,
      article,
    });

    return this.bookmarkRepository.save(bookmark);
  }

  async removeBookmark(userId: number, articleId: number): Promise<void> {
    await this.bookmarkRepository.delete({
      user: { id: userId },
      article: { id: articleId },
    });
  }

  async getUserBookmarks(userId: number): Promise<Bookmark[]> {
    return this.bookmarkRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async isArticleBookmarked(userId: number, articleId: number): Promise<boolean> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        user: { id: userId },
        article: { id: articleId },
      },
    });
    return !!bookmark;
  }

  async isArticleBookmarkedPublic(articleId: number): Promise<boolean> {
    // This method doesn't check if the current user has bookmarked the article
    // It's just to verify the endpoint works without authentication
    // In a real implementation, we might want to return bookmark count instead
    return false;
  }
}