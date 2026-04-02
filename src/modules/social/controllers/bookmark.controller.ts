import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarkService } from '../services/bookmark.service';
import { CreateBookmarkDto } from '../dto/create-bookmark.dto';
import { Bookmark } from '../entities/bookmark.entity';
import { NoopGuard } from '../../../common/guards/noop.guard';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createBookmark(@Request() req, @Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(req.user, createBookmarkDto);
  }

  @Delete(':articleId')
  @UseGuards(AuthGuard('jwt'))
  async removeBookmark(
    @Request() req,
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<void> {
    return this.bookmarkService.removeBookmark(req.user.id, articleId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserBookmarks(@Request() req): Promise<Bookmark[]> {
    return this.bookmarkService.getUserBookmarks(req.user.id);
  }

  @Get(':articleId')
  @UseGuards(NoopGuard)
  async isArticleBookmarked(
    @Request() req,
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<boolean> {
    if (req.user) {
      return this.bookmarkService.isArticleBookmarked(req.user.id, articleId);
    }
    // For unauthenticated requests, return false or implement public logic
    return this.bookmarkService.isArticleBookmarkedPublic(articleId);
  }
}