import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Article } from './article.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  originalName: string;

  @Column({ length: 255 })
  fileName: string;

  @Column({ length: 255 })
  path: string;

  @Column({ length: 50 })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar', length: 20, default: 'article' })
  fileType: string;

  @ManyToOne(() => Article, article => article.files, { onDelete: 'CASCADE' })
  article: Article;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}