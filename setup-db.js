// Script để tạo bảng trong Railway MySQL
const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupDatabase() {
  let connection;

  try {
    // Kết nối MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Đã kết nối MySQL Railway");

    // Tạo bảng users
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tạo bảng users thành công");

    // Tạo bảng posts
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Tạo bảng posts thành công");

    // Insert dữ liệu mẫu users
    await connection.execute(`
      INSERT IGNORE INTO users (username, email) VALUES 
      ('admin', 'admin@example.com'),
      ('user1', 'user1@example.com')
    `);
    console.log("✅ Thêm dữ liệu mẫu users");

    // Insert dữ liệu mẫu posts
    const [rows] = await connection.execute(
      "SELECT COUNT(*) as count FROM posts"
    );
    if (rows[0].count === 0) {
      await connection.execute(`
        INSERT INTO posts (title, content, author) VALUES 
        ('Chào mừng đến với Blog', 'Đây là bài viết đầu tiên trên blog của chúng tôi. Hãy cùng khám phá những nội dung thú vị!', 'admin'),
        ('Hướng dẫn sử dụng', 'Bạn có thể tạo, chỉnh sửa và xóa bài viết một cách dễ dàng với giao diện thân thiện.', 'admin')
      `);
      console.log("✅ Thêm dữ liệu mẫu posts");
    } else {
      console.log("ℹ️  Đã có dữ liệu posts, bỏ qua insert");
    }

    console.log("\n🎉 Setup database hoàn tất!");
    console.log("🚀 Bạn có thể chạy: npm start");
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
