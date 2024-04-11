const router = require("express").Router();
const messageCtrl = require("../controllers/messageCtrl");
const auth = require("../middleware/auth");

router.post("/sendmsg", auth, messageCtrl.sendMsg);

router.get("/getallmsg", auth, messageCtrl.getAllMsg);
router.get("/getmsg", auth, messageCtrl.getMsg);

module.exports = router;
