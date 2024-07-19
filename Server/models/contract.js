const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const contract = new mongoose.Schema(
  {
    aSide: {
      type: ObjectId,
      trim: true,
    },
    bSide: {
      type: ObjectId,
      trim: true,
    },
    houseId: {
      type: ObjectId,
      require: true,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contract", contract);
