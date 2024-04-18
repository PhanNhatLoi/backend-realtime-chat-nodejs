const Users = require("../models/user");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const saltOrRounds = 10;

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, password, email } = req.body;

      if (!name || !password || !email)
        return res.status(400).json({ msg: "please fill in all fields." });

      if (!validateEmail(email))
        return res.status(400).json({ errors: { email: "Invalid Email." } });

      const user = await Users.findOne({ email });
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
        email,
        password: hash,
        avatar: `/cat-image-${Math.floor(Math.random() * 13) + 1}.png`,
      });

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
      const user = await Users.findOne({ email });
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
      const user = await Users.findById(req.user.id).select("-password");
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
