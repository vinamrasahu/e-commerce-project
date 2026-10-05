import Product from "../models/MyProductModel.js.js";
import Category from "../models/Category.js";
import Collection from "../models/Collection.js";

export const getHomeData = async (req, res) => {
  try {
    const [
      categories,
      collections,
      featuredProducts,
      bestSellers,
      newArrivals,
      trending,
      specialPrices,
    ] = await Promise.all([
      Category.find({ isActive: true }).sort({ sortOrder: 1 }),

      Collection.find({ isActive: true }).sort({ sortOrder: 1 }),

      Product.find({
        isFeatured: true,
        isActive: true,
      })
        .populate("category", "name slug")
        .populate("collection", "name slug")
        .limit(10),

      Product.find({
        isBestSeller: true,
        isActive: true,
      })
        .populate("category", "name slug")
        .populate("collection", "name slug")
        .limit(10),

      Product.find({
        isNewArrival: true,
        isActive: true,
      })
        .populate("category", "name slug")
        .populate("collection", "name slug")
        .limit(10),

      Product.find({
        isTrending: true,
        isActive: true,
      })
        .populate("category", "name slug")
        .populate("collection", "name slug")
        .limit(10),

      Product.find({
        isSpecialPrice: true,
        isActive: true,
      })
        .populate("category", "name slug")
        .populate("collection", "name slug")
        .limit(10),
    ]);

    res.status(200).json({
      success: true,

      data: {
        categories,
        collections,
        featuredProducts,
        bestSellers,
        newArrivals,
        trending,
        specialPrices,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};