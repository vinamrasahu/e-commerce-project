import express from "express";

import {
  addLike,
  getLikes,
  removeLike,
  checkLike,
} from "../controllers/likeController.js";

import { protect } from "../middleware/authController.js";

const router = express.Router();

router.use(protect);

router.post("/", addLike);

router.get("/", getLikes);

router.delete("/:productId", removeLike);

router.get("/check/:productId", checkLike);

export default router;