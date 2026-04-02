import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AddCategoriesTagsDto } from './dto/add-categories-tags.dto';
import { ArticleStatus } from './article.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    // In a real application, you would get the author ID from the JWT token
    // For now, we'll pass a placeholder author ID
    return this.articlesService.create(createArticleDto, 1);
  }

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('status') status?: ArticleStatus,
  ) {
    return this.articlesService.findAll(page, limit, status);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    await this.articlesService.remove(id);
    return { message: 'Article deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/publish')
  async publish(@Param('id', new ParseIntPipe()) id: number) {
    return this.articlesService.publish(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unpublish')
  async unpublish(@Param('id', new ParseIntPipe()) id: number) {
    return this.articlesService.unpublish(id);
  }

  @Get('search/:keyword')
  async search(
    @Param('keyword') keyword: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.articlesService.search(keyword, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/categories-tags')
  async addCategoriesAndTags(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() addCategoriesTagsDto: AddCategoriesTagsDto,
  ) {
    return this.articlesService.addCategoriesAndTags(id, addCategoriesTagsDto);
  }
}