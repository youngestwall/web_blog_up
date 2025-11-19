const mysql = require("mysql2");
require("dotenv").config();

// Tạo pool connection với Railway Public Network
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 60000, // 60 seconds
});

// Sử dụng promise để dễ dàng làm việc với async/await
const promisePool = pool.promise();

// Kiểm tra kết nối
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
    console.error("Vui lòng kiểm tra:");
    console.error("1. File .env đã được tạo từ .env.example");
    console.error("2. Thông tin kết nối Railway MySQL đã đúng");
    console.error("3. Railway MySQL service đang chạy");
  } else {
    console.log("✅ Kết nối MySQL Railway thành công!");
    connection.release();
  }
});

module.exports = promisePool;
