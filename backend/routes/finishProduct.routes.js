import express from 'express'
const router = express.Router();
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { createFinishedProduct, getFinishedProductById, getFinishedProducts} from '../controllers/finishProduct.controller.js'

router.post("/",protectRoute,  createFinishedProduct); 
router.get("/", protectRoute,  getFinishedProducts); 
router.get("/:id", protectRoute,  getFinishedProductById); 

export default  router;
