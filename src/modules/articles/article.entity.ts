import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/user.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { File } from './file.entity';

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'varchar',
    default: ArticleStatus.DRAFT
  })
  status: ArticleStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.articles, { eager: true })
  author: User;

  @ManyToMany(() => Category, { eager: true })
  @JoinTable({
    name: 'article_categories',
  })
  categories: Category[];

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable({
    name: 'article_tags',
  })
  tags: Tag[];

  @OneToMany(() => File, file => file.article, { cascade: true })
  files: File[];
}