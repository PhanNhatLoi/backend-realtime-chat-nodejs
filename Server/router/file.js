const router = require("express").Router();
const uploadCtrl = require("../controllers/fileCtrl");
const auth = require("../middleware/auth");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/upload_avatar",
  auth,
  upload.single("file"),
  uploadCtrl.uploadAvatar
);

router.post(
  "/upload-image-free",
  upload.single("file"),
  uploadCtrl.uploadImage
);

router.get("/:name", uploadCtrl.getImage);

module.exports = router;
