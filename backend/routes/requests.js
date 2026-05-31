import express from 'express';
import {
  getRequests,
  createRequest,
  approveRequest,
  rejectRequest,
} from '../controllers/requestController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getRequests);
router.post('/', authenticate, createRequest);
router.post('/:id/approve', authenticate, authorize('admin', 'superadmin'), approveRequest);
router.post('/:id/reject', authenticate, authorize('admin', 'superadmin'), rejectRequest);

export default router;
