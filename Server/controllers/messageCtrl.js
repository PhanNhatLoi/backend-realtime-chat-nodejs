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
            totalMessage: { $sum: 1 },
          },
        },
        {
          $addFields: {
            messages: { $slice: ["$messages", 10] },
          },
        },
        {
          $addFields: {
            page: 1, // Hardcode giá trị page là 1
          },
        },
        {
          $addFields: {
            messages: { $reverseArray: "$messages" },
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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
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
          $addFields: {
            messages: { $slice: ["$messages", skip, limit] },
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
      const updateData = {
        status: "deleted",
        msg: "message deleted",
      };
      const findAndUpdateMessage = await Message.findOneAndUpdate(
        {
          _id: new ObjectId(req.params.id),
          from: req.user.id,
          status: { $ne: "deleted" },
        },
        updateData
      );

      if (findAndUpdateMessage) {
        const message = await Message.findById(new ObjectId(req.params.id));
        pusher.trigger(message.from.toString(), "update-msg", {
          msg: message,
        });
        pusher.trigger(message.to.toString(), "update-msg", {
          msg: message,
        });
        return res.json({ msg: "delete success!" });
      } else return res.status(404).json({ msg: "err.message" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  reactionMsg: async (req, res) => {
    const { react } = req.body;
    try {
      const findMessage = await Message.findOne({
        _id: new ObjectId(req.params.id),
        status: { $ne: "deleted" },
      });
      if (findMessage) {
        const updateData = {
          react: findMessage.react === react ? "" : react,
        };
        await Message.findOneAndUpdate(
          {
            _id: new ObjectId(req.params.id),
            status: { $ne: "deleted" },
          },
          updateData
        );
        const message = await Message.findById(new ObjectId(req.params.id));
        pusher.trigger(message.from.toString(), "update-msg", {
          msg: message,
        });
        pusher.trigger(message.to.toString(), "update-msg", {
          msg: message,
        });
        return res.json({ msg: "reaction success!" });
      } else {
        return res.status(404).json({ msg: "err.message" });
      }
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
