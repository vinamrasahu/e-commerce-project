import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    material: {
      type: String,
      default: "",
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      default: null,
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    // Images
    image: {
      type: String,
      required: true,
    },

    hoverImage: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],

    videos: [
      {
        type: String,
      },
    ],

    // Category & Collection
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
    },

    // Product Variants
    color: {
      type: String,
    },

    colors: [
      {
        value: String,
        label: String,
        hex: String,
      },
    ],

    size: {
      type: String,
    },

    sizes: [
      {
        type: String,
      },
    ],

    // Rating & Reviews
    rating: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    // Labels
    badges: [
      {
        label: String,
        type: String,
      },
    ],

    tags: [
      {
        type: String,
      },
    ],

    // Inventory
    stock: {
      type: Number,
      default: 0,
    },

    // Extra Information
    additionalInfo: [
      {
        label: String,
        value: String,
      },
    ],

    // Homepage Sections
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isSpecialPrice: {
      type: Boolean,
      default: false,
    },

    isBackInStock: {
      type: Boolean,
      default: false,
    },

    // Product Status
    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product; 