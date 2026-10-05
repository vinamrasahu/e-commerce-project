import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,

  getFeaturedProducts,
  getBestSellerProducts,
  getNewArrivalProducts,
  getTrendingProducts,
  getSpecialPriceProducts,
  getProductsByCategory,
  getProductsByCollection,
} from "../controllers/productController.js";

const router = express.Router();

/* ==========================
   Product Sections
========================== */

router.get("/featured", getFeaturedProducts);

router.get("/bestsellers", getBestSellerProducts);

router.get("/new-arrivals", getNewArrivalProducts);

router.get("/trending", getTrendingProducts);

router.get("/special-price", getSpecialPriceProducts);

router.get("/category/:categoryId", getProductsByCategory);

router.get("/collection/:collectionId", getProductsByCollection);

/* ==========================
   Product CRUD
========================== */

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", createProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;