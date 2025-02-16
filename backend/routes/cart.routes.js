import express from "express"
import { addToCart, removeAllFromCart, getCartProducts, updateQuantity, clearCart } from "../controllers/cart.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get('/', protectRoute, getCartProducts)
router.post('/', protectRoute, addToCart)
router.delete('/', protectRoute, removeAllFromCart)
router.put('/:id', protectRoute, updateQuantity)
router.post("/clear", protectRoute, clearCart);

export default router