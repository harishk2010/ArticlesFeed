import { ArticleController } from "../controllers/article.controller";
import { AuthController } from "../controllers/auth.controller";
import IArticleController from "../controllers/interfaces/article.interface";
import IAuthController from "../controllers/interfaces/auth.interface";
import IUserController from "../controllers/interfaces/user.interface";
import { UserController } from "../controllers/user.controller";
import { ArticleRepository } from "../repositories/article.repository";
import { IArticleRepository } from "../repositories/interfaces/IArticleRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserRepository } from "../repositories/user.repository";
import { ArticleService } from "../services/article.service";
import { IArticleService } from "../services/interfaces/IArticleService";
import { IUserService } from "../services/interfaces/IUserService";
import { UserService } from "../services/user.service";


const articleRepository:IArticleRepository=new ArticleRepository()
const articleService:IArticleService=new ArticleService(articleRepository)
const articleController:IArticleController=new ArticleController(articleService)

const userRepository:IUserRepository=new UserRepository()
const userService:IUserService=new UserService(userRepository)
const userController:IUserController=new UserController(userService)

const authController:IAuthController=new AuthController(userService)

export {authController,userController,articleController}