# NestJS 11 Migration Plan — TECHSOLVE 2025 (Boilerplate Integration)

> **Scope:** Full Backend Rewrite (Express.js to NestJS 11) using ptquanh boilerplate
> **Branch:** `refactor/nestjs-migration`

---

## Executive Summary

As authorized by the strategic pivot, we are undertaking a **complete backend rewrite** from Express.js and Sequelize to NestJS 11 and TypeORM. To accelerate development, maintain high quality, and prevent redundant coding, we are utilizing the custom boilerplate repository: `https://github.com/ptquanh/boilerplate-backend-nestjs-postgresql.git`.

This plan outlines the adjusted roadmap, files to be modified in the boilerplate, and how the core modules will be integrated while strictly complying with `BACKEND_ARCHITECTURE.md`.

---

## User Review Required

> [!IMPORTANT]
> The ptquanh boilerplate relies on the npm package `mvc-common-toolkit` for core classes (`RedisService`, `AxiosHttpService`, `AuditService`, `workflows.SyncTaskQueue`, etc.). We must verify that `yarn install` successfully fetches this package from the registry and integrates it.
>
> All database environment variables must align with the boilerplate's configs. We will adjust `configs/database.config.ts` in the boilerplate to use `process.env.DB_NAME` instead of `process.env.DB_SCHEMA` to maintain parity with our current `.env` configuration.

---

## Strategic Pivots (Phase 2 Strategy Update)

> [!IMPORTANT]
> The Identity & Access Context has been simplified to favor development speed and maintainability:
>
> 1. **Auth Strategy:** Single JWT access token stored in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie. The `AuthGuard` extracts this token strictly from `req.cookies.access_token`.
> 2. **Authorization Strategy:** Static RBAC (dropped CASL ABAC). The role enum is strictly `admin`, `partner`, and `user`.
> 3. **Database Schema Simplification:** Separate `Role`, `Permission`, and `RolePermission` tables are deleted. The `User` entity holds a direct `role` column mapping the `ROLE` enum value.
> 4. **CORS credentials support:** Modified CORS settings to `{ origin: true, credentials: true }` allowing browsers to exchange cookies securely.
> 5. **Ownership Checks:** Verified directly in controllers or services using direct equality comparison (`if (resource.userId !== req.user.id)`).

---

## Boilerplate Code Reuse & Customizations

We will reuse the following files directly from the boilerplate with minimal changes:

- `shared/services/base-crud.service.ts` — Standardized CRUD operations
- `shared/common/audit.entity.ts` — `AuditWithTimezone` entity
- `shared/common/pagination.dto.ts` — Pagination DTOs
- `shared/helpers/operation-result.helper.ts` — Standard `HttpResponse<T>` & result generators
- `shared/helpers/validate-config.helper.ts` — Configuration validation
- `shared/interceptors/http-logging.interceptor.ts` — Request-level logging
- `shared/interceptors/http-response.interceptor.ts` — Response wrapper
- `shared/filters/all-exceptions.filter.ts` — Exception handler

We will implement/modify the following additions to the boilerplate:

1. **Database Config:** Map `DB_NAME` in `configs/database.config.ts`.
2. **Guards:** Create `shared/guards/auth.guard.ts` (stateless cookie JWT) and `shared/guards/roles.guard.ts` (RBAC validation).
3. **Domain Enums:** Create `shared/enums.ts` containing `ROLE` and all specific transaction/delivery/task/item statuses.
4. **App Setup:** Merge boilerplate `setup.ts` and `main.ts` with our session-less JWT cookie configuration, Swagger, and body size limits.

---

## Phased Execution Roadmap

### Phase 1: Boilerplate Alignment & Shared Setup

- [x] Verify `yarn install` and `yarn build` on the boilerplate completes successfully.
- [x] Modify `tsconfig.json` to configure path aliases matching the project:
  - `@configs/*` -> `src/configs/*`
  - `@modules/*` -> `src/modules/*`
  - `@shared/*` -> `src/shared/*`
- [x] Add `.env` file containing database connections and external credentials.
- [x] Update `configs/database.config.ts` to map `database: process.env.DB_NAME`.
- [x] Create `shared/enums.ts` containing the required application enums (`ROLE`, `ITEM_STATUS`, `PRODUCT_CATEGORY`, etc.).
- [x] Add `shared/guards/auth.guard.ts` and `shared/guards/roles.guard.ts`.
- [x] Verify basic health check `/api/v1/health` compiles and runs.

### Phase 2: Identity & Access Context (`auth`, `user`)

- [x] Define TypeORM entities: `User`, `Rank`, `Coin` (Dropped separate role/permission tables).
- [x] Refactor `User` entity to use a direct enum `role` column (`admin`, `partner`, `user`).
- [x] Implement `UserModule` (incorporating `UserService`, `UserController` and consolidated `user.dto.ts`).
- [x] Implement static RBAC guards and drop CASL ABAC ability factory.
- [x] Implement `AuthModule` with JWT (HTTP-only cookies), passport Local, and passport Google OAuth 2.0 callback.
- [x] Apply cascading updates (cookie-only extraction in AuthGuard, credentials-enabled CORS in setup.ts).

