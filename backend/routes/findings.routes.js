import express from 'express';
import {
  getFindings,
  getFindingsByAudit,
  getFinding,
  createFinding,
  updateFinding,
  deleteFinding,
} from '../controllers/findings.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getFindings);
router.get('/audit/:auditId', protectRoute, getFindingsByAudit);
router.get('/:id', protectRoute, getFinding);
router.post('/', protectRoute,  createFinding);
router.put('/:id', protectRoute,  updateFinding);
router.delete('/:id', protectRoute, deleteFinding);

export default router;
