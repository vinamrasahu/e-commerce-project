import Like from "../models/Like.js";

// =========================
// Add Product to Wishlist
// =========================
export const addLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let wishlist = await Like.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Like.create({
        user: userId,
        products: [productId],
      });
    } else {
      wishlist = await Like.findOneAndUpdate(
        { user: userId },
        {
          $addToSet: {
            products: productId,
          },
        },
        {
          returnDocument: "after",
        }
      );
    }

    const updatedWishlist = await Like.findOne({
      user: userId,
    }).populate("products");

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: updatedWishlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Wishlist
// =========================
export const getLikes = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Like.findOne({
      user: userId,
    }).populate("products");

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Remove Product
// =========================
export const removeLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await Like.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          products: productId,
        },
      }
    );

    const updatedWishlist = await Like.findOne({
      user: userId,
    }).populate("products");

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: updatedWishlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Check Product Liked
// =========================
export const checkLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Like.findOne({
      user: userId,
    });

    const liked =
      wishlist?.products.some(
        (id) => id.toString() === productId
      ) || false;

    res.status(200).json({
      success: true,
      liked,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};