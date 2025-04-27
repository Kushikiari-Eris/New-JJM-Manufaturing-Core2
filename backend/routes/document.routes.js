import express from 'express';
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../controllers/document.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getDocuments);
router.get('/:id', protectRoute, getDocument);
router.post('/', protectRoute, createDocument);
router.put('/:id', protectRoute, updateDocument);
router.delete('/:id', protectRoute, deleteDocument);

export default router;
