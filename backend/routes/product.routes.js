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

router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/recommendations', getRecommendedProducts)
router.get('/category/:category', getProductsByCategory)
router.post('/', protectRoute, adminRoute, createProduct)
router.put("/updateStock", protectRoute, adminRoute, updateStatus);
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct)
router.delete('/:id', protectRoute, adminRoute, deleteProduct)

export default router