import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { z } from 'zod';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';
import IAuthController from './interfaces/auth.interface';
import { IUserService } from '../services/interfaces/IUserService';


const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  dateOfBirth: z.string().transform(str => new Date(str)),
  preferences: z.array(z.string())
});

const loginSchema = z.object({
  identifier: z.string(),
  password: z.string()
});

export class AuthController implements IAuthController {

  private userService:IUserService
  constructor(userService:IUserService){
    this.userService=userService
  }
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body)
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await this.userService.findByEmail(validatedData.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const user = await this.userService.createUser(validatedData);
      const token = generateToken(user._id);

      res.status(201).json({
        status: 'success',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("first",req.body)
      const { identifier, password } = loginSchema.parse(req.body);
      
      // Find user by email or phone
      const user = await this.userService.findByEmail(identifier) 
      console.log(user)
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password,user.password);
      console.log("first",password,user.password,isPasswordValid)
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user._id);

      res.status(200).json({
        status: 'success',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }
} 