import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"

import { connectDb } from "./config/db.js"
import scheduleMaintenanceJob from "./config/cronJobs.js"

import http from "http";
import { Server } from "socket.io";

import { sendNotifications } from "./controllers/maintenance.controller.js";

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
import executionRoutes from './routes/productExecution.routes.js'
import auditLogistic1 from "./routes/auditRawMaterial.routes.js";
import maintenanceRouter from './routes/maintenance.routes.js'
import auditRequestAdmin from "./routes/auditRequestAdmin.routes.js"
import auditRequestCore1 from "./routes/auditRequestCore1.routes.js"
import auditRequestCore2 from "./routes/auditRequestCore2.routes.js"
import auditRequestFinance from "./routes/auditRequestFinance.routes.js"
import auditRequestHr1 from "./routes/auditRequestHr1.routes.js"
import auditRequestHr2 from "./routes/auditRequestHr2.routes.js"
import auditRequestHr3 from "./routes/auditRequestHr3.routes.js"
import auditRequestHr4 from "./routes/auditRequestHr4.routes.js"
import auditRequestLogistic1 from "./routes/auditRequestLogistic1.routes.js"
import auditRequestLogistic2 from "./routes/auditRequestLogistic2.routes.js"
import rawMaterial from './routes/rawMaterial.routes.js'
import testing from './routes/testing.routes.js'


dotenv.config()
connectDb()
scheduleMaintenanceJob();

const app = express({ limit:"10mb" })
const PORT = process.env.PORT || 7684

const allowedOrigins = [
  "https://core2.jjm-manufacturing.com",
  "http://localhost:5173", // Keep this for local development
];
// Create HTTP Server for WebSockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Socket.IO Connection Handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user role assignment
  socket.on("joinRole", (role) => {
    socket.leaveAll(); // Ensures users don’t stay in old rooms if roles change

    if (role === "audit") {
      socket.join("audit"); // Add audit users to "audit" room
      console.log(`User ${socket.id} joined audit room`);
    } else {
      socket.join("non-audit"); // Add non-audit users to "non-audit" room
      console.log(`User ${socket.id} joined non-audit room`);
    }
  });

  // Emit audit request notifications only to the "audit" room
  socket.on("auditRequest", (data) => {
    io.to("audit").emit("auditRequestNotification", data);
    console.log("Audit request notification sent:", data);
  });

  // Emit maintenance request notifications only to "non-audit" users
  socket.on("maintenanceRequest", (data) => {
    io.to("non-audit").emit("maintenanceNotification", data);
    console.log("Maintenance notification sent:", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});



// Run notification checks every minute
setInterval(() => {
  sendNotifications(io);
}, 5000);


const __dirname = path.resolve()

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE,PATCH",
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
app.use("/api/finishProduct", finishProductroutes)
app.use("/api/rawMaterialRequest", rewMaterialRequest)
app.use("/api/rawMaterial", rawMaterial);
app.use("/api/finished-product-transfer", finishedProductTransfer)
app.use("/api/invoiceRecords", invoiceRecords)
app.use("/api/execution", executionRoutes)
app.use("/api/auditLogistic1", auditLogistic1)
app.use("/api/maintenance", maintenanceRouter)
app.use("/api/auditRequestAdmin", auditRequestAdmin)
app.use("/api/auditRequestCore1", auditRequestCore1)
app.use("/api/auditRequestCore2", auditRequestCore2)
app.use("/api/auditRequestFinance", auditRequestFinance)
app.use("/api/auditRequestHr1", auditRequestHr1)
app.use("/api/auditRequestHr2", auditRequestHr2)
app.use("/api/auditRequestHr3", auditRequestHr3)
app.use("/api/auditRequestHr4", auditRequestHr4)
app.use("/api/auditRequestLogistic1", auditRequestLogistic1)
app.use("/api/auditRequestLogistic2", auditRequestLogistic2)

app.use("/api/testing", testing)

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("*", (req, res) =>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});