### Phase 3: Core Task & Acceptance Context (`task`, `task-submit`)

- [x] Define TypeORM entities: `Task`, `Type`, `TaskType`, `TaskUser`, `TaskSubmit` (using direct JSONB `images` storage).
- [x] Implement DTOs using `class-validator` matching original validation rules (consolidated into `task.dto.ts`).
- [x] Implement modules extending `BaseCRUDService` (`TaskModule` with `TaskService` and `TaskSubmitService` query methods).
- [x] Integrate full file uploads using NestJS FilesInterceptor and CloudinaryService uploading direct JSONB images arrays.
- [x] Implement database custom seeding for task types (`daily`, `weekly`, `event`, `others`) using an OnModuleInit lifecycle hook.
- [x] Apply manual task and visibility ownership checks inside TaskController / TaskService.

### Phase 4: E-Commerce & Shipping Context (`item`, `product`, `transaction`, `delivery`)

- [x] **Define TypeORM Entities & Relationships:**
  - Define `Product` (C2C catalog) with `OneToMany` relationship to `Item` (`onDelete: 'RESTRICT'`).
  - Define `Item` with size/weight details, `ManyToOne` to `Product`, and `ManyToOne` to `User` (`creator`).
  - Define `Transaction` with status, snapshots, and `OneToOne` to `DeliveryOrder` (`onDelete: 'CASCADE'`).
  - Define `DeliveryAccount` mapping seller carrier API credentials using generic JSONB `apiConfig` column.
  - Define `ReceiverInformation` mapping user delivery addresses (`onDelete: 'CASCADE'`).
  - Define `DeliveryOrder` mapping carrier responses and tracking (`onDelete: 'CASCADE'`).
  - Convert all TypeORM entity column types from `enum` to `varchar` for Postgres compatibility and simple schema evolution.
- [x] **Atomic Purchase with Pessimistic Locking:**
  - Implement purchase endpoint: `POST /commerce/items/:itemId/purchase`.
  - Validate parameters (quantity, receiver info).
  - Wrap database execution in a transaction using `QueryRunner`.
  - Apply Pessimistic Write Lock (`setLock('pessimistic_write')`) to:
    - The `Item` record (verify status is `available` and stock >= quantity).
    - The buyer's `Coin` record (verify balance >= price * quantity).
  - Perform deductions: subtract quantity from `Item` stock, and subtract `totalPrice` from buyer's `Coin`.
  - Create the `Transaction` record in `PENDING` status.
  - Dispatch a background job to `COMMERCE_QUEUE` containing the `transactionId` and purchase details.
- [x] **Background Processing with BullMQ:**
  - Set up Redis configuration using ConfigModule.
  - Register `COMMERCE_QUEUE` using `@nestjs/bullmq` and `bullmq` packages.
  - Implement `CommerceProcessor` to consume `process-item-purchase` jobs.
  - Inside processor:
    - Retrieve transaction, buyer, seller, and receiver information.
    - Fetch the default `DeliveryAccount` of the seller.
    - Resolve the active shipping strategy from `ShippingFactoryService`.
    - Dispatch creation call to carrier strategy using carrier-agnostic `StandardShippingPayload`.
    - Create a `DeliveryOrder` record in the database using the mapped response data, linked to the `Transaction`.
    - Update `Transaction` status to `ACCEPTED` (or handle errors by executing a SAGA compensating action that refunds coins, increments stock, and sets transaction to `CANCELLED`).
- [x] **Shipping Strategy Pattern & Factory (ACL & Encapsulation):**
  - Implement `IShippingProvider` interface containing generic calculation, creation, cancellation, location queries, and credential validation methods.
  - Create concrete strategy implementations `GhnShippingStrategy` (handling real axios calls) and `GhtkShippingStrategy` (stub).
  - Implement `ShippingFactoryService` to dynamically resolve providers based on `CARRIER_TYPE`.
- [x] **Redis Location Caching & Shift-Left Validation:**
  - Integrated `@nestjs/cache-manager` and `cache-manager-redis-yet` in `DeliveryModule`.
  - Cached `getProvinces`, `getDistricts`, and `getWards` calls inside `GhnShippingStrategy` with 24-hour TTL (86400s).
  - Implemented dynamic credential verification (`validateConfig`) check in strategies (pinging GHN `/v2/shop/all` API) and intercepted `create` and `updateByID` in `DeliveryAccountService` to reject invalid accounts.

### Phase 5: Event, Media & Utility Context (`event`, `media`, `qr`)

- [ ] Define TypeORM entities: `Event`, `EventUser`, `Image`.
- [ ] Implement media Cloudinary streams and QR code services.

### Phase 6: Testing & E2E Validation

- [ ] Re-run all supertest integration test suites against PostgreSQL test database.

---

## Verification Plan

### Automated Tests

```bash
# Verify compilation
yarn build

# Run unit/e2e tests
yarn test:e2e
```
