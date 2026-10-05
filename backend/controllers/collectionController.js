import Collection from "../models/Collection.js";
import slugify from "slugify";

// Create Collection
export const createCollection = async (req, res) => {
  try {
    const {
      name,
      image,
      bannerImage,
      description,
      isFeatured,
      sortOrder,
    } = req.body;

    const exists = await Collection.findOne({ name });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Collection already exists",
      });
    }

    const collection = await Collection.create({
      name,
      slug: slugify(name, { lower: true }),
      image,
      bannerImage,
      description,
      isFeatured,
      sortOrder,
    });

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Collections
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Collection
export const getCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Collection
export const updateCollection = async (req, res) => {
  try {
    const { name } = req.body;

    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        slug: slugify(name, { lower: true }),
      },
      {
        new: true,
      }
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Collection
export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};