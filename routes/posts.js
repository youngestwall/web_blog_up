const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET - Lấy tất cả bài viết
router.get("/", async (req, res) => {
  try {
    const [posts] = await db.query(
      "SELECT id, title, content, author, created_at, updated_at FROM posts ORDER BY created_at DESC"
    );
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
});

// GET - Lấy một bài viết theo ID
router.get("/:id", async (req, res) => {
  try {
    const [posts] = await db.query(
      "SELECT id, title, content, author, created_at, updated_at FROM posts WHERE id = ?",
      [req.params.id]
    );

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài viết" });
    }

    res.json({ success: true, data: posts[0] });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
});

// POST - Tạo bài viết mới
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ tiêu đề, nội dung và tên tác giả",
      });
    }

    const [result] = await db.query(
      "INSERT INTO posts (title, content, author) VALUES (?, ?, ?)",
      [title, content, author]
    );

    res.status(201).json({
      success: true,
      message: "Tạo bài viết thành công",
      data: { id: result.insertId, title, content, author },
    });
  } catch (error) {
    console.error("Lỗi khi tạo bài viết:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
});

// PUT - Cập nhật bài viết
router.put("/:id", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const { id } = req.params;

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ tiêu đề, nội dung và tên tác giả",
      });
    }

    const [result] = await db.query(
      "UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?",
      [title, content, author, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài viết" });
    }

    res.json({
      success: true,
      message: "Cập nhật bài viết thành công",
      data: { id, title, content, author },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật bài viết:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
});

// DELETE - Xóa bài viết
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM posts WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài viết" });
    }

    res.json({ success: true, message: "Xóa bài viết thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bài viết:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
