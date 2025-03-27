import express from "express"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"
import { 
    getAllProducts, 
    getFeaturedProducts, 
    createProduct, 
    deleteProduct, 
    getRecommendedProducts, 
    getProductsByCategory,
    updateStatus,
    toggleFeaturedProduct } from "../controllers/product.controller.js"

const router = express.Router()

router.get('/', protectRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/recommendations', getRecommendedProducts)
router.get('/category/:category', getProductsByCategory)
router.post('/', protectRoute, createProduct)
router.put("/updateStock", protectRoute, updateStatus);
router.patch('/:id', protectRoute, toggleFeaturedProduct)
router.delete('/:id', protectRoute, deleteProduct)

export default router