# NestJS 博客系统用户认证模块

本模块提供了完整的用户认证和授权功能，包括用户注册、登录、JWT Token验证和RBAC权限控制。

## 功能特性

1. 用户注册（用户名、邮箱、密码）
2. 用户登录（JWT token生成）
3. 密码加密存储（使用bcryptjs）
4. JWT token验证中间件
5. RBAC权限控制（管理员、作者、普通用户）

## 安装依赖

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs class-validator class-transformer
```

## 模块结构

```
src/
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── interfaces/
│   │   ├── jwt-payload.interface.ts
│   │   └── jwt-response.interface.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/
│   ├── dto/
│   │   └── create-user.dto.ts
│   ├── user.entity.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
└── common/
    ├── decorators/
    │   └── roles.decorator.ts
    ├── enums/
    │   └── user-role.enum.ts
    └── guards/
        ├── jwt-auth.guard.ts
        └── roles.guard.ts
```

## API 接口

### 注册用户
```http
POST /auth/register
Content-Type: application/json

{
  "username": "example_user",
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

### 用户登录
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

### 获取用户资料（需要认证）
```http
GET /users/profile
Authorization: Bearer <JWT_TOKEN>
```

### 获取所有用户（仅管理员）
```http
GET /users
Authorization: Bearer <JWT_TOKEN>
```

## 使用权限控制

在控制器中使用`@Roles()`装饰器和`RolesGuard`来限制访问：

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get()
findAll() {
  return this.usersService.findAll();
}
```

## 环境变量配置

在`.env`文件中设置以下变量：

```
JWT_SECRET=mySecretKey
JWT_EXPIRES_IN=7d
```