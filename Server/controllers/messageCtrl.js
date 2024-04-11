const { ObjectId } = require("mongodb");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");
const messageCtrl = {
  sendMsg: async (req, res) => {
    try {
      const { from, to, msg } = req.body;

      const newMsg = new Message({
        from,
        to,
        msg,
      });

      await newMsg.save();

      res.json({ msg: "send message success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllMsg: async (req, res) => {
    try {
      const token = req.header("Authorization");
      const { id } = jwt.decode(token);
      const messages = await Message.aggregate([
        {
          $match: {
            $or: [{ from: new ObjectId(id) }, { to: new ObjectId(id) }],
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$from", new ObjectId(id)] },
                then: "$to",
                else: "$from",
              },
            },
            messages: { $push: "$$ROOT" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$user", 0] },
          },
        },
        {
          $project: {
            "user.password": 0,
          },
        },
      ]);
      res.json(messages);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getMsg: async (req, res) => {
    try {
      const userId = req.header("userId");
      if (!userId) return res.json({ msg: "not found" });
      const token = req.header("Authorization");
      const { id } = jwt.decode(token);
      const messages = await Message.aggregate([
        {
          $match: {
            $or: [{ from: new ObjectId(userId) }, { to: new ObjectId(userId) }],
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$from", new ObjectId(id)] },
                then: "$to",
                else: "$from",
              },
            },
            messages: { $push: "$$ROOT" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$user", 0] },
          },
        },
        {
          $project: {
            "user.password": 0,
          },
        },
      ]);

      return res.json(...messages);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = messageCtrl;
