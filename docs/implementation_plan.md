# Backend Refactoring Plan — TECHSOLVE 2025

> **Branch:** `refactor/update-code-base`
> **Scope:** Express.js backend only — refactor in place, no framework migration.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Proposed Target Folder Structure](#2-proposed-target-folder-structure)
3. [Pillar 1 — Clean Architecture & SOLID](#3-pillar-1--clean-architecture--solid)
4. [Pillar 2 — Hard-coded Values, Constants & Enums](#4-pillar-2--hard-coded-values-constants--enums)
5. [Pillar 3 — DRY Violations & Duplicated Logic](#5-pillar-3--dry-violations--duplicated-logic)
6. [Pillar 4 — DTOs & Validation Layer](#6-pillar-4--dtos--validation-layer)
7. [Pillar 5 — Error Handling & Standard Responses](#7-pillar-5--error-handling--standard-responses)
8. [Pillar 6 — Background Jobs & Cron](#8-pillar-6--background-jobs--cron)
9. [Phased Execution Roadmap](#9-phased-execution-roadmap)
10. [Verification Plan](#10-verification-plan)
11. [Resolved Open Questions](#11-resolved-open-questions)

---

## 1. Executive Summary

After scanning **all 19 controllers, 24 services, 8 middlewares, 17 route files, 2 workers, 1 cron job, 2 queues, 3 utils, and 7 config files**, the following systemic issues were identified:

| Category | Issues Found | Severity |
|---|---|---|
| Missing Repository Layer (Services = DB + Logic) | **24 service files** | 🔴 High |
| Hard-coded magic strings/numbers | **60+ instances** across 15+ files | 🔴 High |
| Duplicated code patterns (DRY) | **8 major patterns** repeated across files | 🟡 Medium |
| No request validation / DTO layer | **All 19 controllers** accept raw `req.body` | 🔴 High |
| Scattered error handling, no custom errors | **Every controller** has identical try/catch | 🟡 Medium |
| Inconsistent response format in some controllers | **3 controllers** bypass `res.success/res.error` | 🟡 Medium |
| Background jobs have no centralized config | Queue names are magic strings | 🟢 Low |

---

## 2. Proposed Target Folder Structure

```
src/
├── config/               # Existing (unchanged)
├── constants/            # 🆕 Enums, status maps, role names
│   ├── httpStatus.js
│   ├── roles.js
│   ├── taskStatus.js
│   ├── transactionStatus.js
│   ├── deliveryStatus.js
│   ├── eventStatus.js
│   ├── itemStatus.js
│   ├── cacheKeys.js
│   └── queueNames.js
├── controllers/          # Existing — refactor to thin wrappers
├── dtos/                 # 🆕 Zod/Joi schemas for request validation
│   ├── userDto.js
│   ├── taskDto.js
│   ├── itemDto.js
│   ├── productDto.js
│   ├── eventDto.js
│   ├── transactionDto.js
│   └── deliveryDto.js
├── errors/               # 🆕 Custom error classes
│   ├── AppError.js
│   ├── NotFoundError.js
│   ├── BadRequestError.js
│   ├── UnauthorizedError.js
│   ├── ForbiddenError.js
│   └── ConflictError.js
├── helpers/              # 🆕 Domain-specific reusable logic
│   ├── cacheHelper.js
│   ├── imageHelper.js
│   └── cookieHelper.js
│
│   # NOTE: asyncHandler.js is NOT needed — we use `express-async-errors` instead
├── middlewares/           # Existing + new validation & error middleware
│   ├── errorHandler.js   # 🆕 Global error-handling middleware
│   ├── validate.js       # 🆕 Generic DTO validation middleware
│   └── ...existing...
├── models/               # Existing (unchanged)
├── repositories/         # 🆕 Data-access layer (Sequelize queries)
│   ├── userRepository.js
│   ├── taskRepository.js
│   ├── itemRepository.js
│   ├── productRepository.js
│   ├── eventRepository.js
│   └── transactionRepository.js
├── routes/               # Existing (add validation middleware)
├── services/             # Existing — refactor to pure business logic
├── jobs/                 # 🆕 Centralized job architecture
│   ├── queues/           # Queue definitions
│   │   └── index.js
│   ├── workers/          # Worker processors
│   │   ├── purchaseWorker.js
│   │   └── orderSyncWorker.js
│   └── cron/             # Cron schedulers
│       └── syncGHNOrders.js
├── utils/                # Existing + new pure functions
│   ├── cache.js
│   ├── generateCode.js
│   ├── ability.js
│   └── stringUtils.js   # 🆕 (extracted from userService)
└── server.js
```

---

## 3. Pillar 1 — Clean Architecture & SOLID

### 3.1 Missing Repository Layer — Services directly call Sequelize

> **Violation:** Single Responsibility Principle (SRP). Services currently contain BOTH business logic AND raw Sequelize queries. This makes them untestable and tightly coupled to the ORM.

**Affected Files:** ALL 24 service files.

**Example — [userService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/userService.js#L170-L183)**

```javascript
// ❌ BEFORE: Service directly calls Sequelize
const getAllUsers = async () => {
  try {
    const users = await User.findAll({                    // DB query in service
      attributes: { exclude: ["password"] },
      include: [
        { model: Role, as: "roles", attributes: ["id", "name"] },
        { model: Coin, as: "coins", attributes: ["id", "amount"] },
      ],
    });
    return users;
  } catch (e) {
    throw e;
  }
};
```

```javascript
// ✅ AFTER: Repository handles DB, Service handles logic

// --- src/repositories/userRepository.js ---
const db = require("../models/index");
const { User, Role, Coin, Rank } = db;

// ⚠️ CRITICAL: All repository methods MUST accept an optional `options` param
// to support Sequelize transactions. Services orchestrate transactions,
// repositories just pass them through.
const findAll = async (options = {}) => {
  return User.findAll({
    attributes: { exclude: ["password"] },
    include: [
      { model: Role, as: "roles", attributes: ["id", "name"] },
      { model: Coin, as: "coins", attributes: ["id", "amount"] },
    ],
    ...options, // spreads { transaction: t } when provided
  });
};

const create = async (userData, options = {}) => {
  return User.create(userData, { transaction: options.transaction });
};

module.exports = { findAll, create };

// --- src/services/userService.js ---
const userRepo = require("../repositories/userRepository");

const getAllUsers = async () => {
  return userRepo.findAll();
};
```

---

### 3.2 Controllers doing too much (SRP violation in Login)

**File:** [userController.js L22-53](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/controllers/userController.js#L22-L53)

The `handleLoginUser` controller sets cookies, reads `process.env`, and calls `ms()` — all of which are infrastructure concerns that belong in a helper or the service layer.

```javascript
// ❌ BEFORE: Controller handles cookie logic, env vars, ms() conversion
const handleLoginUser = async (req, res) => {
  try {
    // ...
    res.cookie("access_token", result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(process.env.JWT_AT_EXPIRE),
      path: "/",
    });
    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ms(process.env.JWT_RF_EXPIRE),
    });
    return res.success("Login success", result);
  } catch (error) {
    return res.error(401, "Failed to login user", error.message);
  }
};
```

```javascript
// ✅ AFTER: Extract cookie logic into a helper

// --- src/helpers/cookieHelper.js ---
const ms = require("ms");

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

const setAuthCookies = (res, { access_token, refresh_token }) => {
  res.cookie("access_token", access_token, {
    ...COOKIE_BASE,
    maxAge: ms(process.env.JWT_AT_EXPIRE),
  });
  res.cookie("refresh_token", refresh_token, {
    ...COOKIE_BASE,
    maxAge: ms(process.env.JWT_RF_EXPIRE),
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("access_token", COOKIE_BASE);
  res.clearCookie("refresh_token", COOKIE_BASE);
};

module.exports = { setAuthCookies, clearAuthCookies };

// --- src/controllers/userController.js ---
const { setAuthCookies } = require("../helpers/cookieHelper");

const handleLoginUser = async (req, res) => {
  const { email, password } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"] || "unknown";
  const result = await userService.loginUser(req.user, email, password, clientIP, userAgent);
  setAuthCookies(res, result);
  return res.success("Login success", result);
};
```

---

### 3.3 `userService` violates SRP — contains Task, Item, and Transaction logic

**File:** [userService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/userService.js)

> The `userService` (655 lines) contains `getAllTasksById`, `getTaskCompleted`, and `getItemByIdUser`. These functions deal with Tasks, TaskUsers, Transactions, and Items — none of which are "User" domain concerns.

**Suggestion:** Move these functions to their respective services:
- `getAllTasksById` → `taskService.js`
- `getTaskCompleted` → `taskService.js`
- `getItemByIdUser` → `transactionService.js` or `itemService.js`

---

### 3.4 `rateLimit.js` middleware violates SRP — does User lookup + caching + rate limiting

**File:** [rateLimit.js L13-118](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/middlewares/rateLimit.js#L13-L118)

This single middleware:
1. Looks up the user from the database (L25)
2. Caches the user in Redis (L32-36) with a different key format than `cache.js`
3. Performs rate limiting (L49-115)

**Suggestion:** Split into two middlewares:
- `resolveUser.js` — find user, attach to `req.user`
- `rateLimit.js` — pure rate limiting logic only

---

## 4. Pillar 2 — Hard-coded Values, Constants & Enums

### 4.1 Magic Strings — Role Names

| File | Line | Magic String |
|---|---|---|
| [userService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/userService.js#L67) | 67 | `["user", "customer"]` |
| [userService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/userService.js#L461) | 461 | `role_id: 2` (hard-coded user role) |

```javascript
// ❌ BEFORE
if (!["user", "customer"].includes(roledata.name.toLowerCase())) { ... }
role_id: 2,  // magic number for "user" role

// ✅ AFTER — src/constants/roles.js
const ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  CUSTOMER: "customer",
});
const ASSIGNABLE_ROLES = [ROLES.USER, ROLES.CUSTOMER];
const DEFAULT_ROLE_ID = 2; // TODO: resolve by name instead of ID
module.exports = { ROLES, ASSIGNABLE_ROLES, DEFAULT_ROLE_ID };

// Usage:
const { ASSIGNABLE_ROLES } = require("../constants/roles");
if (!ASSIGNABLE_ROLES.includes(roledata.name.toLowerCase())) { ... }
```

### 4.2 Magic Strings — Task Difficulty & Status

| File | Lines | Magic Strings |
|---|---|---|
| [taskService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/taskService.js#L24) | 24, 104, 322 | `"easy"`, `"medium"`, `"hard"`, `"event"` |
| [taskService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/taskService.js#L43) | 43, 117, 383, 430 | `"public"`, `"private"` |
| [taskService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/taskService.js#L190) | 190, 279 | `"pending"`, `"approved"`, `"rejected"` |

```javascript
// ✅ AFTER — src/constants/taskStatus.js
const TASK_DIFFICULTY = Object.freeze({
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  EVENT: "event",
});
const TASK_VISIBILITY = Object.freeze({ PUBLIC: "public", PRIVATE: "private" });
const TASK_SUBMIT_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});
module.exports = { TASK_DIFFICULTY, TASK_VISIBILITY, TASK_SUBMIT_STATUS };
```

### 4.3 Magic Strings — Transaction Status

| File | Lines | Magic Strings |
|---|---|---|
| [transactionService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/transactionService.js#L37) | 37, 56, 147, 286-290, 399 | `"pending"`, `"cancelled"`, `"accepted"`, `"rejected"` |

```javascript
// ✅ AFTER — src/constants/transactionStatus.js
const TRANSACTION_STATUS = Object.freeze({
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
});
module.exports = { TRANSACTION_STATUS };
```

### 4.4 Magic Strings — Item Status

| File | Lines | Magic Strings |
|---|---|---|
| [itemService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/itemService.js#L350) | 350 | `"pending"` |
| [purchaseWorker.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/workers/purchaseWorker.js#L54) | 54, 98 | `"available"`, `"sold_out"` |
| [transactionService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/transactionService.js#L319) | 319, 443 | `"available"`, `"sold_out"` |

```javascript
// ✅ AFTER — src/constants/itemStatus.js
const ITEM_STATUS = Object.freeze({
  AVAILABLE: "available",
  SOLD_OUT: "sold_out",
  PENDING: "pending",
});
module.exports = { ITEM_STATUS };
```

### 4.5 Magic Strings — Event Status

| File | Lines | Magic Strings |
|---|---|---|
| [eventService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/eventService.js#L461) | 461 | `["upcoming", "ongoing", "finished"]` |

### 4.6 Magic Strings — Delivery Order Status

| File | Lines | Magic Strings |
|---|---|---|
| [syncGHNOrdersCron.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/cron/syncGHNOrdersCron.js#L7-L25) | 7-25 | 16 hard-coded GHN statuses |

```javascript
// ✅ AFTER — src/constants/deliveryStatus.js
const GHN_ACTIVE_STATUSES = Object.freeze([
  "ready_to_pick", "picking", "money_collect_picking", "picked",
  "storing", "transporting", "sorting", "delivering",
  "money_collect_delivering", "waiting_to_return", "return",
  "return_transporting", "return_sorting", "returning",
  "exception", "lost", "damage",
]);
module.exports = { GHN_ACTIVE_STATUSES };
```

### 4.7 Magic Numbers — Cache TTL, Salt Rounds, Redis Expiration

| File | Lines | Value | Meaning |
|---|---|---|---|
| [cache.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/utils/cache.js#L2) | 2 | `60 * 60` | 1 hour default TTL |
| [userService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/userService.js#L13) | 13 | `10` (bcrypt salt rounds) | Salt rounds |
| [rateLimit.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/middlewares/rateLimit.js#L32) | 32-36 | `60 * 60 * 24` | 24h Redis TTL |
| [transactionService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/transactionService.js#L65) | 65, 100, 144 | `3600` | 1 hour Redis TTL |
| [productService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/productService.js#L69) | 69, 73, 79 | `60 * 60` | Repeated TTL |
| [taskService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/taskService.js#L311) | 311, 332, 392 | `300` | 5 min cache TTL |
| [server.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/server.js#L72) | 72 | `"secret"` | Session secret |

```javascript
// ✅ AFTER — src/constants/cache.js (or extend config)
const CACHE_TTL = Object.freeze({
  DEFAULT: 60 * 60,       // 1 hour
  SHORT: 300,             // 5 minutes
  LONG: 60 * 60 * 24,    // 24 hours
});
const BCRYPT_SALT_ROUNDS = 10;
module.exports = { CACHE_TTL, BCRYPT_SALT_ROUNDS };
```

### 4.8 Magic Strings — Queue Names

| File | Lines | Magic String |
|---|---|---|
| [purchaseQueue.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/queues/purchaseQueue.js#L5) | 5 | `"purchase"` |
| [purchaseWorker.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/workers/purchaseWorker.js#L17) | 17 | `"purchase"` |
| [orderSyncQueue.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/queues/orderSyncQueue.js#L4) | 4 | `"orderSync"` |
| [orderSyncWorker.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/workers/orderSyncWorker.js#L9) | 9 | `"orderSync"` |

```javascript
// ✅ AFTER — src/constants/queueNames.js
const QUEUE_NAMES = Object.freeze({
  PURCHASE: "purchase",
  ORDER_SYNC: "orderSync",
});
module.exports = { QUEUE_NAMES };
```

### 4.9 Magic Strings trong Sequelize Models — DataTypes.ENUM

**Violation:** Hiện tại các Model đang định nghĩa các giá trị Enum trực tiếp bằng chuỗi cứng (ví dụ: `carrier`, `status`). Điều này gây khó khăn khi tái sử dụng logic trong Zod DTOs và Services, dẫn đến nguy cơ sai lệch dữ liệu nếu có sự thay đổi.

**Ví dụ:** DeliveryOrder Model

```javascript
// ❌ BEFORE — src/models/deliveryOrder.js
carrier: {
  type: DataTypes.ENUM("ghn", "ghtk", "grab"),
  allowNull: false,
  defaultValue: "ghn",
}
```

```javascript
// ✅ AFTER — Trích xuất thành Constant dùng chung cho cả Model và DTO

// --- src/constants/carriers.js ---
const CARRIER_TYPES = Object.freeze({
  GHN: "ghn",
  GHTK: "ghtk",
  GRAB: "grab",
});
module.exports = { CARRIER_TYPES };

// --- src/models/deliveryOrder.js ---
const { CARRIER_TYPES } = require("../constants/carriers");

carrier: {
  // Rải object values thành array cho Sequelize
  type: DataTypes.ENUM(...Object.values(CARRIER_TYPES)),
  allowNull: false,
  defaultValue: CARRIER_TYPES.GHN,
}

// --- Tái sử dụng trong src/dtos/deliveryDto.js ---
const { z } = require("zod");
const { CARRIER_TYPES } = require("../constants/carriers");

const createDeliveryDto = z.object({
  carrier: z.enum(Object.values(CARRIER_TYPES)),
});
```

---

## 5. Pillar 3 — DRY Violations & Duplicated Logic

### 5.1 Duplicated Cookie Config (3 places)

**Files:** [userController.js L36-49, L61-67, L79-90](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/controllers/userController.js#L36-L90)

The exact same cookie options object is repeated 5 times across `handleLoginUser`, `handleRefreshAccessToken`, and `handleLogoutUser`.

**Fix:** Extract to `helpers/cookieHelper.js` (shown in section 3.2).

---

### 5.2 Duplicated Cache Pattern — `getCache → if miss → DB query → setCache`

This exact pattern is repeated in **every service file** (20+ instances):

```javascript
// This pattern appears 20+ times across the codebase
let data = await getCache(cacheKey);
if (!data) {
  data = await Model.findByPk(id);
  if (!data) throw new Error("Not found");
  await setCache(cacheKey, data);
}
return data;
```

**Fix:** Extract into `helpers/cacheHelper.js`:

```javascript
// ✅ AFTER — src/helpers/cacheHelper.js
const { getCache, setCache } = require("../utils/cache");

const cacheThrough = async (key, fetchFn, ttl) => {
  const cached = await getCache(key);
  if (cached) return cached;
  const fresh = await fetchFn();
  if (fresh) await setCache(key, fresh, ttl);
  return fresh;
};

module.exports = { cacheThrough };

// Usage in any service:
const task = await cacheThrough(`task:id:${id}`, () => Task.findByPk(id));
```

---

### 5.3 Duplicated Image Cleanup Logic (3 services)

The following block is copy-pasted in [itemService.js L222-235](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/itemService.js#L222-L235), [itemService.js L369-382](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/itemService.js#L369-L382), [productService.js L314-328](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/productService.js#L314-L328), [productService.js L388-401](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/productService.js#L388-L401):

```javascript
// ❌ BEFORE — repeated 4 times
const existingImages = await Image.findAll({
  where: { reference_id: id, reference_type: "item" },
});
for (const image of existingImages) {
  if (image.url) {
    const publicId = image.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`images/${publicId}`);
  }
  await image.destroy();
}
```

**Fix:** This is already partially handled in `imageService.deleteImages()` for events — extend it for items and products too:

```javascript
// ✅ AFTER — src/helpers/imageHelper.js
const Image = require("../models").Image;
const cloudinary = require("cloudinary").v2;

const destroyImagesByReference = async (referenceId, referenceType) => {
  const images = await Image.findAll({
    where: { reference_id: referenceId, reference_type: referenceType },
  });
  for (const image of images) {
    if (image.url) {
      const publicId = image.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`images/${publicId}`);
    }
    await image.destroy();
  }
  return images;
};

module.exports = { destroyImagesByReference };
```

---

### 5.4 Duplicated `deleteUser` / `deleteUserByPublicID` logic

**File:** [userService.js L185-230](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/userService.js#L185-L230)

Both functions have nearly identical logic (destroy rank, coin, user, clear cache). Only the lookup differs (by `id` vs `public_id`).

```javascript
// ✅ AFTER — consolidate into one internal function
const _deleteUserInternal = async (user) => {
  await deleteCache(`user:id:${user.id}`);
  await deleteCache(`user:public_id:${user.public_id}`);
  await Rank.destroy({ where: { id: user.rank_id } });
  await Coin.destroy({ where: { id: user.coins_id } });
  await User.destroy({ where: { id: user.id } });
  return { message: "User deleted successfully" };
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError("User not found");
  return _deleteUserInternal(user);
};

const deleteUserByPublicID = async (public_id) => {
  const user = await User.findOne({ where: { public_id } });
  if (!user) throw new NotFoundError("User not found");
  return _deleteUserInternal(user);
};
```

---

### 5.5 Duplicated `getTransactionByBuyerId` / `getTransactionBySellerId`

**File:** [transactionService.js L74-232](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/transactionService.js#L74-L232)

These two functions are ~80 lines each and **nearly identical**. The only difference is the filter field (`buyer_id` vs `seller_id`) and the cache key prefix.

```javascript
// ✅ AFTER — parameterize the filter
const getTransactionsByRole = async (userId, role) => {
  const cachePrefix = role; // "buyer" or "seller"
  const filterField = `${role}_id`;
  const cacheKey = `${cachePrefix}:transaction:id:${userId}`;
  // ... single implementation ...
};

const getTransactionByBuyerId = (id) => getTransactionsByRole(id, "buyer");
const getTransactionBySellerId = (id) => getTransactionsByRole(id, "seller");
```

---

### 5.6 Duplicated Item Update Logic — `updateItem` / `updateItemByPublicId`

**File:** [itemService.js L169-401](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/itemService.js#L169-L401)

The `updateItemByPublicId` function (60 lines) is a near-complete copy of `updateItem` — including the ternary assignment pattern:

```javascript
// ❌ Anti-pattern repeated in both functions (L191-199 and L349-354)
name ? (item.name = name) : (item.name = item.name);  // no-op assignment
```

**Fix:** Both `updateItem` and `updateItemByPublicId` should share a single `_applyItemUpdates(item, data)` helper.

---

### 5.7 `removeSpecialChars` lives in userService — should be a util

**File:** [userService.js L28-33](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/userService.js#L28-L33)

```javascript
// ✅ Move to src/utils/stringUtils.js
const removeSpecialChars = (str) => {
  return str.replace(/[^a-zA-Z0-9\u00C0-\u1EF9\s]/g, " ").trim().replace(/\s+/g, " ");
};
module.exports = { removeSpecialChars };
```

---

## 6. Pillar 4 — DTOs & Validation Layer

### 6.1 Current Problem

**Every controller** accepts raw `req.body` with zero validation at the middleware level. Validation happens inside services with scattered `if (!field)` checks, meaning:

1. Invalid data reaches the service layer before being rejected.
2. Validation logic is mixed with business logic (SRP violation).
3. Error messages are inconsistent.

**Examples of inline validation that should be DTOs:**

| File | Lines | Manual Check |
|---|---|---|
| [taskService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/taskService.js#L18-L33) | 18-33 | `if (!user_id \|\| !title \|\| ...` |
| [itemService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/itemService.js#L34-L48) | 34-48 | `if (!name \|\| !price \|\| ...` |
| [productService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/productService.js#L13-L31) | 13-31 | `if (!productData.name \|\| ...` |
| [eventService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/eventService.js#L294-L315) | 294-315 | `if (!title \|\| !description \|\| ...` |
| [transactionService.js](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/services/transactionService.js#L20-L30) | 20-30 | `if (!name \|\| !buyer_id \|\| ...` |

### 6.2 Proposed Solution — Zod + Validation Middleware

```javascript
// --- src/dtos/taskDto.js ---
const { z } = require("zod");
const { TASK_DIFFICULTY, TASK_VISIBILITY } = require("../constants/taskStatus");

const createTaskDto = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  description: z.string().min(1, "Description is required"),
  coins: z.number().int().min(0, "Coins must be non-negative"),
  difficulty: z.enum(Object.values(TASK_DIFFICULTY)),
  total: z.number().int().min(1, "Total must be positive"),
});

const updateTaskDto = createTaskDto.partial().extend({
  status: z.enum(Object.values(TASK_VISIBILITY)).optional(),
});

module.exports = { createTaskDto, updateTaskDto };
```

```javascript
// --- src/middlewares/validate.js ---
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    return res.error(400, "Validation failed", errors);
  }
  req.validated = result.data;
  next();
};

module.exports = validate;
```

```javascript
// --- Usage in routes/taskRoutes.js ---
const validate = require("../middlewares/validate");
const { createTaskDto } = require("../dtos/taskDto");

router.post("/", validate(createTaskDto), taskController.handleCreateTask);
```

---

## 7. Pillar 5 — Error Handling & Standard Responses

### 7.1 Custom Error Classes

Currently, all errors are generic `new Error("message")`. There's no way to distinguish a 404 from a 400 from a 500 in the controller — everything is caught and returns `500`.

```javascript
// ✅ AFTER — src/errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;

// --- src/errors/NotFoundError.js ---
const AppError = require("./AppError");
class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}
module.exports = NotFoundError;

// --- src/errors/BadRequestError.js ---
const AppError = require("./AppError");
class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}
module.exports = BadRequestError;
```

### 7.2 Global Error-Handling Middleware

This eliminates the need for `try/catch` in every single controller.

```javascript
// --- src/middlewares/errorHandler.js ---
const AppError = require("../errors/AppError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.error(err.statusCode, err.message);
  }

  console.error("Unhandled Error:", err);
  return res.error(500, "Internal server error");
};

module.exports = errorHandler;
```

```javascript
// Register in server.js — AFTER all routes
initWebRoutes(app);
app.use(errorHandler); // 🆕 Must be LAST middleware
```

### 7.3 Eliminate try/catch boilerplate — `express-async-errors`

Instead of wrapping every controller with a manual `asyncHandler()`, we use the [`express-async-errors`](https://www.npmjs.com/package/express-async-errors) library. A single `require` in `server.js` makes Express automatically catch all async rejections and forward them to the global error handler.

```bash
npm install express-async-errors
```

```javascript
// --- src/server.js (add at the VERY TOP, before any other import) ---
require("express-async-errors");
```

```javascript
// ❌ BEFORE — every controller looks like this (19 files × ~10 functions each)
const handleGetAllTasks = async (req, res) => {
  try {
    let result = await taskService.getAllTasks();
    return res.success("Get list of tasks success", result);
  } catch (error) {
    return res.error(500, "Failed to fetch list of tasks", error.message);
  }
};

// ✅ AFTER — clean, zero-boilerplate. No wrapper needed!
const handleGetAllTasks = async (req, res) => {
  const result = await taskService.getAllTasks();
  return res.success("Get list of tasks success", result);
};
// Any thrown error (including from services) is automatically caught
// and forwarded to the global errorHandler middleware.
```

> [!TIP]
> This approach is cleaner than `asyncHandler()` because controllers remain plain async functions with zero boilerplate. The library patches Express's Layer#handle internally.

### 7.4 Inconsistent Response Format in `deliveryOrderController`

**File:** [deliveryOrderController.js L29-73](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/controllers/deliveryOrderController.js#L29-L73)

Three handlers bypass the `res.success/res.error` formatter and use raw `res.json()` / `res.status().json()`:

```javascript
// ❌ Lines 33, 52, 71 — bypasses standardized response
res.json(data);
res.status(500).json({ message: error.message || "Internal Server Error" });
```

### 7.5 `checkPermission.js` bypasses `res.success/res.error`

**File:** [checkPermission.js L7-29](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/middlewares/checkPermission.js#L7-L29)

Uses raw `res.status(401).json(...)` instead of `res.error(401, ...)`.

### 7.6 `rateLimit.js` bypasses `res.success/res.error`

**File:** [rateLimit.js L62-98](file:///d:/CODE%20PLAYGROUND/Projects/Fullstack/TECHSOLVE_2025/BACKEND/src/middlewares/rateLimit.js#L62-L98)

All 429 responses use raw `res.status(429).json(...)` with a different response shape than the standard formatter.

---

## 8. Pillar 6 — Background Jobs & Cron

### 8.1 Current State & Refactoring Direction

- Queues: `src/queues/purchaseQueue.js`, `src/queues/orderSyncQueue.js`
- Workers: `src/workers/purchaseWorker.js`, `src/workers/orderSyncWorker.js`
- Cron: `src/cron/syncGHNOrdersCron.js`

**Refactoring Direction:**
1. Chỉ tập trung vào `bullmq` và `redis`.
2. Gỡ bỏ hoàn toàn bảng điều khiển UI (Bull Board) để tinh gọn server, giảm bề mặt tấn công (attack surface) và bớt dependency thừa.
3. Đồng bộ hóa việc nhập kết nối Redis và loại bỏ chuỗi cứng trùng lặp tên Queue.

### 8.2 Proposed Centralized Architecture

```javascript
// --- src/jobs/queues/index.js ---
const { Queue } = require("bullmq");
const { redis } = require("../../config/configRedis");
const { QUEUE_NAMES } = require("../../constants/queueNames");

const createQueue = (name) => new Queue(name, { connection: redis });

const queues = {
  purchase: createQueue(QUEUE_NAMES.PURCHASE),
  orderSync: createQueue(QUEUE_NAMES.ORDER_SYNC),
};

module.exports = queues;
```

```javascript
// --- src/jobs/workers/purchaseWorker.js ---
const { Worker } = require("bullmq");
const { redis } = require("../../config/configRedis");
const { QUEUE_NAMES } = require("../../constants/queueNames");

const worker = new Worker(
  QUEUE_NAMES.PURCHASE,
  async (job) => { /* ... processor logic ... */ },
  { connection: redis }
);
module.exports = worker;
```

---

## 9. Phased Execution Roadmap

> [!IMPORTANT]
> Each phase should be a separate PR to minimize risk and enable incremental review.

### Phase -1 — 🚨 Hotfix: Critical Runtime Bugs
> These are **fatal bugs** that crash the app, NOT technical debt. Fix immediately.

- [x] Fix `findOrCreateUser` in `userService.js` L480 — `roledata` is undefined (ReferenceError on Google OAuth signup)
- [x] Fix `handleSubmitTask` in `taskController.js` L66 — reassigning `const description` (TypeError)
- [x] Standardize cache key format in `rateLimit.js` — change `user:${id}` → `user:id:${id}` to prevent Data Ghosting

### Phase 0 — Foundation (No logic changes)
- [x] Install `express-async-errors` (`npm install express-async-errors`)
- [x] Create `src/constants/` directory with all enum/constant files
- [x] Create `src/errors/` directory with `AppError`, `NotFoundError`, `BadRequestError`, etc.
- [x] Create `src/helpers/cookieHelper.js`
- [x] Create `src/helpers/cacheHelper.js`
- [x] Create `src/helpers/imageHelper.js`
- [x] Create `src/utils/stringUtils.js`
- [x] Create `src/middlewares/errorHandler.js`
- [x] Create `src/middlewares/validate.js`

### Phase 0.2 — Clean up Dependencies (Gỡ bỏ Bull Board)
- [x] Chạy lệnh gỡ bỏ các thư viện Bull Board:
  ```bash
  npm uninstall @bull-board/api @bull-board/express @bull-board/ui
  ```
- [x] Xóa file `src/services/bullboard.js` (nếu còn)
- [x] Xóa route `/api/admin/queues` gắn với Bull Board trong file `server.js` hoặc `routes/index.js`

### Phase 1 — Error Handling & Response Standardization
- [x] Add `require("express-async-errors")` at top of `server.js`
- [x] Register `errorHandler` as last middleware in `server.js`
- [x] Remove ALL `try/catch` blocks from controllers (express-async-errors handles them)
- [x] Replace `new Error()` with custom error classes in all services
- [x] Fix `deliveryOrderController.js`, `checkPermission.js`, `rateLimit.js` to use `res.success/res.error`

### Phase 2 — Constants & Enums
- [x] Replace all magic strings in services with constants
- [x] Replace all magic numbers (TTL, salt, etc.) with named constants
- [x] Replace queue name strings with `QUEUE_NAMES`
- [x] Quét toàn bộ thư mục `src/models/`, tìm các field có type là `DataTypes.ENUM`
- [x] Tạo file Enum tương ứng trong `src/constants/` (vd: carriers.js, taskVisibility.js)
- [x] Thay thế mảng string cứng trong Model bằng cú pháp `...Object.values(CONSTANT_NAME)`

### Phase 3 — DRY Refactoring
- [x] Extract cookie helper and use in `userController.js`
- [x] Extract `cacheThrough` helper and apply across all services
- [x] Extract `destroyImagesByReference` and apply in item/product/event services
- [x] Consolidate `deleteUser`/`deleteUserByPublicID`
- [x] Consolidate `getTransactionByBuyerId`/`getTransactionBySellerId`
- [x] Consolidate `updateItem`/`updateItemByPublicId`
- [x] Move `removeSpecialChars` to `utils/stringUtils.js`
- [x] Move task/item functions out of `userService.js`

### Phase 4 — DTO & Validation Layer
- [x] Install Zod (`npm install zod`)
- [x] Create DTO schemas for all entities
- [x] Export Zod-inferred types via JSDoc `@typedef {z.infer<typeof schema>}` for IDE autocompletion
- [x] Add `validate()` middleware to all POST/PUT/PATCH routes
- [x] Remove inline validation from services (move DTOs)

### Phase 5 — Repository Layer
- [ ] Create `src/repositories/` for each entity
- [ ] **All repository methods MUST accept `options = {}` param** to support `{ transaction: t }` passthrough
- [ ] Move all Sequelize `findAll`, `findByPk`, `create`, `update`, `destroy` calls from services to repositories
- [ ] Services only call repositories (no direct `Model.findXxx`)
- [ ] Verify all existing `sequelize.transaction()` flows still work correctly

### Phase 6 — Background Jobs Consolidation
- [ ] Move queues, workers, cron under `src/jobs/`
- [ ] Create centralized queue factory
- [ ] Move `bullboard.js` from `services/` to `config/` or `jobs/`

### Phase 7 — Testing (Deferred)
- [ ] Add Jest + Supertest as dev dependencies
- [ ] Write integration tests for critical API flows (Login, Create Order, Purchase)
- [ ] Write unit tests for services and helpers
- [ ] Set up CI pipeline to run tests on PR

---

## 10. Verification Plan

### Automated Tests
```bash
# After each phase, verify the server starts correctly
npm start

# Run existing seed scripts
npm run seed
```

### Manual Verification
- [ ] Test login/logout/refresh flow (cookie handling)
- [ ] Test CRUD operations for users, tasks, items, products, events, transactions
- [ ] Test purchase queue flow (BullMQ)
- [ ] Test delivery order creation (GHN integration)
- [ ] Verify Bull Board dashboard at `/api/admin/queues`
- [ ] Verify Redis caching still works (check hit/miss logs)

## 11. Resolved Open Questions

### Q1: Test Framework — ✅ Deferred to Phase 7
Testing will be a separate effort after the refactor stabilizes. However, before starting Phase 1, a minimal set of integration tests (Postman collection or Jest+Supertest for Login, Create Order, Purchase) will serve as a safety net.

### Q2: Cache Key Format — ✅ Standardize to `user:id:${id}`
The canonical format is `user:id:${id}` (as used by `cache.js`). The `rateLimit.js` middleware will be fixed in **Phase -1** to use `cacheHelper.js` functions and the standard key format. This prevents the "Data Ghosting" bug where stale data persists under the old key.

### Q3: `findOrCreateUser` undefined `roledata` — ✅ Fix in Phase -1 (Hotfix)
This is a fatal `ReferenceError`. Will fetch the default role using `Role.findByPk(DEFAULT_ROLE_ID)` or equivalent.

### Q4: `const description` reassignment — ✅ Fix in Phase -1 (Hotfix)
Change `const description` to `let description` in `taskController.js` L65.

### Additional Decisions (from user feedback)
- **Repository `transaction` support:** All repository methods will accept `options = {}` to pass through `{ transaction: t }`. Services orchestrate transactions.
- **`express-async-errors` over `asyncHandler`:** Use `require("express-async-errors")` in `server.js` instead of wrapping every controller.
- **Zod type inference:** Export `@typedef {z.infer<typeof schema>}` via JSDoc for IDE autocompletion.
