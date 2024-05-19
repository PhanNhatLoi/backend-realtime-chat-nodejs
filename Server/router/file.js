const router = require("express").Router();
const uploadCtrl = require("../controllers/fileCtrl");
const auth = require("../middleware/auth");

router.post("/upload_avatar", auth, uploadCtrl.uploadAvatar);
router.get("/:name", uploadCtrl.getImage);

module.exports = router;
