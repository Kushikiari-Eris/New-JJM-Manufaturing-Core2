import express from 'express';
import {
  addDataPoint,
  trainModel,
  predict,
  getModels,
  getDataPoints
} from '../controllers/predictive.controller.js';

const router = express.Router();

router.post('/data', addDataPoint);
router.post('/train', trainModel);
router.post('/predict', predict);
router.get('/models', getModels);
router.get('/data', getDataPoints);

export default router;
