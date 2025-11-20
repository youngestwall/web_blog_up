const mysql = require("mysql2");
require("dotenv").config();

// Kiểm tra biến môi trường Railway
const hasRailwayVars = !!(process.env.MYSQLHOST || process.env.MYSQL_HOST);
const isLocal = !process.env.RAILWAY_ENVIRONMENT;

console.log("🌍 Environment:", {
  isLocal,
  hasRailwayVars,
  env: process.env.NODE_ENV || 'development'
});

// Cấu hình kết nối MySQL
// Railway V2 sử dụng MYSQLHOST, MYSQLPORT, etc. (không có underscore)
const config = {
  host: process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST,
  port: parseInt(process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 60000,
};

// Validate config
if (!config.host || !config.password) {
  console.error("❌ THIẾU THÔNG TIN KẾT NỐI DATABASE!");
  console.error("📋 Hướng dẫn cấu hình Railway:");
  console.error("1. Vào Railway Dashboard → Your Project");
  console.error("2. Click vào Node.js Service");
  console.error("3. Tab 'Variables' → Click '+ New Variable'");
  console.error("4. Click 'Add Reference' → Chọn MySQL service");
  console.error("5. Railway sẽ tự động thêm MYSQLHOST, MYSQLPORT, etc.");
  console.error("");
  console.error("🔧 Biến cần thiết:");
  console.error("  MYSQLHOST - MySQL host");
  console.error("  MYSQLPORT - MySQL port (default: 3306)");
  console.error("  MYSQLUSER - MySQL user (default: root)");
  console.error("  MYSQLPASSWORD - MySQL password");
  console.error("  MYSQLDATABASE - Database name (default: railway)");
}

console.log("🔧 Database config:", {
  host: config.host || '❌ MISSING',
  port: config.port,
  user: config.user,
  database: config.database,
  hasPassword: !!config.password
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
