import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { IUser } from '../models/user.model';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = decoded as IUser;
    console.log(decoded,req.user,"authenticate")
    next();
  } catch (error: any) {
    res.status(401).json({ message: 'Authentication failed' });
  }
}; 