import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { authController } from '../config/dependencyInjection';

const router = Router();

router.post('/register' , authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

export default router; 