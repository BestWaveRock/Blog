import { IsInt } from 'class-validator';

export class CreateBookmarkDto {
  @IsInt()
  articleId: number;
}