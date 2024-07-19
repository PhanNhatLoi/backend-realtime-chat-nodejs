const mongoose = require("mongoose");

const district = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    provinceId: {
      type: Number,
      require: true,
    },
    sortId: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("District", district);
