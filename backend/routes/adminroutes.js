import express from "express";
import { getAllSessions } from "../controllers/authController.js";
const router = express.Router();

router.get("/sessions", getAllSessions);

export default router;