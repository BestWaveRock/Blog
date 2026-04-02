import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../../users/user.entity';
import { Article } from '../../articles/article.entity';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

@Entity('reactions')
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  article: Article;

  @Column({
    type: 'varchar',
  })
  type: ReactionType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}