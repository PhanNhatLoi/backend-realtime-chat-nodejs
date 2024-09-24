const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Group = new mongoose.Schema(
  {
    manager:{
        type: ObjectId,
    },
    name:{
        type:String,
        required: [true, "name is required"],
    },
    deleted:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Groups", Group);
