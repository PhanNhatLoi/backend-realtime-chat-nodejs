const cloudinary = require("cloudinary");
const fs = require("fs");
const imageFolder = "image";
const https = require("https");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadCtrl = {
  uploadAvatar: async (req, res) => {
    try {
      const file = req.files.file;
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        {
          folder: imageFolder,
          width: 150,
          height: 150,
          crop: "fill",
        },
        async (err, result) => {
          if (err) throw err;
          removeTmp(file.tempFilePath);
          const pathName = result.secure_url.split("/");
          res.json({ path: pathName[pathName.length - 1] });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getImage: async (req, res) => {
    const name = req.params.name;
    if (!name) return res.status(400).json({ msg: "Image not fount" });
    const response = await fetch(
      `${process.env.CLOUD_URL}${imageFolder}/${name}`,
      { agent: new https.Agent({ rejectUnauthorized: false }) }
    );
    if (!response.ok) {
      return res.status(400).json({ msg: "Image not fount" });
    }

    const contentType = response.headers.get("content-type");
    const buffer = await response.arrayBuffer();

    res.set("Content-Type", contentType);
    return res.send(Buffer.from(buffer));
  },
};
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = uploadCtrl;
