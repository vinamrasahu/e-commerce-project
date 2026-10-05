import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    heroImage: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    content: [
      {
        text: String,
        type: {
          type: String,
          enum: ["body", "quote"],
          default: "body",
        },
      },
    ],

    tags: [
      {
        type: String,
      },
    ],

    author: {
      type: String,
      default: "Admin",
    },

    comments: [commentSchema],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Blog", blogSchema);