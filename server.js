const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const postsRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/posts", postsRoutes);

// Root route - Trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route không tồn tại" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res
    .status(500)
    .json({ success: false, message: "Có lỗi xảy ra", error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/posts`);
});
