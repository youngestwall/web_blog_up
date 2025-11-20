const mysql = require("mysql2");
require("dotenv").config();

// Kiểm tra biến môi trường Railway
const hasRailwayVars = !!(process.env.MYSQLHOST || process.env.MYSQL_HOST);
const isLocal = !process.env.RAILWAY_ENVIRONMENT;

console.log("🌍 Environment:", {
  isLocal,
  hasRailwayVars,
  env: process.env.NODE_ENV || "development",
});

// Cấu hình kết nối MySQL
// Railway V2 sử dụng MYSQLHOST, MYSQLPORT, etc. (không có underscore)
const config = {
  host: process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST,
  port: parseInt(
    process.env.MYSQLPORT ||
      process.env.MYSQL_PORT ||
      process.env.DB_PORT ||
      3306
  ),
  user:
    process.env.MYSQLUSER ||
    process.env.MYSQL_USER ||
    process.env.DB_USER ||
    "root",
  password:
    process.env.MYSQLPASSWORD ||
    process.env.MYSQL_PASSWORD ||
    process.env.DB_PASSWORD,
  database:
    process.env.MYSQLDATABASE ||
    process.env.MYSQL_DATABASE ||
    process.env.DB_NAME ||
    "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 60000,
};

// Check if using Railway internal hostname (won't work for external connections)
if (config.host && config.host.includes("railway.internal")) {
  console.error(
    "⚠️  CẢNH BÁO: Đang dùng 'mysql.railway.internal' - chỉ hoạt động trong Railway Private Network"
  );
  console.error("❌ Để deploy thành công, làm theo:");
  console.error("");
  console.error("📋 HƯỚNG DẪN SỬA LỖI:");
  console.error("1. Vào Railway → MySQL Service → Tab 'Connect'");
  console.error("2. Chọn 'Public Network' (KHÔNG PHẢI Private)");
  console.error("3. Copy thông tin:");
  console.error("   - Host (vd: yamanote.proxy.rlwy.net)");
  console.error("   - Port (vd: 56290)");
  console.error("   - Password");
  console.error("");
  console.error("4. Vào Node.js Service → Tab 'Variables'");
  console.error("5. XÓA các biến MYSQL* cũ nếu có");
  console.error("6. Thêm thủ công:");
  console.error("   MYSQLHOST=yamanote.proxy.rlwy.net");
  console.error("   MYSQLPORT=56290");
  console.error("   MYSQLUSER=root");
  console.error("   MYSQLPASSWORD=<your-password>");
  console.error("   MYSQLDATABASE=railway");
  console.error("");
  console.error("7. Redeploy");
}

// Validate config
if (!config.host || !config.password) {
  console.error("❌ THIẾU THÔNG TIN KẾT NỐI DATABASE!");
  console.error("Cần có: MYSQLHOST, MYSQLPASSWORD");
}

console.log("🔧 Database config:", {
  host: config.host || "❌ MISSING",
  port: config.port,
  user: config.user,
  database: config.database,
  hasPassword: !!config.password,
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
