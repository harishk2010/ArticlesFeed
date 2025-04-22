import { Router } from 'express';
import { ArticleController } from '../controllers/article.controller';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/multer';
import { protect } from '../middleware/auth.middleware';
import { articleController } from '../config/dependencyInjection';

const router = Router();


router.get('/feed', authenticate, protect, articleController.getFeed.bind(articleController));
router.get('/author/:authorId', authenticate, protect, articleController.getArticlesByAuthor.bind(articleController));
router.post('/', authenticate, upload.single('image'), articleController.createArticle.bind(articleController));
router.get('/:id', authenticate, articleController.getArticle.bind(articleController));
router.patch('/:id', authenticate, upload.single('image'), articleController.updateArticle.bind(articleController));
router.delete('/:id', authenticate, articleController.deleteArticle.bind(articleController));
router.post('/:id/reactions', authenticate, articleController.addReaction.bind(articleController));
router.delete('/:id/reactions', authenticate, articleController.removeReaction.bind(articleController));

export default router; 