import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReactionService } from '../services/reaction.service';
import { CreateReactionDto } from '../dto/create-reaction.dto';
import { Reaction, ReactionType } from '../entities/reaction.entity';
import { NoopGuard } from '../../../common/guards/noop.guard';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createReaction(@Request() req, @Body() createReactionDto: CreateReactionDto) {
    return this.reactionService.createReaction(req.user, createReactionDto);
  }

  @Post('toggle/:articleId/:type')
  @UseGuards(AuthGuard('jwt'))
  async toggleReaction(
    @Request() req,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Param('type') type: ReactionType,
  ) {
    return this.reactionService.toggleReaction(req.user, articleId, type);
  }

  @Delete(':articleId')
  @UseGuards(AuthGuard('jwt'))
  async removeReaction(
    @Request() req,
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<void> {
    return this.reactionService.removeReaction(req.user.id, articleId);
  }

  @Get('article/:articleId')
  @UseGuards(NoopGuard)
  async getArticleReactions(
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<{ likes: number; dislikes: number }> {
    return this.reactionService.getArticleReactions(articleId);
  }

  @Get('user/:articleId')
  @UseGuards(AuthGuard('jwt'))
  async getUserReaction(
    @Request() req,
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<Reaction | null> {
    return this.reactionService.getUserReaction(req.user.id, articleId);
  }
}