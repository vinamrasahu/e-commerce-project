import express from "express";

import {
  getSliders,
  getSlider,
  createSlider,
  updateSlider,
  deleteSlider,
} from "../controllers/sliderController.js";

const router = express.Router();

router.get("/", getSliders);

router.get("/:id", getSlider);

router.post("/", createSlider);

router.put("/:id", updateSlider);

router.delete("/:id", deleteSlider);

export default router;