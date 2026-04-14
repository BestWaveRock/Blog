import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    // 确保上传目录存在
    const uploadDir = './uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查邮箱是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }],
    });

    if (existingUser) {
      throw new ConflictException('用户名或邮箱已存在');
    }

    // 创建新用户
    const user = this.usersRepository.create(createUserDto);

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // 保存用户
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user || null;
  }

  async findOneById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user || undefined;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      // 移除密码字段
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async updateProfile(userId: number, updateData: { username?: string; email?: string }): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查用户名是否已被使用
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await this.usersRepository.findOne({ where: { username: updateData.username } });
      if (existingUser) {
        throw new ConflictException('用户名已被使用');
      }
    }

    // 检查邮箱是否已被使用
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({ where: { email: updateData.email } });
      if (existingUser) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    // 更新用户资料
    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  async updateAvatar(userId: number, avatarPath: string): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 如果用户已有头像，删除旧头像
    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // 更新头像路径
    user.avatar = avatarPath;
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}