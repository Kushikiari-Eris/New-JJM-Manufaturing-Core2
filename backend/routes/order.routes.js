import express from "express"
import { fetchAllOrder, fetchOrderById, updateOrderStatus } from "../controllers/order.controller.js"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get('/', protectRoute,  fetchAllOrder)
router.get('/:id', protectRoute,  fetchOrderById)
router.put("/:orderId/status", protectRoute, updateOrderStatus);

export default router