import express from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} from '../controllers/eventController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateEvent } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticate, getEvents);
router.post('/', authenticate, validateEvent, createEvent);
router.put('/:id', authenticate, validateEvent, updateEvent);
router.delete('/:id', authenticate, deleteEvent);
router.post('/:id/join', authenticate, joinEvent);
router.post('/:id/leave', authenticate, leaveEvent);

export default router;
