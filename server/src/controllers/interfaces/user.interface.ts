import { Request, Response } from "express";

export default interface IUserController {
  getCurrentUser(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
  updatePassword(req: Request, res: Response): Promise<void>;
  updatePreferences(req: Request, res: Response): Promise<void>;
}
