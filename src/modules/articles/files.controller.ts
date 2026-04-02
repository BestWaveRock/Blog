import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File } from './file.entity';

// 配置文件存储
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = extname(file.originalname);
    callback(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<File> {
    // 从请求中获取文章ID（如果有）
    const articleId = req.body.articleId ? parseInt(req.body.articleId) : null;

    // 保存文件信息到数据库
    return this.filesService.uploadFile(
      file.originalname,
      file.filename,
      file.path,
      file.mimetype,
      file.size,
      articleId ?? undefined,
    );
  }

  @Get(':id')
  async getFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<any> {
    const file = await this.filesService.getFileById(id);

    if (!file) {
      return res.status(404).send('File not found');
    }

    // 设置响应头
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);

    // 发送文件
    return res.sendFile(file.path, { root: '.' });
  }

  @Get('article/:articleId')
  async getFilesByArticleId(
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<File[]> {
    return this.filesService.getFilesByArticleId(articleId);
  }
}