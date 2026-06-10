# Sử dụng image Node.js phiên bản 20 làm builder
FROM --platform=linux/amd64 node:20-alpine AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json trước để cache layer khi build
COPY package.json package-lock.json ./

# Cài đặt dependencies (bao gồm devDependencies để biên dịch Next.js)
RUN npm install --legacy-peer-deps

# Copy toàn bộ source code vào container
COPY . .

# Build ứng dụng Next.js cho production
RUN npm run build

# Stage 2: Runner cho môi trường Production
FROM --platform=linux/amd64 node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy các file cần thiết từ builder để chạy ứng dụng
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/src/i18n ./src/i18n

# Expose cổng chạy ứng dụng (ở đây ta cấu hình port 5173)
EXPOSE 5173

# Chạy production server của Next.js trên port 5173 và lắng nghe mọi interface
CMD ["npm", "run", "start", "--", "-p", "5173", "-H", "0.0.0.0"]

