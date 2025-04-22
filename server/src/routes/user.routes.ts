import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateRequest } from '../middleware/validateRequest';
import { } from "../models/user.model"
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/multer';
import { userController } from '../config/dependencyInjection';

const router = Router();

router.get('/me', authenticate, userController.getCurrentUser.bind(userController));
router.patch('/profile', authenticate, upload.single('profileImage'), userController.updateProfile.bind(userController));
router.patch('/password', authenticate, userController.updatePassword.bind(userController));
router.post('/preferences',authenticate, userController.updatePreferences.bind(userController));

export default router; 