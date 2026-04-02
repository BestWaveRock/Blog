import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  articleId: number;

  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}