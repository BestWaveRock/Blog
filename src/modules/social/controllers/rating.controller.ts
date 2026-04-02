import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RatingService } from '../services/rating.service';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { Rating } from '../entities/rating.entity';
import { NoopGuard } from '../../../common/guards/noop.guard';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createRating(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.createRating(req.user, createRatingDto);
  }

  @Get('article/:articleId')
  @UseGuards(NoopGuard)
  async getArticleAverageRating(
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<number> {
    return this.ratingService.getArticleAverageRating(articleId);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getUserRatings(@Param('userId', ParseIntPipe) userId: number): Promise<Rating[]> {
    return this.ratingService.getUserRatings(userId);
  }

  @Get('user/article/:articleId')
  @UseGuards(AuthGuard('jwt'))
  async getUserRating(@Request() req, @Param('articleId', ParseIntPipe) articleId: number) {
    return this.ratingService.getUserRating(req.user.id, articleId);
  }
}