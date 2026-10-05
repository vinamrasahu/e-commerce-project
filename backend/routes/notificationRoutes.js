import express from "express";
import { createNotification } from "../controllers/notificationController.js";
import { protect } from "../middleware/authController.js";
const router = express.Router();

router.post("/", protect, createNotification);

export default router;