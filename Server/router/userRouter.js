const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

router.post("/refresh_token", userCtrl.getAccessToken);

router.get("/infor", auth, userCtrl.getUserInfor);

router.get("/all_infor", auth, userCtrl.getAllUserInfor);

router.post("/logout", userCtrl.logout);

router.patch("/update", auth, userCtrl.updateUser);

router.put("/change_password", auth, userCtrl.changePassword);

module.exports = router;
