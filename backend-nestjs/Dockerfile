# Stage 1: Build
FROM --platform=linux/amd64 node:20-alpine AS builder

WORKDIR /app

# Copy dependency configs
COPY package.json yarn.lock ./

# Install dependencies (development dependencies included for compilation)
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN yarn build

# Stage 2: Run
FROM --platform=linux/amd64 node:20-alpine AS runner

WORKDIR /app

# Copy dependency configs
COPY package.json yarn.lock ./

# Install production-only dependencies
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy compiled build output & templates
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/dist ./dist

# Expose backend port
EXPOSE 3030

# Start production server
CMD ["node", "dist/main"]
