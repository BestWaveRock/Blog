import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../../users/user.entity';
import { Article } from '../../articles/article.entity';

@Entity('bookmarks')
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  article: Article;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}