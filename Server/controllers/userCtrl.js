const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("./sendMail");

const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const CLIENT_URL = process.env.CLIENT_URL;
const saltOrRounds = 10;

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, password, email, cf_password } = req.body;

      if (!name || !password || !email || !cf_password)
        return res.status(400).json({ msg: "please fill in all fields." });

      if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid Email." });

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "this Email already exists." });

      if (password != cf_password)
        return res.status(400).json({ msg: "confirm password not match" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "password must be at least 6 character." });

      const hash = await bcrypt.hash(password, saltOrRounds);

      const newUser = {
        name,
        email,
        password: hash,
      };

      const activation_token = createActivationToken(newUser);

      const url = `${CLIENT_URL}/user/activation/${activation_token}`;
      sendEmail(email, url, "kich hoat tai khoan!");

      res.json({ msg: "Register successfully, check email to activate!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  activationEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );
      const { name, email, password } = user;

      const newUser = new Users({
        name,
        email,
        password,
      });

      await newUser.save();

      res.json({ msg: "Account has been activeted!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ msg: "please fill in all fields." });
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Email is not ready!" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "wrong password!" });
      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({ msg: "Loggin success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "not logged in!" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "not logged in!" });

        const access_token = createAccessToken({ id: user.id });
        res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.status(500).json({ msg: "Email is not ready!" });

      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/user/reset/${access_token}`;

      sendEmail(email, url, "Reset Password");
      res.json({ msg: "Verification code sent, please check your email!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const hash = await bcrypt.hash(password, saltOrRounds);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: hash,
        }
      );

      res.json({ msg: "password successfully change!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUserInfor: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      res.json(user);
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

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
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

      res.json({ msg: "update success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);
      res.json({ msg: "delete success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body;
      if (!tokenId) return;

      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });

      const { email_verified, email, name, picture } = verify.payload;

      const password = email + process.env.GOOGLE_SECTET;

      const passwordHash = await bcrypt.hash(password, saltOrRounds);

      if (!email_verified)
        return res.status(500).json({ msg: "Email verification failed." });

      if (email_verified) {
        const user = await Users.findOne({ email });
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch)
            return res.status(400).json({
              msg: "The account has been registered with a different password.",
            });

          const refresh_token = createRefreshToken({ id: user._id });
          res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/user/refresh_token",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.json({ msg: "Loggin success!" });
        } else {
          const newUser = new Users({
            name,
            email,
            password: passwordHash,
            avatar: picture,
          });
          await newUser.save();
          const refresh_token = createRefreshToken({ id: newUser._id });
          res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/user/refresh_token",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.json({ msg: "Loggin success!" });
        }
      }
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

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
