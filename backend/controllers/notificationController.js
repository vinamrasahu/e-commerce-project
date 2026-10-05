import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
  try {
    const { productId } = req.body;

    const userId = req.user.id; // or req.user._id (depends on your auth middleware)

    // Check if user has already subscribed
    const alreadyExists = await Notification.findOne({
      userId,
      productId,
    });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "You have already subscribed for this product.",
      });
    }

    // Save notification
    const notification = await Notification.create({
      userId,
      productId,
    });

    return res.status(201).json({
      success: true,
      message: "We'll notify you when this product is back in stock.",
      notification,
    });

  } catch (error) {
    console.error("Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};