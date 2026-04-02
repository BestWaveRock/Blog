import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Bookmark } from './entities/bookmark.entity';
import { Reaction } from './entities/reaction.entity';
import { Comment } from './entities/comment.entity';
import { RatingService } from './services/rating.service';
import { BookmarkService } from './services/bookmark.service';
import { ReactionService } from './services/reaction.service';
import { CommentService } from './services/comment.service';
import { RatingController } from './controllers/rating.controller';
import { BookmarkController } from './controllers/bookmark.controller';
import { ReactionController } from './controllers/reaction.controller';
import { CommentController } from './controllers/comment.controller';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating, Bookmark, Reaction, Comment]),
    ArticlesModule,
  ],
  controllers: [
    RatingController,
    BookmarkController,
    ReactionController,
    CommentController,
  ],
  providers: [
    RatingService,
    BookmarkService,
    ReactionService,
    CommentService,
  ],
  exports: [
    RatingService,
    BookmarkService,
    ReactionService,
    CommentService,
  ],
})
export class SocialModule {}