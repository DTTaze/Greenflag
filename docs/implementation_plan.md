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

### Phase 2: Identity & Access Context (`auth`, `user`, `role`, `permission`)
- [ ] Define TypeORM entities: `User`, `Role`, `Permission`, `Rank`, `Coin`.
- [ ] Implement `UserModule`, `RoleModule`, `PermissionModule`.
- [ ] Integrate CASL Ability Factory for dynamic ABAC ownership rules.
- [ ] Implement `AuthModule` with JWT and Passport (Local & Google OAuth 2.0).

### Phase 3: Core Task & Acceptance Context (`task`, `task-submit`)
- [ ] Define TypeORM entities: `Task`, `TaskType`, `TaskUser`, `TaskSubmit`.
- [ ] Implement DTOs using `class-validator` matching original validation rules.
- [ ] Implement modules extending `BaseCRUDService`.

### Phase 4: E-Commerce & Shipping Context (`item`, `product`, `transaction`, `delivery`)
- [ ] Define TypeORM entities: `Item`, `Product`, `Transaction`, `DeliveryAccount`, `DeliveryOrder`, `ReceiverInformation`.
- [ ] Integrate background BullMQ processors for item purchases.

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
