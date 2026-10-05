import express from "express";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Single image
router.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    res.json({
      success: true,
      path: `/uploads/${req.file.filename}`,
    });
  }
);

// Multiple images
router.post(
  "/upload-multiple",
  upload.array("images", 10),
  (req, res) => {
    const paths = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    res.json({
      success: true,
      paths,
    });
  }
);
// Multiple videos
router.post(
  "/upload-videos",
  upload.array("videos", 5),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No videos uploaded",
      });
    }

    const paths = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    res.json({
      success: true,
      paths,
    });
  }
);
export default router;