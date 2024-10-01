const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Message = new mongoose.Schema(
  {
    from: {
      type: ObjectId,
      required: [true, "from is required"],
    },
    to: {
      type: ObjectId,
      required: [true, "to is required"],
    },
    msg: {
      type: String,
      required: [true, "msg is required"],
    },
    status: {
      type: String,
      default: "new",
    },
    react: {
      type: String,
      default: "",
    },
    messageKey: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", Message);
