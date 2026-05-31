import express from 'express';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js';
import { authenticate } from '../middleware/auth.js';
import { validateResource } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticate, getResources);
router.post('/', authenticate, validateResource, createResource);
router.put('/:id', authenticate, validateResource, updateResource);
router.delete('/:id', authenticate, deleteResource);

export default router;
