const mongoose = require("mongoose");

const province = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    sortId: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Province", province);
