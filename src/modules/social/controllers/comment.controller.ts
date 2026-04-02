import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../entities/comment.entity';
import { NoopGuard } from '../../../common/guards/noop.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createComment(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(req.user, createCommentDto);
  }

  @Get('article/:articleId')
  @UseGuards(NoopGuard)
  async getArticleComments(
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<Comment[]> {
    return this.commentService.getArticleComments(articleId);
  }

  @Get('replies/:commentId')
  @UseGuards(NoopGuard)
  async getCommentReplies(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<Comment[]> {
    return this.commentService.getCommentReplies(commentId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateComment(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ): Promise<Comment> {
    return this.commentService.updateComment(id, content, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteComment(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.commentService.deleteComment(id, req.user.id);
  }

  @Get(':id')
  @UseGuards(NoopGuard)
  async getCommentById(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.getCommentById(id);
  }
}