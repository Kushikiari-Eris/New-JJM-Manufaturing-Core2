import express from 'express';
import {
  getTasks,
  getTasksByUser,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getTasks);
router.get('/user/:userId', protectRoute, getTasksByUser);
router.get('/:id', protectRoute, getTask);
router.post('/', protectRoute, createTask);
router.put('/:id', protectRoute, updateTask);
router.delete('/:id', protectRoute, deleteTask);

export default router;
