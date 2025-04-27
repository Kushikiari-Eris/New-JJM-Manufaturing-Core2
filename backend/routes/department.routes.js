import express from 'express';
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/department.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/', protectRoute,  getDepartments);
router.get('/:id', protectRoute,  getDepartment);
router.post('/',  protectRoute, createDepartment);
router.put('/:id', protectRoute,  updateDepartment);
router.delete('/:id', protectRoute,  deleteDepartment);

export default router;
