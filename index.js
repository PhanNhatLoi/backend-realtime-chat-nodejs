// index.js

// Import Express
const express = require("express");

// Khởi tạo Express app
const app = express();
const port = 3000;

// Định nghĩa một route đơn giản
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Lắng nghe các kết nối đến cổng được chỉ định
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
