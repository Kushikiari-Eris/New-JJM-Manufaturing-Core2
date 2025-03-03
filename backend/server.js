import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"

import { connectDb } from "./config/db.js"

import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import couponRoutes from './routes/coupon.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import orderRoutes from './routes/order.routes.js'
import orderTrackerRoutes from './routes/orderTracker.routes.js'
import finishProductroutes from './routes/finishProduct.routes.js'
import rewMaterialRequest from './routes/rawMaterialRequest.routes.js'
import finishedProductTransfer from "./routes/finishedProductTransfer.routes.js"
import invoiceRecords from './routes/invoiceRecords.routes.js'


dotenv.config()
connectDb()

const app = express({ limit:"10mb" })
const PORT = process.env.PORT || 7684

const allowedOrigins = [
  "https://core2.jjm-manufacturing.com",
  "http://localhost:5173", // Keep this for local development
];

const __dirname = path.resolve()

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

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
app.use("/api/finishProduct", finishProductroutes);
app.use("/api/rawMaterialRequest", rewMaterialRequest);
app.use("/api/finished-product-transfer", finishedProductTransfer);
app.use("/api/invoiceRecords", invoiceRecords);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("*", (req, res) =>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () =>{
    console.log("Server Starting on " + PORT)
})



