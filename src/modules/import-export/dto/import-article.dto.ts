export class ImportArticleDto {
  title: string;
  summary?: string;
  content: string;
  status?: string;
  authorUsername: string;
  categories?: string[];
  tags?: string[];
}