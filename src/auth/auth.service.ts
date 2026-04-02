import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ user: Partial<User> }> {
    const user = await this.usersService.create(createUserDto);

    // 返回不包含密码的用户信息
    const { password, ...publicUser } = user;
    return { user: publicUser };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: Partial<User> }> {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role
    };

    const access_token = this.jwtService.sign(payload);

    // 返回token和不包含密码的用户信息
    const { password, ...publicUser } = user;
    return {
      access_token,
      user: publicUser
    };
  }

  async validateUser(payload: JwtPayload): Promise<User | undefined> {
    return this.usersService.findOneById(payload.sub);
  }
}