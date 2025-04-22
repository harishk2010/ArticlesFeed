import { Request, Response, NextFunction } from "express";

export default interface IAuthController {
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
}
