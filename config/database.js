const mysql = require("mysql2");
require("dotenv").config();

// Cấu hình kết nối MySQL
// Railway tự động inject biến MYSQL_URL khi link service
const config = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || 'mysql.railway.internal',
  port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT) || 3306,
  user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 60000,
};

console.log('🔧 Database config:', {
  host: config.host,
  port: config.port,
  user: config.user,
  database: config.database,
});

// Tạo pool connection
const pool = mysql.createPool(config);

// Sử dụng promise để dễ dàng làm việc với async/await
const promisePool = pool.promise();

// Kiểm tra kết nối
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
    console.error("Code:", err.code);
    console.error("Vui lòng kiểm tra:");
    console.error("1. Railway MySQL service đã được link với app");
    console.error("2. Biến môi trường MYSQL_* đã được set");
    console.error("3. MySQL service đang chạy");
  } else {
    console.log("✅ Kết nối MySQL Railway thành công!");
    connection.release();
  }
});

module.exports = promisePool;
