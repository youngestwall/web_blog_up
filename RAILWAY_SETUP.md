# HƯỚNG DẪN KẾT NỐI MYSQL RAILWAY

## Khi Deploy trên Railway:

- Sử dụng DATABASE_URL với mysql.railway.internal (đã cấu hình)
- Railway tự động kết nối qua Private Network

## Khi chạy Local (trên máy tính của bạn):

### Bước 1: Lấy Public Network URL

1. Vào Railway Dashboard: https://railway.app
2. Chọn dự án của bạn
3. Click vào MySQL service
4. Click tab "Connect"
5. Chọn "Public Network" (KHÔNG phải Private Network)
6. Copy thông tin:
   - MYSQLHOST (ví dụ: viaduct.proxy.rlwy.net)
   - MYSQLPORT (ví dụ: 12345)

### Bước 2: Cập nhật file .env

Mở file `.env` và thay đổi như sau:

```env
# Comment dòng DATABASE_URL (thêm # ở đầu)
# DATABASE_URL=mysql://root:HJEGCEJChEtwiRQhBWzILOBxnoPFEGCW@mysql.railway.internal:3306/railway

# Bỏ comment và điền thông tin Public Network
DB_HOST=viaduct.proxy.rlwy.net
DB_PORT=12345
DB_USER=root
DB_PASSWORD=HJEGCEJChEtwiRQhBWzILOBxnoPFEGCW
DB_NAME=railway
```

### Bước 3: Chạy lại server

```bash
npm start
```

Hoặc development mode:

```bash
npm run dev
```

---

## Lưu ý quan trọng:

⚠️ `mysql.railway.internal` CHỈ hoạt động khi code chạy TRÊN Railway
✅ Public Network (viaduct.proxy.rlwy.net) hoạt động cả local VÀ deploy
🔒 Không commit file `.env` lên Git (đã có trong .gitignore)
