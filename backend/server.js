import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import { connectDb } from "./config/db.js"

import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import couponRoutes from './routes/coupon.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import orderRoutes from './routes/order.routes.js'
import orderTrackerRoutes from './routes/orderTracker.routes.js'


dotenv.config()
connectDb()

const app = express({ limit:"10mb" })
const PORT = process.env.PORT || 7684

app.use(express.json({limit: "10mb"}))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/orderTracker', orderTrackerRoutes)

app.listen(PORT, () =>{
    console.log("Server Starting on " + PORT)
})



