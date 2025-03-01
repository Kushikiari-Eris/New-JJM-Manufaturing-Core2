import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { checkoutSuccess, stripeCheckoutSession, codCheckoutSession } from "../controllers/payment.controller.js"

const router = express.Router()

router.post('/stripe-checkout-session', protectRoute, stripeCheckoutSession)
router.post("/cod-checkout-session", protectRoute, codCheckoutSession);
router.post('/checkout-success', protectRoute, checkoutSuccess)

export default router