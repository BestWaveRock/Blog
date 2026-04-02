# 数据导入导出功能使用指南

本指南介绍了如何使用博客系统的数据导入导出功能，包括Markdown、CSV和JSON格式的支持，以及定时备份任务的配置。

## 功能概述

1. **Markdown格式导入导出** - 支持文章内容的Markdown格式转换
2. **CSV批量操作** - 支持文章、分类、标签的批量导入导出
3. **JSON数据交换** - 支持完整数据结构的序列化和反序列化
4. **定时备份任务** - 自动定期备份数据到多种格式

## API接口说明

### 导出接口

#### 导出文章为Markdown格式
```bash
GET /api/import-export/export/markdown
```

#### 导出文章为JSON格式
```bash
GET /api/import-export/export/json
```

#### 导出文章为CSV格式
```bash
GET /api/import-export/export/csv/articles
```

#### 导出分类为CSV格式
```bash
GET /api/import-export/export/csv/categories
```

#### 导出标签为CSV格式
```bash
GET /api/import-export/export/csv/tags
```

### 导入接口

#### 从CSV文件导入文章
```bash
POST /api/import-export/import/csv/articles
Content-Type: multipart/form-data

file: articles.csv
```

#### 从JSON文件导入文章
```bash
POST /api/import-export/import/json/articles
Content-Type: multipart/form-data

file: articles.json
```

### 备份接口

#### 手动触发数据备份
```bash
POST /api/import-export/backup
```

## 文件格式说明

### Markdown导出格式
导出的Markdown文件包含所有文章的标题、作者、状态、分类、标签、摘要和正文内容。

### CSV导出格式

#### 文章CSV格式
```
ID,Title,Summary,Content,Status,Author,Categories,Tags,CreatedAt,UpdatedAt
1,"文章标题","文章摘要","文章内容","published","作者名","分类1;分类2","标签1;标签2","2023-01-01T00:00:00.000Z","2023-01-01T00:00:00.000Z"
```

#### 分类CSV格式
```
ID,Name,Description,CreatedAt,UpdatedAt
1,"技术","技术相关文章","2023-01-01T00:00:00.000Z","2023-01-01T00:00:00.000Z"
```

#### 标签CSV格式
```
ID,Name,CreatedAt,UpdatedAt
1,"JavaScript","2023-01-01T00:00:00.000Z","2023-01-01T00:00:00.000Z"
```

### JSON导出格式
JSON格式包含完整的文章对象结构，包括关联的作者、分类和标签信息。

## 定时备份任务

系统默认配置了每日凌晨2点的自动备份任务，会生成以下文件：
- articles-{timestamp}.md (Markdown格式)
- articles-{timestamp}.json (JSON格式)
- articles-{timestamp}.csv (文章CSV格式)
- categories-{timestamp}.csv (分类CSV格式)
- tags-{timestamp}.csv (标签CSV格式)

备份文件存储在项目根目录下的`exports`文件夹中。

## 使用示例

### 导出文章为CSV格式
```bash
curl -X GET http://localhost:3000/api/import-export/export/csv/articles \
  -o articles.csv
```

### 从CSV文件导入文章
```bash
curl -X POST http://localhost:3000/api/import-export/import/csv/articles \
  -F "file=@articles.csv" \
  -H "Content-Type: multipart/form-data"
```

### 手动触发备份
```bash
curl -X POST http://localhost:3000/api/import-export/backup
```

## 注意事项

1. 导入功能会根据作者用户名查找现有用户，如果用户不存在则会自动创建
2. 导入功能会自动处理分类和标签，如果不存在则会自动创建
3. 备份文件会保存在项目根目录的`exports`文件夹中
4. 确保服务器有足够的磁盘空间来存储导出和备份文件
5. 在生产环境中，请确保备份文件的安全性，避免敏感数据泄露