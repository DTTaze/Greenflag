Link Powerpoint Giới thiệu về dự án: https://www.canva.com/design/DAGnDYmYoIQ/lDFKvXnftxKg17Wb_ek5WA/edit?utm_content=DAGnDYmYoIQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

# TECHSOLVE 2025 — Greenflag

Protect the environment.

## Architecture

This project consists of:
- **Frontend**: Next.js 16 application located in [FRONTEND](file:///d:/PARA%20Method/Project/Greenflag/FRONTEND).
- **Backend**: NestJS application located in [backend-nestjs](file:///d:/PARA%20Method/Project/Greenflag/backend-nestjs).
- **Infrastructure**: PostgreSQL, Redis, Loki, Jaeger, Prometheus, Grafana, and Cloudflare Tunnel.

Note: The old Express backend (`BACKEND`) has been deprecated and is no longer used.

---

## Installation & Setup

1. **Install Frontend Dependencies**:
   ```bash
   cd ./FRONTEND
   npm install
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd ./backend-nestjs
   yarn install
   ```

3. **Setup Environment Variables**:
   - Copy `.env.example` to `.env` in the root directory and fill in your values.
   - Copy `FRONTEND/.env.example` to `FRONTEND/.env` and update configuration values.
   - Copy `backend-nestjs/.env.example` to `backend-nestjs/.env` and update configuration values.

---

## Running with Docker (Recommended)

You can manage all services using the provided `Makefile` or Docker Compose:

- **Initialize Network & Start Containers**:
  ```bash
  make init
  ```
  *(Creates the external docker network `greenflag-net` and starts infrastructure + app containers)*

- **Start Infrastructure Services Only**:
  ```bash
  make infra-up
  ```

- **Start Application Services Only**:
  ```bash
  make app-up
  ```

- **Stop All Services**:
  ```bash
  make down
  ```

- **Stop All and Remove Volumes**:
  ```bash
  make clean
  ```

- **Check Logs**:
  ```bash
  make logs
  ```

---

## Running Locally for Development

### 1. Start Infrastructure
Make sure database and Redis are running (you can start them via `make app-up` or docker-compose).

### 2. Run Backend (NestJS)
```bash
cd ./backend-nestjs
yarn start:dev
```
- **Backend API**: [http://localhost:3030](http://localhost:3030)
- **Swagger Documentation**: [http://localhost:3030/docs](http://localhost:3030/docs)

### 3. Run Frontend (Next.js)
```bash
cd ./FRONTEND
npm run dev
```
- **Frontend App**: [http://localhost:3000](http://localhost:3000) or as configured (Docker exposes it on [http://localhost:5173](http://localhost:5173))
