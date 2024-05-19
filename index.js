require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Router
app.use("/user", require("./Server/router/userRouter"));
app.use("/message", require("./Server/router/messageRouter"));
app.use("/file", require("./Server/router/file"));

// connect mongoDB
const URI = process.env.MONGODB_URI + process.env.DB_NAME;
mongoose
  .connect(URI, {})
  .then(() => {
    console.log("Kết nối thành công đến MongoDB");
  })
  .catch((err) => {
    console.error("Không thể kết nối đến MongoDB:", err);
  });

app.use("/", (req, res) => {
  res.json({ msg: "This is Server page!!" });
});

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// setupSocketIo(server);
server.listen(PORT, () => {
  console.log("Server is running at", PORT);
});
