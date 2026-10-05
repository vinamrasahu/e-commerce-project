import mongoose from "mongoose";

const userSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    refreshToken: {
        type: String,
        default: null,
    },

    loginTime: {
      type: Date,
      default: Date.now,
    },

    logoutTime: {
      type: Date,
      default: null,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    device: {
      type: String,
      default: "Unknown",
    },

    browser: {
      type: String,
      default: "Unknown",
    },

    os: {
      type: String,
      default: "Unknown",
    },

    ip: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "LoggedOut", "Expired"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const UserSession = mongoose.model("UserSession", userSessionSchema);

export default UserSession;