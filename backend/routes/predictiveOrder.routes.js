import express from 'express';
import {
  trainOrderModel,
  predictForOrder,
  predictForOrderData,
  getOrderModels,
  deleteOrderModel
} from '../controllers/PredictiveOrder.controller.js';

const router = express.Router();

// Protected routes - require authentication
router.post('/train',  trainOrderModel);
router.post('/predict/order', predictForOrder);
router.post('/predict/data', predictForOrderData);
router.get('/models', getOrderModels);
router.delete('/models/:modelName',  deleteOrderModel);

export default router;