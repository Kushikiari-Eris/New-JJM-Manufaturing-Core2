import express from 'express'
import { createOrderTracker, updateOrderStatus, getOrderStatus} from '../controllers/orderTracker.controller.js'

const router = express.Router()

router.post("/create", createOrderTracker);
router.put("/update", updateOrderStatus);
router.get("/:orderId", getOrderStatus);

export default router