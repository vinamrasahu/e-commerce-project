import express from "express";

import {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";

const router = express.Router();

router.post("/", createCollection);

router.get("/", getCollections);

router.get("/:id", getCollection);

router.put("/:id", updateCollection);

router.delete("/:id", deleteCollection);

export default router;