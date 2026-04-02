// TypeScript类型定义

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  status: 'draft' | 'published';
  author?: User;
  categoryId?: number;
  categories?: Category[];
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  articleId: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: number;
  score: number;
  userId: number;
  articleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  id: number;
  type: 'like' | 'dislike';
  userId: number;
  articleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: number;
  userId: number;
  articleId: number;
  createdAt: string;
  updatedAt: string;
}