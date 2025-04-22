import { Request, Response } from "express";
import { ArticleService } from "../services/article.service";
import { z } from "zod";
import { getFileFromRequest } from "../middleware/multer";
import IArticleController from "./interfaces/article.interface";
import { IArticleService } from "../services/interfaces/IArticleService";



const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  tags: z
    .string()
    .transform((val) => val.split(",").map((tag) => tag.trim()))
    .optional(),
});

const updateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  tags: z
    .string()
    .transform((val) => val.split(",").map((tag) => tag.trim()))
    .optional(),
});

const reactionSchema = z.enum(["likes", "dislikes", "blocks"]);

export class ArticleController implements IArticleController {
  private articleService:IArticleService
  constructor(articleService:IArticleService){
    this.articleService= articleService
  }
  async getFeed(req: Request, res: Response): Promise<void> {
    try {
      // console.log(req.user)
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      console.log(req.user.preferences);
      const articles = await this.articleService.getFeed(req.user.preferences);
      console.log(articles, "ac");
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      throw error;
    }
  }

  async createArticle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
     
      console.log(req.body)
      // const validatedData = createArticleSchema.parse(req.body);
      const file = getFileFromRequest(req);
      const article = await this.articleService.createArticle(
        req.body,
        req.user.id,
        file
      );
      res.status(201).json(article);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  }
  async getArticle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const success = await this.articleService.getArticleById(req.params.id);
      if (!success) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      res.json(success);

      
    } catch (error:any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
        return;
      }
      res.status(500).json({ message: error.message });
    }
    
  }

  async updateArticle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const validatedData = updateArticleSchema.parse(req.body);
      const file = getFileFromRequest(req);
      const article = await this.articleService.updateArticle(
        req.params.id,
        validatedData,
        file
      );
      if (!article) {
        res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  }

  async deleteArticle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const success = await this.articleService.deleteArticle(req.params.id);
      if (!success) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      res.json({ message: "Article deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async addReaction(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      console.log(req.user.id);
      const type = reactionSchema.parse(req.body.type);
      const article = await this.articleService.addReaction(
        req.params.id,
        req.user.id,
        type
      );
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      res.json(article);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  }

  async removeReaction(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const type = reactionSchema.parse(req.body.type);
      const article = await this.articleService.removeReaction(
        req.params.id,
        req.user.id,
        type
      );
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      res.json(article);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  }

  async getArticlesByAuthor(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      console.log("first", req.params);
      const articles = await this.articleService.getArticlesByAuthor(
        req.params.authorId
      );
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
