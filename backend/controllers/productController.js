import Product from "../models/MyProductModel.js.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";
// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    .populate("category", "name slug image")
    .populate("collection", "name slug image");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    .populate("category", "name slug image")
    .populate("collection", "name slug image");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    console.log("Incoming Data:");
    console.log(req.body);

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    // Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    // Get current product before update
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const oldStock = existingProduct.stock;

    // Update product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

   
    // Stock changed from 0 -> greater than 0
    if (oldStock === 0 && product.stock > 0) {

   
      const notifications = await Notification.find({
        productId: product._id,
        notified: false,
      });

      console.log(
        `Found ${notifications.length} users waiting for ${product.name}`
      );

      console.log("Notifications:", notifications);

      for (const notification of notifications) {

        console.log("Current Notification:", notification);

        const user = await User.findById(notification.userId);

        console.log("User:", user);

        if (!user) {
          console.log("❌ User not found");
          continue;
        }

        try {

          

          await sendEmail({
            to: user.email,
            subject: "🎉 Product Back In Stock",
            html: `
              <h2>Good News!</h2>

              <p>Hello <strong>${user.name}</strong>,</p>

              <p><strong>${product.name}</strong> is back in stock.</p>

              <p>Visit our website and order it before it sells out again.</p>

              <br>

              <p>Thank you.</p>
            `,
          });

       

          notification.notified = true;
          await notification.save();

  

        } catch (emailError) {

          console.error("❌ Email Error:", emailError);

        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {

    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .populate("category", "name")
      .populate("collection", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBestSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isBestSeller: true,
      isActive: true,
    })
      .populate("category", "name")
      .populate("collection", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewArrivalProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isNewArrival: true,
      isActive: true,
    })
      .populate("category", "name")
      .populate("collection", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isTrending: true,
      isActive: true,
    })
      .populate("category", "name")
      .populate("collection", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpecialPriceProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isSpecialPrice: true,
      isActive: true,
    })
      .populate("category", "name")
      .populate("collection", "name");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
      isActive: true,
    }).populate("category collection");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductsByCollection = async (req, res) => {
  try {
    const products = await Product.find({
      collection: req.params.collectionId,
      isActive: true,
    }).populate("category collection");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};