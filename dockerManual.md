# Hướng dẫn chạy Docker cho Greenflag

### 1. Build các Docker image:
```bash
docker compose --env-file ./BACKEND/.env build
```

### 2. Khởi chạy các container trong chế độ background (-d):
```bash
docker compose --env-file ./BACKEND/.env up -d
```

### 3. Chạy Database Migrations (Tạo bảng dữ liệu):
```bash
docker compose --env-file ./BACKEND/.env exec backend npx sequelize-cli db:migrate
```

### 4. Chạy Seeders (Thêm dữ liệu mẫu ban đầu):
```bash
docker compose --env-file ./BACKEND/.env exec backend npm run seed
```

### 5. Dừng các container:
```bash
docker compose --env-file ./BACKEND/.env down
```