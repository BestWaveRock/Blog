import { IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  articleId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}