import express from 'express'
const router = express.Router();
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { createFinishedProduct, getFinishedProductById, getFinishedProducts} from '../controllers/finishProduct.controller.js'

router.post("/",protectRoute, adminRoute, createFinishedProduct); 
router.get("/", protectRoute, adminRoute, getFinishedProducts); 
router.get("/:id", protectRoute, adminRoute, getFinishedProductById); 

export default  router;
