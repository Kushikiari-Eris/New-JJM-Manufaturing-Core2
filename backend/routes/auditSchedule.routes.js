import express from 'express';
import { getAudits, getAudit, createAudit, updateAudit, deleteAudit } from '../controllers/auditSchedule.controller.js';

const router = express.Router();

router.get('/', getAudits);

router.get('/:id', getAudit);

router.post('/', createAudit);

router.put('/:id', updateAudit);

router.delete('/:id', deleteAudit);

export default router;
