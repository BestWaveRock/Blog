import { IsArray, IsOptional } from 'class-validator';

export class AddCategoriesTagsDto {
  @IsOptional()
  @IsArray()
  categoryIds?: number[];

  @IsOptional()
  @IsArray()
  tagIds?: number[];
}