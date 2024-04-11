const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
    },
    role: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
    },
    socketId: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/nhatloi/image/upload/v1608601448/avatar/78-785904_block-chamber-of-commerce-avatar-white-avatar-icon_b9lssx.jpg",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", user);
