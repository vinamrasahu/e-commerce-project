import UserSession from "../models/UserSession.js";

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await UserSession.aggregate([
      // Latest login first
      {
        $sort: {
          loginTime: -1,
        },
      },

      // Keep only the latest session for each user
      {
        $group: {
          _id: "$userId",

          loginTime: { $first: "$loginTime" },
          status: { $first: "$status" },
          device: { $first: "$device" },
          browser: { $first: "$browser" },
          os: { $first: "$os" },
        },
      },

      // Join with User collection
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      // Select only required fields
      {
        $project: {
          _id: 1,
          loginTime: 1,
          status: 1,
          device: 1,
          browser: 1,
          os: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]);

    res.json({
      success: true,
      sessions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};