const { ObjectId } = require("mongodb");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");
const Pusher = require("pusher");
const Users = require("../models/user");

const pusher = new Pusher({
  appId: process.env.pusher_appId,
  key: process.env.pusher_key,
  secret: process.env.pusher_secret,
  cluster: process.env.pusher_cluster,
});
const messageCtrl = {
  sendMsg: async (req, res) => {
    try {
      const token = getTokenBearer(req);
      const { id } = jwt.decode(token);
      const { to, msg } = req.body;

      const newMsg = new Message({
        from: id,
        to,
        msg,
        status: "sent",
      });

      const message = await newMsg.save();
      const fromUser = await Users.findById(id);
      pusher.trigger(to, "receive-msg", { msg: message, user: fromUser });
      pusher.trigger(id, "sent-msg", { msg: message });
      res.json({ msg: "send message success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllMsg: async (req, res) => {
    try {
      const token = getTokenBearer(req);
      const { id } = jwt.decode(token);
      const messages = await Message.aggregate([
        {
          $match: {
            $or: [{ from: new ObjectId(id) }, { to: new ObjectId(id) }],
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
      res.json(messages);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getMsg: async (req, res) => {
    try {
      const userId = req.header("userId");
      if (!userId) return res.json({ msg: "not found" });
      const token = getTokenBearer(req);
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

  readMsg: async (req, res) => {
    try {
      const userId = req.header("userId");
      if (!userId) return res.json({ msg: "not found" });
      const userIdObject = new ObjectId(userId);
      await Message.updateMany(
        { from: userIdObject, status: "sent" },
        { $set: { status: "seen" } }
      );
      return res.json({ msg: "success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  removeMsg: async (req, res) => {
    try {
      const msg = await Message.findOne({
        _id: new ObjectId(req.params.id),
        from: req.user.id,
      });
      if (!msg) return res.status(404).json({ msg: "msg not found" });
      await Message.findOneAndUpdate({
        status: "deleted",
        msg: "message deleted",
      });
      return res.json({ msg: "delete success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const getTokenBearer = (req) => {
  const token = req.header("Authorization").split(" ")[1];
  return token || "";
};

module.exports = messageCtrl;
