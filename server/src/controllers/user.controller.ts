import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { z } from 'zod';
import IUserController from './interfaces/user.interface';
import { IUserService } from '../services/interfaces/IUserService';


// Validation schemas
const profileSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  bio: z.string().max(500).optional()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6)
});

const preferencesSchema = z.object({
  categories: z.array(z.string())
});

export class UserController implements IUserController{
  private userService:IUserService
    constructor(userService:IUserService){
      this.userService=userService
    }
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
         res.status(401).json({ message: 'Unauthorized' });
        return
      }
      const user = await this.userService.getCurrentUser(req.user._id);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body,req.file)
      if (!req.user) {
         res.status(401).json({ message: 'Unauthorized' });
         return
        
      }
      const user = await this.userService.updateProfile(req.user.id, req.body, req.file);
      res.json(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
         res.status(400).json({ message: 'Validation error', errors: error.errors });
        return
      }
      res.status(500).json({ message: error.message });
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
         res.status(401).json({ message: 'Unauthorized' });
        return
      }
      const { currentPassword, newPassword } = passwordSchema.parse(req.body);
      await this.userService.updatePassword(req.user.id, currentPassword, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
         res.status(400).json({ message: 'Validation error', errors: error.errors });
         return
        
      }
      res.status(500).json({ message: error.message });
    }
  }

  async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body,"preferences",req.user)
      if (!req.user) {
         res.status(401).json({ message: 'Unauthorized' });
        return
      }

      const user = await this.userService.updatePreferences(req.user.id, req.body);
      res.json(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
         res.status(400).json({ message: 'Validation error', errors: error.errors });
        return
      }
      res.status(500).json({ message: error.message });
    }
  }
} 