# Sử dụng image Node.js phiên bản 20
FROM node:20

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json trước để cache layer khi build
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install --legacy-peer-deps
# Copy toàn bộ source code vào container
COPY . .

# Expose cổng chạy ứng dụng (ở đây ta cấu hình port 5173)
EXPOSE 5173

# Chạy dev server của Next.js trên port 5173 và lắng nghe mọi interface
CMD ["npm", "run", "dev", "--", "-p", "5173", "-H", "0.0.0.0"]
