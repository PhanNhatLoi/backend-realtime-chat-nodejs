const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const house = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    owner: {
      type: ObjectId,
      require: true,
    },
    address: {
      location: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
      province: {
        sortId: {
          type: Number,
        },
        name: {
          type: String,
        },
      },
      district: {
        sortId: {
          type: Number,
        },
        name: {
          type: String,
        },
      },
      ward: {
        sortId: {
          type: Number,
        },
        name: {
          type: String,
        },
      },
      sortAddress: {
        type: String,
      },
    },
    information: {
      prince: {
        value: {
          type: Number,
        },
        unit: {
          type: String,
        },
        deposit: {
          type: String,
        },
      },
      state: {
        type: String,
        enum: ["deposit", "hired", "ready", "deleted"],
      },
      intro: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);
house.index({ "address.location": "2dsphere" });

module.exports = mongoose.model("House", house);
