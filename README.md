# Blog Website với MySQL Railway

Website blog đơn giản cho phép viết và đăng bài viết, kết nối với MySQL trên Railway.

## ✨ Tính năng

- ✅ Tạo bài viết mới
- ✅ Xem danh sách bài viết
- ✅ Chỉnh sửa bài viết
- ✅ Xóa bài viết
- ✅ Giao diện responsive, thân thiện
- ✅ Kết nối MySQL trên Railway

## 🛠️ Công nghệ sử dụng

- **Backend:** Node.js + Express.js
- **Database:** MySQL (Railway)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript

## 📋 Yêu cầu

- Node.js (v14 trở lên)
- MySQL trên Railway
- npm hoặc yarn

## 🚀 Hướng dẫn cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình Database

Tạo file `.env` từ `.env.example`:

```bash
Copy-Item .env.example .env
```

Cập nhật thông tin MySQL Railway trong file `.env`:

```env
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-railway-password
DB_NAME=railway
PORT=3000
NODE_ENV=development
```

### 3. Tạo Database Schema

Truy cập Railway MySQL dashboard và chạy nội dung file `schema.sql` để tạo bảng và dữ liệu mẫu.

**Hoặc** sử dụng MySQL client:

```bash
mysql -h mysql.railway.internal -u root -p railway < schema.sql
```

### 4. Chạy ứng dụng

**Development mode (với nodemon):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📁 Cấu trúc dự án

```
web_blog_up/
├── config/
│   └── database.js          # Cấu hình kết nối MySQL
├── routes/
│   └── posts.js             # API routes cho posts
├── public/
│   ├── index.html           # Trang chủ
│   ├── css/
│   │   └── style.css        # Styles
│   └── js/
│       └── app.js           # Frontend logic
├── .env                     # Environment variables (không commit)
├── .env.example             # Template cho .env
├── .gitignore               # Git ignore
├── package.json             # Dependencies
├── schema.sql               # Database schema
└── server.js                # Entry point
```

## 🔌 API Endpoints

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/posts`     | Lấy tất cả bài viết |
| GET    | `/api/posts/:id` | Lấy một bài viết    |
| POST   | `/api/posts`     | Tạo bài viết mới    |
| PUT    | `/api/posts/:id` | Cập nhật bài viết   |
| DELETE | `/api/posts/:id` | Xóa bài viết        |

### Ví dụ Request

**Tạo bài viết mới:**

```json
POST /api/posts
Content-Type: application/json

{
  "title": "Tiêu đề bài viết",
  "content": "Nội dung bài viết...",
  "author": "Tên tác giả"
}
```

## 🌐 Deploy lên Railway

### 1. Tạo dự án Railway

1. Truy cập [railway.app](https://railway.app)
2. Tạo project mới
3. Thêm MySQL service
4. Copy thông tin kết nối MySQL

### 2. Deploy Node.js App

1. Connect GitHub repository hoặc deploy từ CLI
2. Thêm environment variables từ file `.env`
3. Railway sẽ tự động detect và deploy Node.js app

### 3. Chạy Database Migration

Trong Railway MySQL service, mở Query Editor và chạy nội dung file `schema.sql`

### 4. Truy cập ứng dụng

Railway sẽ cung cấp URL public để truy cập: `https://your-app.railway.app`

## 🔒 Bảo mật

- ✅ File `.env` đã được thêm vào `.gitignore`
- ✅ Không commit thông tin nhạy cảm
- ✅ Sử dụng prepared statements để tránh SQL injection
- ⚠️ Nên thêm authentication cho production

## 🐛 Xử lý lỗi thường gặp

### Lỗi kết nối MySQL

```
❌ Lỗi kết nối MySQL: Access denied
```

**Giải pháp:**

- Kiểm tra thông tin `DB_HOST`, `DB_USER`, `DB_PASSWORD` trong `.env`
- Đảm bảo Railway MySQL service đang chạy

### Port đã được sử dụng

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Giải pháp:**

- Thay đổi `PORT` trong file `.env`
- Hoặc kill process đang dùng port 3000

## 📝 License

ISC

## 👤 Liên hệ

Nếu có vấn đề, hãy tạo issue hoặc liên hệ qua email.

---

**Chúc bạn code vui vẻ! 🚀**
