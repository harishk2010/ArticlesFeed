import { Article, IArticle } from '../models/article.model';
import { BaseRepository } from './base.repository';
import { Types, UpdateQuery } from 'mongoose';
import { IArticleRepository } from './interfaces/IArticleRepository';

export class ArticleRepository extends BaseRepository<IArticle>  implements IArticleRepository{
  constructor() {
    super(Article);
  }

  async findByAuthor(authorId: string): Promise<IArticle[]> {
    return this.find({ author: new Types.ObjectId(authorId) });
  }

  async findByCategory(category: string): Promise<IArticle[]> {
    return this.find({ category });
  }

  async findByPreferences(preferences: string[]): Promise<IArticle[]> {
    return this.find({ category: { $in: preferences } });
  }

  async addReaction(articleId: string, userId: string, type: 'likes' | 'dislikes' | 'blocks'): Promise<IArticle | null> {
    const update: UpdateQuery<IArticle> = {
      $addToSet: { [type]: new Types.ObjectId(userId) }
    };
    return this.update(articleId, update);
  }

  async removeReaction(articleId: string, userId: string, type: 'likes' | 'dislikes' | 'blocks'): Promise<IArticle | null> {
    const update: UpdateQuery<IArticle> = {
      $pull: { [type]: new Types.ObjectId(userId) }
    };
    return this.update(articleId, update);
  }
} 