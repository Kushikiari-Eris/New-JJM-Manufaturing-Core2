import express from "express"
import { 
    signup, 
    logout, 
    login, 
    refreshToken, 
    getProfile,
    setup2FA,
    verify2FA,
    disable2FA,
    verify2FALogin,
    updatePassword
} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// Auth routes
router.post('/signup', signup)
router.post('/login', login)
router.post('/verify-2fa-login', verify2FALogin)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.get('/profile', protectRoute, getProfile)
router.put("/update-password", protectRoute, updatePassword);

// 2FA routes
router.post('/setup-2fa', protectRoute, setup2FA)
router.post('/verify-2fa', protectRoute, verify2FA)
router.post('/disable-2fa', protectRoute, disable2FA)

export default router