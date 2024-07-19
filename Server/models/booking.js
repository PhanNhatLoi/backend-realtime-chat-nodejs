const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const booking = new mongoose.Schema(
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
    note: {
      type: String,
    },
    time: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", booking);
