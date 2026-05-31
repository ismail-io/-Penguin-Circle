import express from 'express';
import {
  getUsers,
  getUserProfile,
  updateProfile,
  getAllUsers,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getUsers);
router.get('/all', authenticate, authorize('superadmin'), getAllUsers);
router.get('/:id', authenticate, getUserProfile);
router.put('/profile/update', authenticate, updateProfile);

export default router;
