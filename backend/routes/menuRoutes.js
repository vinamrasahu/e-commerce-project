import express from "express";
import { getMenuData } from "../controllers/menuController.js";

const router = express.Router();

router.get("/", getMenuData);

export default router;