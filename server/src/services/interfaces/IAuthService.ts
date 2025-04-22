import { IUser } from '../../models/user.model';

export interface IAuthService {
  register(userData: Partial<IUser>): Promise<IUser>;
  login(identifier: string, password: string): Promise<{ user: IUser; token: string }>;
}
