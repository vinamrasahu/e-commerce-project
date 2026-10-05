import Category from "../models/Category.js";
import Collection from "../models/Collection.js";

export const getMenuData = async (req, res) => {
  try {
    const [categories, collections] = await Promise.all([
      Category.find({ isActive: true })
        .select("name slug image")
        .sort({ sortOrder: 1 }),

      Collection.find({ isActive: true })
        .select("name slug image")
        .sort({ sortOrder: 1 }),
    ]);

    const featured = [
      {
        title: "New Arrivals",
        slug: "new-arrivals",
      },
      {
        title: "Best Sellers",
        slug: "bestsellers",
      },
      {
        title: "Trending",
        slug: "trending",
      },
      {
        title: "Special Price",
        slug: "special-price",
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        featured,
        categories,
        collections,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};