const cloudinary = require("cloudinary").v2;
const imageFolder = "image";
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadCtrl = {
  uploadAvatar: async (req, res) => {
    try {
      const file = req.file;
      let stream = cloudinary.uploader.upload_stream(
        {
          folder: imageFolder,
          width: 150,
          height: 150,
          crop: "fill",
        },
        (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.json({ path: result.secure_url });
        }
      );

      // Chuyển đổi buffer thành stream và tải lên Cloudinary
      streamifier.createReadStream(file.buffer).pipe(stream);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  uploadImage: async (req, res) => {
    try {
      const file = req.file;
      let stream = cloudinary.uploader.upload_stream(
        {
          folder: imageFolder,
          // width: 150,
          // height: 150,
          // crop: "fill",
        },
        (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          const pathName = result.secure_url.split("/");
          res.json({ path: pathName[pathName.length - 1] });
        }
      );

      // Chuyển đổi buffer thành stream và tải lên Cloudinary
      streamifier.createReadStream(file.buffer).pipe(stream);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = uploadCtrl;
