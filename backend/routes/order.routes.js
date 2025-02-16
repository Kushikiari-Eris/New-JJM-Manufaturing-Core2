import express from "express"
import { fetchAllOrder, fetchOrderById, updateOrderStatus } from "../controllers/order.controller.js"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get('/', protectRoute,  fetchAllOrder)
router.get('/:id', protectRoute, adminRoute, fetchOrderById)
router.put("/:orderId/status", protectRoute, adminRoute, updateOrderStatus);

export default router