import Cart from "../models/Cart.js";
import Like from "../models/Like.js";
// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

    const userId = req.user.id; // Comes from your auth middleware

    // Check if the same product with the same size already exists
    const existingItem = await Cart.findOne({
      userId,
      productId,
      size,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();

      return res.status(200).json(existingItem);
    }

    const cartItem = new Cart({
      userId,
      productId,
      quantity,
      size,
    });

    await cartItem.save();

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getCart = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const cart = await Cart.find({ userId }).populate("productId");
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  export const deleteCartItem = async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  export const updateQuantity = async (req, res) => {
    try {
      const { quantity } = req.body;
  
      const item = await Cart.findByIdAndUpdate(
        req.params.id,
        { quantity },
        { new: true }
      );
  
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



export const moveToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId } = req.body;

    // Find cart item
    const cartItem = await Cart.findById(cartId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Find or create wishlist
    let wishlist = await Like.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Like.create({
        user: userId,
        products: [],
      });
    }

    // Add product only if it doesn't already exist
    const exists = wishlist.products.some(
      (id) => id.toString() === cartItem.productId.toString()
    );

    if (!exists) {
      wishlist.products.push(cartItem.productId);
      await wishlist.save();
    }

    // Remove from cart
    await Cart.findByIdAndDelete(cartId);

    res.status(200).json({
      success: true,
      message: "Product moved to wishlist",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};