import { Request, Response } from 'express';

export default interface IArticleController{
     getFeed(req: Request, res: Response):Promise<void>
     createArticle(req: Request, res: Response):Promise<void>
     getArticle(req: Request, res: Response):Promise<void>
     updateArticle(req: Request, res: Response):Promise<void>
     deleteArticle(req: Request, res: Response):Promise<void>
     addReaction(req: Request, res: Response):Promise<void>
     removeReaction(req: Request, res: Response):Promise<void>
     getArticlesByAuthor(req: Request, res: Response):Promise<void>
}