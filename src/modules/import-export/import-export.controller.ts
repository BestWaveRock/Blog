import {
  Controller,
  Get,
  Post,
  Res,
  HttpStatus,
  HttpException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { ImportExportService } from './import-export.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BackupResponseDto } from './dto/backup-response.dto';

@Controller('import-export')
export class ImportExportController {
  constructor(private readonly importExportService: ImportExportService) {}

  @Get('export/markdown')
  async exportArticlesToMarkdown(@Res() res: Response) {
    try {
      const content = await this.importExportService.exportArticlesToMarkdown();
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', 'attachment; filename="articles.md"');
      res.status(HttpStatus.OK).send(content);
    } catch (error) {
      throw new HttpException(
        'Failed to export articles to Markdown',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('export/json')
  async exportArticlesToJson(@Res() res: Response) {
    try {
      const content = await this.importExportService.exportArticlesToJson();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="articles.json"');
      res.status(HttpStatus.OK).send(content);
    } catch (error) {
      throw new HttpException(
        'Failed to export articles to JSON',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('export/csv/articles')
  async exportArticlesToCsv(@Res() res: Response) {
    try {
      const content = await this.importExportService.exportArticlesToCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="articles.csv"');
      res.status(HttpStatus.OK).send(content);
    } catch (error) {
      throw new HttpException(
        'Failed to export articles to CSV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('export/csv/categories')
  async exportCategoriesToCsv(@Res() res: Response) {
    try {
      const content = await this.importExportService.exportCategoriesToCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="categories.csv"');
      res.status(HttpStatus.OK).send(content);
    } catch (error) {
      throw new HttpException(
        'Failed to export categories to CSV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('export/csv/tags')
  async exportTagsToCsv(@Res() res: Response) {
    try {
      const content = await this.importExportService.exportTagsToCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="tags.csv"');
      res.status(HttpStatus.OK).send(content);
    } catch (error) {
      throw new HttpException(
        'Failed to export tags to CSV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('backup')
  async backupAllData(): Promise<BackupResponseDto> {
    try {
      const files = await this.importExportService.backupAllData();
      return {
        message: 'Backup completed successfully',
        files: files,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to backup data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('import/csv/articles')
  @UseInterceptors(FileInterceptor('file'))
  async importArticlesFromCsv(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      const csvData = file.buffer.toString('utf8');
      const importedCount = await this.importExportService.importArticlesFromCsv(csvData);

      return {
        message: `Successfully imported ${importedCount} articles from CSV`,
        importedCount: importedCount,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to import articles from CSV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('import/json/articles')
  @UseInterceptors(FileInterceptor('file'))
  async importArticlesFromJson(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      const jsonData = file.buffer.toString('utf8');
      const importedCount = await this.importExportService.importArticlesFromJson(jsonData);

      return {
        message: `Successfully imported ${importedCount} articles from JSON`,
        importedCount: importedCount,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to import articles from JSON',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}