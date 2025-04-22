import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { uploadToS3Bucket } from '../utils/s3';
import bcrypt from 'bcryptjs';
import { IMulterFile } from '../types/types';
import { IUserService } from './interfaces/IUserService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';


export class UserService implements IUserService {
  private userRepository:IUserRepository
  constructor(userRepository:IUserRepository){
    this.userRepository=userRepository
  }

  async getCurrentUser(userId: string): Promise<IUser | null> {
    return this.userRepository.findById(userId);
  }

  async updateProfile(userId: string, data: Partial<IUser>, file?: IMulterFile | null): Promise<IUser | null> {
    const updateData: Partial<IUser> = { ...data };
    
    if (file) {
      const imageUrl = await uploadToS3Bucket(file, 'profile-images');
      updateData.profileImage = imageUrl;
    }
    
    return this.userRepository.update(userId, updateData);
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();
    return true;
  }

  async updatePreferences(userId: string, preferences: string[]): Promise<IUser | null> {
    return this.userRepository.updatePreferences(userId, preferences);
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    if(!userData.password){

      throw new Error("need all details")
    }
    const user = await this.userRepository.create(
      userData
      );

    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    return this.userRepository.findByPhone(phone);
  }

  async findById(id: string): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return this.userRepository.update(id, userData);
  }

  async verifyPassword(user: IUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
} 