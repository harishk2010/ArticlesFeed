import { IArticle } from '../../models/article.model';
import { IBaseRepository } from './IBaseRepository';

export interface IArticleRepository extends IBaseRepository<IArticle>{
  findByAuthor(authorId: string): Promise<IArticle[]>;
  findByCategory(category: string): Promise<IArticle[]>;
  findByPreferences(preferences: string[]): Promise<IArticle[]>;
  addReaction(articleId: string, userId: string, type: 'likes' | 'dislikes' | 'blocks'): Promise<IArticle | null>;
  removeReaction(articleId: string, userId: string, type: 'likes' | 'dislikes' | 'blocks'): Promise<IArticle | null>;
}
