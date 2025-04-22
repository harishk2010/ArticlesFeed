import { IUser } from '../../models/user.model';
import { IMulterFile } from '../../types/types';

export interface IUserService {
  getCurrentUser(userId: string): Promise<IUser | null>;
  updateProfile(userId: string, data: Partial<IUser>, file?: IMulterFile | null): Promise<IUser | null>;
  updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
  updatePreferences(userId: string, preferences: string[]): Promise<IUser | null>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findByPhone(phone: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  verifyPassword(user: IUser, password: string): Promise<boolean>;
}
