import { IArticle } from '../../models/article.model';
import { IMulterFile } from '../../types/types';

export interface IArticleService {
  getArticlesByPreferences(preferences: string[]): Promise<IArticle[]>;
  createArticle(data: Partial<IArticle>, authorId: string, file?: IMulterFile | null): Promise<IArticle>;
  updateArticle(id: string, data: Partial<IArticle>, file?: IMulterFile | null): Promise<IArticle | null>;
  deleteArticle(id: string): Promise<boolean>;
  getArticlesByAuthor(authorId: string): Promise<IArticle[]>;
  getArticleById(id: string): Promise<IArticle | null>;
  getFeed(preferences: string[]): Promise<IArticle[]>;
  addReaction(articleId: string, userId: string, type: 'likes' | 'dislikes' | 'blocks'): Promise<IArticle | null>;
  removeReaction(articleId: string, userId: string, type: 'likes' | 'dislikes' | 'blocks'): Promise<IArticle | null>;
}
