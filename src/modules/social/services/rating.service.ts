import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { User } from '../../../users/user.entity';
import { Article } from '../../articles/article.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async createRating(user: User, createRatingDto: CreateRatingDto): Promise<Rating> {
    const article = await this.articleRepository.findOne({
      where: { id: createRatingDto.articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if user already rated this article
    let rating = await this.ratingRepository.findOne({
      where: {
        user: { id: user.id },
        article: { id: article.id },
      },
    });

    if (rating) {
      // Update existing rating
      rating.score = createRatingDto.score;
      return this.ratingRepository.save(rating);
    } else {
      // Create new rating
      rating = this.ratingRepository.create({
        user,
        article,
        score: createRatingDto.score,
      });
      return this.ratingRepository.save(rating);
    }
  }

  async getUserRating(userId: number, articleId: number): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: {
        user: { id: userId },
        article: { id: articleId },
      },
    });
  }

  async getArticleAverageRating(articleId: number): Promise<number> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.score)', 'average')
      .where('rating.articleId = :articleId', { articleId })
      .getRawOne();

    return result ? parseFloat(result.average) : 0;
  }

  async getUserRatings(userId: number): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}