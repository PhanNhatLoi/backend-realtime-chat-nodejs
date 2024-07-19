const mongoose = require("mongoose");

const ward = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    districtId: {
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

module.exports = mongoose.model("Ward", ward);
