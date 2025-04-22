import { ArticleRepository } from '../repositories/article.repository';
import { IArticle } from '../models/article.model';
import { uploadToS3Bucket } from '../utils/s3';
import { Types } from 'mongoose';
import { IMulterFile } from '../types/types';
import { IArticleService } from './interfaces/IArticleService';
import { IArticleRepository } from '../repositories/interfaces/IArticleRepository';


export class ArticleService implements IArticleService {

  private articleRepository:IArticleRepository
  constructor(articleRepository:IArticleRepository){
    this.articleRepository=articleRepository
  }

  async getArticlesByPreferences(preferences: string[]): Promise<IArticle[]> {
    return this.articleRepository.find({ category: { $in: preferences } as any });
  }

  async createArticle(data: Partial<IArticle>, authorId: string, file?: IMulterFile | null): Promise<IArticle> {
    if (file) {
      const imageUrl = await uploadToS3Bucket(file, 'article-images');
      data.imageUrl = imageUrl;
    }
    
    const articleData: Partial<IArticle> = {
      ...data,
      author: new Types.ObjectId(authorId),
      likes: [],
      dislikes: [],
      blocks: []
    };
    
    return this.articleRepository.create(articleData);
  }

  async updateArticle(id: string, data: Partial<IArticle>, file?: IMulterFile | null): Promise<IArticle | null> {
    if (file) {
      const imageUrl = await uploadToS3Bucket(file, 'article-images');
      data.imageUrl = imageUrl;
    }
    return this.articleRepository.update(id, data);
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articleRepository.delete(id);
  }

  async getArticlesByAuthor(authorId: string): Promise<IArticle[]> {
    return this.articleRepository.findByAuthor(authorId);
  }

  async getArticleById(id: string): Promise<IArticle | null> {
    return this.articleRepository.findById(id);
  }

  async getFeed(preferences: string[]): Promise<IArticle[]> {
    return this.articleRepository.findByPreferences(preferences);
  }

  async addReaction(articleId: string, userId: string, type: 'likes' | 'dislikes' | 'blocks'): Promise<IArticle | null> {
    return this.articleRepository.addReaction(articleId, userId, type);
  }

  async removeReaction(articleId: string, userId: string, type: 'likes' | 'dislikes' | 'blocks'): Promise<IArticle | null> {
    return this.articleRepository.removeReaction(articleId, userId, type);
  }
} 