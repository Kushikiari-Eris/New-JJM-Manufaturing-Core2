import express from 'express';
import {
  getAudits,
  getAuditsByDepartment,
  getAudit,
  createAudit,
  updateAudit,
  deleteAudit,
} from '../controllers/audit.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getAudits);
router.get('/department/:departmentId', protectRoute, getAuditsByDepartment);
router.get('/:id', protectRoute, getAudit);
router.post('/', protectRoute,  createAudit);
router.put('/:id', protectRoute,  updateAudit);
router.delete('/:id', protectRoute,  deleteAudit);

export default router;
