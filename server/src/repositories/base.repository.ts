import { Model, Document, UpdateQuery } from 'mongoose';
import { IBaseRepository } from './interfaces/IBaseRepository';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(private model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(query: any): Promise<T | null> {
    return this.model.findOne(query);
  }

  async find(query: any = {}): Promise<T[]> {
    return this.model.find(query);
  }

  async update(id: string, data: Partial<T> | UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
} 