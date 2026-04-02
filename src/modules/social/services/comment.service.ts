import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { User } from '../../../users/user.entity';
import { Article } from '../../articles/article.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async createComment(user: User, createCommentDto: CreateCommentDto): Promise<Comment> {
    const article = await this.articleRepository.findOne({
      where: { id: createCommentDto.articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    let parent: Comment | null = null;
    if (createCommentDto.parentId) {
      parent = await this.commentRepository.findOne({
        where: { id: createCommentDto.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = this.commentRepository.create({
      user,
      article,
      content: createCommentDto.content,
      parent: parent || undefined,
    });

    return this.commentRepository.save(comment);
  }

  async getArticleComments(articleId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        article: { id: articleId },
        parent: undefined, // Only top-level comments
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['user'], // Include user information
    });
  }

  async getCommentReplies(commentId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        parent: { id: commentId },
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['user'], // Include user information
    });
  }

  async getUserComments(userId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateComment(commentId: number, content: string, userId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== userId) {
      throw new NotFoundException('Comment not found');
    }

    comment.content = content;
    return this.commentRepository.save(comment);
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== userId) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentRepository.remove(comment);
  }

  async getCommentById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'article', 'parent'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
}