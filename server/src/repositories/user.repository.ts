import { User, IUser } from '../models/user.model';
import { BaseRepository } from './base.repository';
import { IUserRepository } from './interfaces/IUserRepository';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    return this.findOne({ phone });
  }

  async updatePreferences(userId: string, preferences: string[]): Promise<IUser | null> {
    console.log(preferences,userId,"pref")
    return this.update(userId, { preferences });
  }
} 