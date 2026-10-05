import express from "express"
import {
    getCart,
    addToCart,
    deleteCartItem,
    updateQuantity,
    moveToWishlist
  } from "../controllers/cartController.js";
  import { protect } from "../middleware/authController.js";
const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:id", protect, updateQuantity);
router.post(
  "/move-to-wishlist",
  protect,
  moveToWishlist
);
router.delete("/:id", protect, deleteCartItem);

export default router;