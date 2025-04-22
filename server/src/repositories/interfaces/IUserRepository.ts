import { IUser } from '../../models/user.model';
import { IBaseRepository } from './IBaseRepository';

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByPhone(phone: string): Promise<IUser | null>;
  updatePreferences(userId: string, preferences: string[]): Promise<IUser | null>; 
}
