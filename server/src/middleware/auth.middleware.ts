import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized to access this route', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}; 