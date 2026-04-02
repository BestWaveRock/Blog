import { IsInt, IsEnum } from 'class-validator';
import { ReactionType } from '../entities/reaction.entity';

export class CreateReactionDto {
  @IsInt()
  articleId: number;

  @IsEnum(ReactionType)
  type: ReactionType;
}