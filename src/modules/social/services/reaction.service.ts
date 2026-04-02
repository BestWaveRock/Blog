import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction, ReactionType } from '../entities/reaction.entity';
import { CreateReactionDto } from '../dto/create-reaction.dto';
import { User } from '../../../users/user.entity';
import { Article } from '../../articles/article.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async createReaction(user: User, createReactionDto: CreateReactionDto): Promise<Reaction> {
    const article = await this.articleRepository.findOne({
      where: { id: createReactionDto.articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if user already reacted to this article
    let reaction = await this.reactionRepository.findOne({
      where: {
        user: { id: user.id },
        article: { id: article.id },
      },
    });

    if (reaction) {
      // Update existing reaction
      reaction.type = createReactionDto.type;
      reaction = await this.reactionRepository.save(reaction);
    } else {
      // Create new reaction
      reaction = this.reactionRepository.create({
        user,
        article,
        type: createReactionDto.type,
      });
      reaction = await this.reactionRepository.save(reaction);
    }

    return reaction;
  }

  async removeReaction(userId: number, articleId: number): Promise<void> {
    await this.reactionRepository.delete({
      user: { id: userId },
      article: { id: articleId },
    });
  }

  async getArticleReactions(articleId: number): Promise<{ likes: number; dislikes: number }> {
    const likes = await this.reactionRepository.count({
      where: {
        article: { id: articleId },
        type: ReactionType.LIKE,
      },
    });

    const dislikes = await this.reactionRepository.count({
      where: {
        article: { id: articleId },
        type: ReactionType.DISLIKE,
      },
    });

    return { likes, dislikes };
  }

  async getUserReaction(userId: number, articleId: number): Promise<Reaction | null> {
    return this.reactionRepository.findOne({
      where: {
        user: { id: userId },
        article: { id: articleId },
      },
    });
  }

  async toggleReaction(user: User, articleId: number, type: ReactionType): Promise<Reaction | null> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if user already reacted to this article with the same type
    const existingReaction = await this.reactionRepository.findOne({
      where: {
        user: { id: user.id },
        article: { id: article.id },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction if same type
        await this.reactionRepository.remove(existingReaction);
        return null;
      } else {
        // Update reaction type
        existingReaction.type = type;
        return this.reactionRepository.save(existingReaction);
      }
    } else {
      // Create new reaction
      const reaction = this.reactionRepository.create({
        user,
        article,
        type,
      });
      return this.reactionRepository.save(reaction);
    }
  }
}