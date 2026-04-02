# NestJS Blog System Project Structure

## Directory Layout

```
src/
├── auth/                         # 认证模块
│   ├── dto/                      # 数据传输对象
│   │   └── login.dto.ts         # 登录DTO
│   ├── interfaces/              # 接口定义
│   │   ├── jwt-payload.interface.ts
│   │   └── jwt-response.interface.ts
│   ├── strategies/              # Passport策略
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts       # 认证控制器
│   ├── auth.module.ts           # 认证模块
│   └── auth.service.ts          # 认证服务
├── common/                      # 公共模块
│   ├── config/                  # 配置文件
│   │   └── env.config.ts
│   ├── decorators/              # 自定义装饰器
│   │   └── roles.decorator.ts
│   ├── enums/                   # 枚举类型
│   │   └── user-role.enum.ts
│   └── guards/                  # 守卫
│       ├── jwt-auth.guard.ts
│       └── roles.guard.ts
├── users/                       # 用户模块
│   ├── dto/                     # 数据传输对象
│   │   └── create-user.dto.ts
│   ├── user.entity.ts           # 用户实体
│   ├── users.controller.ts     # 用户控制器
│   ├── users.module.ts         # 用户模块
│   └── users.service.ts        # 用户服务
├── app.controller.ts           # 主控制器
├── app.module.ts               # 主模块
├── app.service.ts              # 主服务
└── main.ts                     # 应用入口文件

test/                            # 测试文件
```

## Key Files

- **package.json**: Project dependencies and scripts
- **nest-cli.json**: NestJS CLI configuration
- **tsconfig.json**: TypeScript configuration
- **tsconfig.build.json**: TypeScript build configuration
- **eslint.config.mjs**: ESLint configuration
- **.prettierrc**: Prettier configuration
- **.env**: Environment variables
- **.env.example**: Environment variables template

## 模块说明

### 认证模块 (auth)
- 处理用户身份验证（注册、登录）
- JWT Token生成与验证
- 包含登录DTO和JWT相关接口定义

### 用户模块 (users)
- 用户实体定义及数据库操作
- 用户服务层实现
- 用户控制器提供用户相关API

### 公共模块 (common)
- 共享的装饰器、枚举和守卫
- 角色权限控制实现
- JWT认证守卫

## 核心功能实现

### 1. 用户注册
- 通过 `/auth/register` 端点接收用户名、邮箱和密码
- 使用bcryptjs对密码进行加密存储
- 验证用户输入数据格式

### 2. 用户登录
- 通过 `/auth/login` 端点验证用户凭据
- 成功后生成JWT Token返回给客户端

### 3. JWT Token验证
- 使用Passport.js和JWT策略实现
- 提供JwtAuthGuard用于保护路由

### 4. RBAC权限控制
- 基于角色的访问控制（Role-Based Access Control）
- 提供RolesGuard和Roles装饰器
- 支持ADMIN、AUTHOR、USER三种角色