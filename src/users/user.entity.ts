import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { Article } from '../modules/articles/article.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    default: UserRole.USER
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    nullable: true
  })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Article, article => article.author)
  articles: Article[];

  // 用于隐藏密码字段的 toJSON 方法
  toJSON(): any {
    const { password, ...publicUser } = this;
    return publicUser;
  }
}