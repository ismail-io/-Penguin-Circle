import express from 'express';
import { register, login, googleAuth, googleComplete } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/google', googleAuth);
router.post('/google/complete', googleComplete);

export default router;
