import express from 'express'
import { createOrder,getOrders ,getOrderById,getMyOrders} from '../controllers/ordercontroller.js'
import { protect } from "../middleware/authController.js";
const router = express.Router();

router.post("/", protect, createOrder);

router.get("/",  getOrders );
router.get("/my", protect, getMyOrders);
router.get("/:id",  getOrderById);

export default router;