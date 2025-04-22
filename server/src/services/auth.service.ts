import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { AppError } from '../middleware/errorHandler';
import { IAuthService } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';

export class AuthService implements IAuthService{
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async register(userData: Partial<IUser>): Promise<IUser> {
    const { email, phone } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email!);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const existingPhone = await this.userRepository.findByPhone(phone!);
    if (existingPhone) {
      throw new AppError('Phone number already registered', 400);
    }

    return this.userRepository.create(userData);
  }

  async login(identifier: string, password: string): Promise<{ user: IUser; token: string }> {
    // Try to find user by email or phone
    const user = await this.userRepository.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    } as any);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }
} 