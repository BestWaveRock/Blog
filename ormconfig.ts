import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './src/users/user.entity';
import { Article } from './src/modules/articles/article.entity';
import { Category } from './src/modules/articles/category.entity';
import { Tag } from './src/modules/articles/tag.entity';
import { Comment } from './src/modules/social/entities/comment.entity';
import { Reaction } from './src/modules/social/entities/reaction.entity';
import { Bookmark } from './src/modules/social/entities/bookmark.entity';
import { Rating } from './src/modules/social/entities/rating.entity';

const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'blog.db',
  entities: [
    User,
    Article,
    Category,
    Tag,
    Comment,
    Reaction,
    Bookmark,
    Rating
  ],
  synchronize: true,
  logging: false,
};

export default dataSourceOptions;

export const AppDataSource = new DataSource(dataSourceOptions);