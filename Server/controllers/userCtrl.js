const Users = require("../models/user");
const Groups = require("../models/group");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const saltOrRounds = 10;
const Pusher = require("pusher");
require("dotenv").config();
const pusher = new Pusher({
  appId: process.env.pusher_appId,
  key: process.env.pusher_key,
  secret: process.env.pusher_secret,
  cluster: process.env.pusher_cluster,
});

const arrayAvatar = [
  "v1727522545/image/cat-image-13.png",
  "v1727522545/image/cat-image-12.png",
  "v1727522545/image/cat-image-11.png",
  "v1727522545/image/cat-image-10.png",
  "v1727522545/image/cat-image-9.png",
  "v1727522545/image/cat-image-8.png",
  "v1727522545/image/cat-image-7.png",
  "v1727522544/image/cat-image-6.png",
  "v1727522544/image/cat-image-5.png",
  "v1727522544/image/cat-image-4.png",
  "v1727522544/image/cat-image-3.png",
  "v1727522544/image/cat-image-2.png",
  "v1727522544/image/cat-image-1.png",
];

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, password, email } = req.body;

      if (!name || !password || !email)
        return res.status(400).json({ msg: "please fill in all fields." });

      if (!validateEmail(email))
        return res.status(400).json({ errors: { email: "Invalid Email." } });

      const user = await Users.findOne({ email: email.toLowerCase() });
      if (user)
        return res
          .status(400)
          .json({ errors: { email: "this Email already exists." } });

      if (password.length < 6)
        return res.status(400).json({
          errors: { password: "password must be at least 6 character." },
        });

      const hash = await argon2.hash(password, saltOrRounds);

      const newUser = new Users({
        name,
        email: email.toLowerCase(),
        password: hash,
        avatar: `https://res.cloudinary.com/dkwth9uyw/image/upload/${
          arrayAvatar[Math.floor(Math.random() * 13)]
        }`,
      });

      pusher.trigger(process.env.pusher_channel, "user-register", {});

      await newUser.save();

      return res.json({ msg: "Register successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res
          .status(400)
          .json({ errors: { email: "please fill in all fields." } });
      const user = await Users.findOne({ email: email.toLowerCase() });
      if (!user)
        return res
          .status(400)
          .json({ errors: { email: "Email is not ready!" } });

      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch)
        return res
          .status(400)
          .json({ errors: { password: "wrong password!" } });
      const access_token = createAccessToken({ id: user.id });
      return res.json({ _token: access_token });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refresh_token;
      if (!rf_token) return res.status(400).json({ msg: "not logged in!" });
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "not logged in!" });

        const access_token = createAccessToken({ id: user.id });
        return res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUserInfor: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id)
        .select("-password")
        .populate({
          path: "groupIds",
        });
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllUserInfor: async (req, res) => {
    try {
      const user = await Users.find({ role: 0 }).select("-password");
      return res.json({ user: user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  logout: async (_, res) => {
    try {
      res.clearCookie("refresh_token", { path: "/user/refresh_token" });
      return res.json({ msg: "logout!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name, avatar } = req.body;
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          name,
          avatar,
        }
      );
      pusher.trigger(req.user.id, "user-update", {});

      return res.json({ msg: "update success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { password, currentPassword } = req.body;
      const user = await Users.findById(new ObjectId(req.user.id));
      if (!user)
        return res
          .status(400)
          .json({ errors: { email: "Email is not ready!" } });

      const isMatch = await argon2.verify(user.password, currentPassword);

      if (!isMatch)
        return res
          .status(400)
          .json({ errors: { currentPassword: "Password wrong!" } });

      const hash = await argon2.hash(password, saltOrRounds);
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: hash,
        }
      );
      pusher.trigger(req.user.id, "user-change-password", {});

      return res.json({ msg: "change password success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  joinGroup: async (req, res) => {
    try {
      const { groupId } = req.body;
      if (!groupId) {
        return res.status(500).json({ msg: "Group not found" });
      }
      const group = await Groups.findById(groupId);
      if (!group) {
        return res.status(500).json({ msg: "Group not found" });
      }
      const user = await Users.findById(new ObjectId(req.user.id));
      await Users.findOneAndUpdate(
        {
          _id: req.user.id,
        },
        {
          groupIds: (user.groupIds?.length &&
            user.groupIds.filter((f) => f !== groupId).push(groupId)) || [
            groupId,
          ],
        }
      );
      return res.json({ msg: "Join group success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  leaveGroup: async (req, res) => {
    try {
      const { groupId } = req.body;
      if (!groupId) {
        return res.status(500).json({ msg: "Group not found" });
      }
      const user = await Users.findById(new ObjectId(req.user.id));
      if (!user?.groupIds || !user?.groupIds?.some((s) => s === groupId)) {
        return res.status(500).json({ msg: "User not join group" });
      }
      await Users.findOneAndUpdate(
        {
          _id: req.user.id,
        },
        {
          groupIds: user?.groupIds?.filter((f) => f !== groupId),
        }
      );
      return res.json({ msg: "Leave group success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  blockUnBlockUser: async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId || userId === req.user.id) {
        return res.status(500).json({ msg: "User not found" });
      }
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(500).json({ msg: "User not found" });
      }
      const currentUser = await Users.findById(req.user.id);

      await Users.findOneAndUpdate(
        {
          _id: req.user.id,
        },
        {
          blockIds: currentUser.blockIds?.includes(new ObjectId(userId))
            ? currentUser.blockIds.filter((f) => f.toString() !== userId)
            : [...currentUser.blockIds, userId],
        }
      );
      return res.json({ msg: "update success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = userCtrl;
