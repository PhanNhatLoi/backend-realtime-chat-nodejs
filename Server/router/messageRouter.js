const router = require("express").Router();
const messageCtrl = require("../controllers/messageCtrl");
const auth = require("../middleware/auth");

router.post("/send-msg", auth, messageCtrl.sendMsg);

router.get("/get-all-msg", auth, messageCtrl.getAllMsg);
router.get("/get-msg", auth, messageCtrl.getMsg);
router.post("/read-msg", auth, messageCtrl.readMsg);

module.exports = router;
