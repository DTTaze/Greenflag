---
trigger: always_on
---

# 🤖 NestJS Backend — AGENT INSTRUCTIONS (Domain-Agnostic Template)
# Reusable technical ruleset for any NestJS + TypeORM + PostgreSQL project.
# All rules are binding. Adapt `modules/` and `configs/` to your domain.

---

## 1. 🎭 ĐỊNH DẠNG VAI TRÒ

- **Vai trò:** Bạn là Senior Backend Developer chịu trách nhiệm bảo trì và mở rộng hệ thống backend này. Mọi code sinh ra phải đồng nhất 100% với kiến trúc hiện hành.
- **Tư duy:** Luôn suy nghĩ về Type-Safety, Performance, và Clean Code. Bắt buộc kiểm tra kỹ cấu trúc thư mục hiện hành trước khi tạo thêm file mới.
- **Ngôn ngữ:** Code, variable, class names bằng English. Comments/mô tả có thể theo ngôn ngữ team quy ước.

---

## 2. 🏛️ BẢN ĐỒ KIẾN TRÚC & TECH STACK

### Ngôn ngữ & Framework
- **Runtime:** Node.js + TypeScript 5.7+ (target ES2021, CommonJS)
- **Framework:** NestJS 11 (Express adapter — `NestExpressApplication`)
- **Build Tool:** SWC (`@swc/core` + `@swc/cli`)

### Database & ORM
- **Primary DB:** PostgreSQL 17
- **ORM:** TypeORM 0.3+ (`@nestjs/typeorm`) — Repository pattern
- **Cache:** Redis (via `mvc-common-toolkit` → `RedisService`)
- **Sync:** `synchronize: true` cho dev. Production nên dùng migration.

### Tích hợp bên ngoài (tuỳ dự án)
- **Object Storage:** Cloudinary (images), Cloudflare R2 (`@aws-sdk/client-s3`)
- **Email:** Nodemailer (SMTP) với HTML templates từ `templates/`
- **API Documentation:** Swagger UI tại `/docs` (`@nestjs/swagger`)

### DevOps
- **Container:** Docker Compose
- **Linting:** ESLint 9 + Prettier 3 (import sorting via `@trivago/prettier-plugin-sort-imports`)
- **Testing:** Jest 29 + Supertest

### Kiến trúc Thư mục

```text
src/
├── main.ts                    # Entry point: bootstrap NestFactory
├── setup.ts                   # Global pipes, filters, interceptors, CORS, Swagger, versioning
├── app.module.ts              # Root module — imports tất cả feature modules
├── configs/                   # Typed config files (registerAs pattern)
│   ├── index.ts               # Export array tất cả configs
│   ├── app.config.ts          # PORT, NODE_ENV, CORS, SWAGGER flags
│   ├── database.config.ts     # DB connection (class-validator validated)
│   ├── redis.config.ts        # Redis host/port/password
│   ├── jwt.config.ts          # JWT secret + expiration
│   └── <service>.config.ts    # Thêm config cho từng external service
├── modules/                   # Feature modules (domain-driven)
│   ├── auth/                  # Authentication & Authorization flows
│   ├── user/                  # User management & profiles
│   ├── global/                # GlobalModule: Redis, JWT, HttpService, AuditService providers
│   ├── health/                # Health check endpoint
│   └── <feature>/             # Các module nghiệp vụ theo domain
└── shared/                    # Cross-cutting concerns
    ├── common/
    │   ├── audit.entity.ts    # AuditWithTimezone: createdAt, updatedAt, deletedAt (soft delete)
    │   ├── base.dto.ts        # BaseDTO: filter builder pattern
    │   ├── pagination.dto.ts  # PaginationDTO, PaginatedByKeywordDTO, PaginatedDateTimeDTO
    │   └── response.dto.ts    # SuccessResponseDTO<T>, ErrorResponseDTO (Swagger schemas)
    ├── cache-key.ts           # Cache key factory functions
    ├── constants.ts           # INJECTION_TOKEN, ERR_CODE, APP_ACTION, ENV_KEY, CACHE_TTL
    ├── enums.ts               # ROLE, ENTITY_STATUS, CONFIG_KEY, METADATA_KEY, ...
    ├── interfaces.ts          # UserAuthProfile, AppRequest, RunnerUser, ...
    ├── decorators/
    │   ├── api-response.decorator.ts    # @ApiOperationSuccess<T>(), @ApiOperationError()
    │   ├── logging.decorator.ts         # @LogId() — extract/generate X-Log-ID header
    │   ├── request-user.decorator.ts    # @RequestUser() — extract user from request
    │   ├── roles.decorator.ts           # @Roles(ROLE.ADMIN) — metadata for RolesGuard
    │   └── sanitize-input.decorator.ts  # @SanitizeInput(), @OnlyTextAndNumbers(), @TrimAndLowercase()
    ├── filters/
    │   └── all-exceptions.filter.ts     # Global catch-all → JSON { success, code, message }
    ├── guards/
    │   ├── auth.guard.ts                # JWT Bearer → verify → load User entity from DB
    │   ├── optional-auth.guard.ts       # Same but doesn't throw if no token
    │   └── roles.guard.ts               # RBAC via @Roles decorator
    ├── helpers/
    │   ├── operation-result.helper.ts   # Factory: generateSuccessResult, generateNotFoundResult, ...
    │   ├── query.helper.ts              # parseSort("-createdAt" → { createdAt: "DESC" })
    │   └── validate-config.helper.ts    # Runtime config validation via class-validator
    ├── interceptors/
    │   ├── call-queue.interceptor.ts            # Concurrency control per user
    │   ├── http-logging.interceptor.ts          # Request/Response logging with timing
    │   ├── http-response.interceptor.ts         # Auto-wrap: { data, success: true }
    │   ├── rate-limiting.interceptor.ts          # Redis-backed rate limiting
    │   ├── user-api-call.interceptor.ts          # Track user API call context
    │   └── user-failed-attempts-ban.interceptor.ts  # Auto-ban after N failed attempts
    ├── services/
    │   ├── base-crud.service.ts          # Abstract BaseCRUDService<T> — CRUD + pagination
    │   └── outbound-partner.service.ts   # Abstract HTTP client for external API calls
    └── utils/
        ├── hash.util.ts                 # Password hashing utilities
        └── ...                          # Thêm utility theo nhu cầu
```

### Path Aliases (tsconfig.json)
```json
{
  "@configs/*": ["./src/configs/*"],
  "@modules/*": ["./src/modules/*"],
  "@shared/*":  ["./src/shared/*"]
}
```

---

## 3. 🛡️ QUY TẮC CỐT LÕI (CORE CONVENTIONS)

### 3.1 Chuẩn Đặt Tên (Naming Standard)

| Đối tượng          | Quy tắc                              | Ví dụ                                                  |
|---------------------|---------------------------------------|----------------------------------------------------------|
| **Thư mục module**  | kebab-case                            | `user-profile/`, `order-management/`, `system-config/`   |
| **File**            | kebab-case + hậu tố chức năng         | `user.controller.ts`, `user.service.ts`, `user.entity.ts`, `user.dto.ts`, `user.module.ts` |
| **Entity Class**    | PascalCase, extends AuditWithTimezone | `User`, `OrderItem`, `Category`                          |
| **Service Class**   | PascalCase + `Service` suffix         | `UserService extends BaseCRUDService<User>`              |
| **Controller**      | PascalCase + `Controller` suffix      | `UserController`, `AuthController`                       |
| **DTO Class**       | PascalCase + `DTO` suffix             | `CreateUserDTO`, `UpdateOrderDTO`, `PaginatedByKeywordDTO` |
| **Module Class**    | PascalCase + `Module` suffix          | `UserModule`, `GlobalModule`                             |
| **Enum**            | SCREAMING_SNAKE_CASE                  | `ROLE`, `ENTITY_STATUS`, `ORDER_STATUS`                  |
| **Enum Value**      | SCREAMING_SNAKE_CASE                  | `ROLE.ADMIN`, `ENTITY_STATUS.ACTIVE`                     |
| **Constant Object** | SCREAMING_SNAKE_CASE                  | `INJECTION_TOKEN`, `ERR_CODE`, `ENV_KEY`, `CACHE_TTL`    |
| **DB Column name**  | snake_case (via `{ name: '...' }`)    | `first_name`, `image_url`, `created_at`                  |
| **TS Property**     | camelCase                             | `firstName`, `imageUrl`, `createdAt`                     |
| **Config Key**      | CONFIG_KEY enum value                 | `CONFIG_KEY.DATABASE`, `CONFIG_KEY.JWT`                   |
| **Cache Key**       | Function factory                      | `rateLimitCacheKey(method, endpoint, ip)`                |

### 3.2 Luồng Dữ Liệu (Data Pipeline)

```
Client Request
  → [CORS] → [Global Prefix: /api] → [URI Versioning: /v1]
  → [ValidationPipe: transform + whitelist + forbidNonWhitelisted]
  → [Interceptors: HttpLogging → HttpResponse]
  → [Guard: AuthGuard (JWT Bearer → User lookup)]
  → [Guard: RolesGuard (RBAC check)]
  → [Custom Interceptors: @UseCallQueue, @ApplyRateLimiting, @UseMaxAttempts]
  → Controller method
    → @RequestUser() decorator → extracts `activeUser` from request
    → @LogId() decorator → extracts/generates X-Log-ID
    → @Body() dto (auto-validated by ValidationPipe)
  → Service method (extends BaseCRUDService<T>)
    → Repository (TypeORM) → PostgreSQL
  → Return OperationResult { success, data, message, httpCode, code }
  → [HttpResponseInterceptor wraps: { data, success: true }]
  → [AllExceptionsFilter catches errors: { success: false, code, message }]
```

### 3.3 Response Format Chuẩn

**Success Response** (auto-wrapped by `HttpResponseInterceptor`):
```json
{
  "success": true,
  "data": { "id": "uuid-xxx", "name": "..." }
}
```

**Paginated Success Response**:
```json
{
  "success": true,
  "data": {
    "rows": [...],
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

**Error Response** (từ `AllExceptionsFilter` hoặc `operation-result.helper`):
```json
{
  "success": false,
  "code": "not_found",
  "message": "Resource with id xxx not found"
}
```

**Lưu ý quan trọng:**
- Error code luôn là **lowercase** (xem `ERR_CODE` trong constants: `.toLowerCase()`)
- Service methods trả về `OperationResult` hoặc `HttpResponse` từ `mvc-common-toolkit`
- Sử dụng helper functions: `generateSuccessResult()`, `generateNotFoundResult()`, `generateBadRequestResult()`, `generateForbiddenResult()`, v.v.
- **KHÔNG** throw `HttpException` trực tiếp trong Service layer (trừ validation). Thay vào đó, return `OperationResult` với `success: false`.

### 3.4 Entity Pattern

Mọi entity **phải** kế thừa `AuditWithTimezone`:
```typescript
@Entity('table_name')
export class MyEntity extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName: string;

  @Column({ type: 'varchar', default: ENTITY_STATUS.ACTIVE })
  status: ENTITY_STATUS;
}
```

`AuditWithTimezone` tự động cung cấp:
- `createdAt` (`timestamp with time zone`, auto-set, indexed)
- `updatedAt` (`timestamp with time zone`, auto-update)
- `deletedAt` (`timestamp with time zone`, `select: false`) — **Soft Delete**

### 3.5 Service Pattern

Mọi service **nên** kế thừa `BaseCRUDService<T>`:
```typescript
@Injectable()
export class MyService extends BaseCRUDService<MyEntity> {
  private readonly logger = new Logger(MyService.name);

  constructor(
    @InjectRepository(MyEntity) repo: Repository<MyEntity>,
  ) {
    super(repo);
  }

  async findActiveById(id: string): Promise<HttpResponse<MyEntity>> {
    const entity = await this.findByID(id);
    if (!entity) return generateNotFoundResult(`Resource ${id} not found`);
    return generateSuccessResult(entity);
  }
}
```

`BaseCRUDService` cung cấp sẵn:
- `create()`, `findByID()`, `findOne()`, `findAll()`, `updateByID()`, `deleteByID()` (soft), `hardDeleteByID()`
- `paginate(dto)`, `paginateByKeyword(dto, columns, keyword)`
- `bulkCreate()`, `bulkUpdate()`, `bulkUpdateByIDs()`
- Transaction support: `createWithOpts()`, `updateByIdWithOpts()`, `deleteByIdWithOpts()` (nhận `RunnerUser { alias, runner: QueryRunner }`)
- Default sort: `-createdAt` (mới nhất trước)

### 3.6 DTO & Validation Pattern

- Sử dụng **class-validator** decorators: `@IsNotEmpty()`, `@IsString()`, `@IsUUID()`, `@Length()`, `@IsOptional()`, `@Min()`
- Sử dụng **class-transformer**: `@Transform()` cho sanitization
- Swagger documentation: `@ApiProperty()`, `@ApiPropertyOptional()`, `@ApiOperation()`
- Custom decorators: `@SanitizeInput()`, `@OnlyTextAndNumbers()`, `@TrimAndLowercase()`
- Pagination DTOs kế thừa từ `BaseDTO` → `PaginationDTO` → `PaginatedByKeywordDTO` / `PaginatedDateTimeDTO`

**Ví dụ DTO mẫu:**
```typescript
export class CreateItemDTO {
  @ApiProperty({ example: 'Item name' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  @SanitizeInput()
  name: string;

  @ApiPropertyOptional({ example: 'Description text' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class FindOneParamDTO {
  @ApiProperty({ description: 'The UUID of the resource' })
  @IsUUID()
  id: string;
}
```

### 3.7 Module Registration Pattern

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([MyEntity]), ...otherModules],
  controllers: [MyController],
  providers: [MyService],
  exports: [MyService],
})
export class MyModule {}
```

- Đăng ký entity qua `TypeOrmModule.forFeature([...])`
- Module cần được import vào `AppModule` (hoặc đánh dấu `@Global()` nếu dùng cross-module)
- Các shared module (User, Auth) nên đánh `@Global()` nếu nhiều module khác phụ thuộc

### 3.8 Config Pattern

Sử dụng `registerAs` + class-validator validation:
```typescript
class DatabaseConfig {
  @IsString()
  host: string;

  @IsNumber()
  port: number;
}

export default registerAs(CONFIG_KEY.DATABASE, () => {
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
  };
  validateConfig(config, DatabaseConfig);
  return config;
});
```

### 3.9 Dependency Injection Pattern

Sử dụng `Symbol`-based injection tokens cho các provider thuộc `GlobalModule`:
```typescript
export const INJECTION_TOKEN = {
  AUDIT_SERVICE: Symbol.for('AUDIT_SERVICE'),
  HTTP_SERVICE: Symbol.for('HTTP_SERVICE'),
  REDIS_SERVICE: Symbol.for('REDIS_SERVICE'),
  SYNC_TASK_QUEUE: Symbol.for('SYNC_TASK_QUEUE'),
  MAIL_TRANSPORTER: Symbol.for('MAIL_TRANSPORTER'),
};
```

Inject: `@Inject(INJECTION_TOKEN.REDIS_SERVICE) private cacheService: CacheService`

### 3.10 Import Order (Prettier Enforced)

Thứ tự import bắt buộc (auto-sorted bởi `@trivago/prettier-plugin-sort-imports`):
1. `./tracing` (nếu có)
2. Third-party modules (`mvc-common-toolkit`, `typeorm`, `express`, `dayjs`, ...)
3. `@nestjs/*`
4. `@configs/*`
5. `@modules/*`
6. `@shared/*`
7. Relative imports (`./`, `../`)

Mỗi nhóm cách nhau một dòng trống.

---

## 4. 🔄 QUY TRÌNH PHÁT TRIỂN (WORKFLOWS)

### 📌 Xây dựng API Endpoint mới

**Bước 1 — Data Layer (Entity):**
1. Tạo file `<name>.entity.ts` trong `modules/<module-name>/entities/` (hoặc cùng cấp nếu module đơn giản)
2. Entity extends `AuditWithTimezone`, dùng `@PrimaryGeneratedColumn('uuid')`
3. Map column names sang snake_case: `@Column({ name: 'my_column' })`
4. Định nghĩa Relations: `@OneToMany`, `@ManyToOne`, `@OneToOne` với explicit foreign key

**Bước 2 — Transfer Layer (DTO):**
1. Tạo file `<module>.dto.ts` (hoặc thư mục `dto/` nếu có nhiều DTOs)
2. Tạo `CreateXxxDTO`, `UpdateXxxDTO` (partial/optional), `FindOneXxxParamDTO` (UUID param)
3. Gắn `@ApiProperty()` + `@IsNotEmpty()` / `@IsOptional()` + validators
4. Sử dụng `@SanitizeInput()` cho user-generated content

**Bước 3 — Business Layer (Service):**
1. Tạo file `<name>.service.ts` trong `services/`
2. Extends `BaseCRUDService<MyEntity>`
3. Inject `@InjectRepository(MyEntity) repo: Repository<MyEntity>` → truyền vào `super(repo)`
4. Tạo `private readonly logger = new Logger(MyService.name)`
5. Methods trả về `OperationResult` hoặc `HttpResponse<T>` sử dụng helper functions
6. Bọc Transaction với `QueryRunner` cho tác vụ write nhiều bảng:
   ```typescript
   const runner = this.model.manager.connection.createQueryRunner();
   await runner.connect();
   await runner.startTransaction();
   try {
     await this.createWithOpts(dto, { alias: 'entity', runner });
     await runner.commitTransaction();
   } catch (e) {
     await runner.rollbackTransaction();
     throw e;
   } finally {
     await runner.release();
   }
   ```

**Bước 4 — Presentation Layer (Controller):**
1. Tạo file `<name>.controller.ts`
2. Gắn: `@ApiTags('Tag')`, `@ApiBearerAuth()`, `@Controller('route-name')`, `@UseGuards(AuthGuard)`
3. Dùng `@Roles(ROLE.ADMIN)` + `@UseGuards(AuthGuard, RolesGuard)` cho admin-only routes
4. Dùng `@RequestUser() user: User` để lấy authenticated user
5. Dùng `@LogId() logId: string` cho request tracing
6. Gắn rate limiting: `@ApplyRateLimiting(limit, ttlSeconds)`
7. Gắn concurrency control: `@UseCallQueue()`
8. Gắn Swagger: `@ApiOperation({ summary: '...' })`

**Ví dụ Controller mẫu:**
```typescript
@ApiTags('Items')
@ApiBearerAuth()
@Controller('items')
@UseGuards(AuthGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  async findAll() {
    return this.itemService.findAllActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  async findById(@Param() params: FindOneParamDTO) {
    return this.itemService.findActiveById(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @UseCallQueue()
  @ApplyRateLimiting(10)
  async create(
    @LogId() logId: string,
    @RequestUser() user: User,
    @Body() dto: CreateItemDTO,
  ) {
    return this.itemService.createItem(logId, user.id, dto);
  }
}
```

**Bước 5 — DI Context (Module):**
1. Tạo file `<name>.module.ts`
2. `imports: [TypeOrmModule.forFeature([...entities])]`
3. `controllers: [...]`, `providers: [...]`, `exports: [...]`
4. Import module mới vào `app.module.ts`

### 📌 Debug & Refactor

1. Phân tích log/trace lỗi (sử dụng `X-Log-ID` header), định vị chính xác layer xảy ra sự cố
2. Check `AllExceptionsFilter` log output → tìm stack trace
3. Ưu tiên khoanh vùng lỗi, **tuyệt đối không** thay đổi Input/Output signature của public method đang ổn định
4. Kiểm tra `OperationResult.success` trước khi truy cập `.data` — pattern nhất quán trong toàn project

---

## 5. 🚫 RANH GIỚI ĐỎ (RED LINES — CẤM VI PHẠM)

1. **Tuyệt đối KHÔNG** hardcode credentials, secret keys hoặc connection string vào source code. Mọi secret phải đi qua `process.env` → config file → `ConfigService`.

2. **KHÔNG** viết Business Logic trong Controller. Controller chỉ nhận request → gọi Service → trả response. Không if/else logic phức tạp, không truy vấn DB.

3. **KHÔNG** thực hiện truy vấn DB trong vòng lặp (N+1 query). Sử dụng `IN (...)` queries, `relations`, hoặc `QueryBuilder` với JOINs.

4. **KHÔNG** bypass qua Validation (bỏ `@IsNotEmpty`, `whitelist: true`) hoặc Authorization (`AuthGuard`, `RolesGuard`).

5. **KHÔNG** throw raw `HttpException` trong Service layer. Sử dụng `generateNotFoundResult()`, `generateBadRequestResult()`, `generateForbiddenResult()` từ `operation-result.helper.ts`. Exception chỉ throw cho lỗi hệ thống không mong đợi.

6. **KHÔNG** tạo entity mà không kế thừa `AuditWithTimezone`. Mọi bảng đều cần soft-delete và audit timestamps.

7. **KHÔNG** sử dụng `any` type khi có thể tránh. Ưu tiên generics và typed interfaces.

8. **KHÔNG** tự ý thay đổi response format chuẩn (`{ success, data }` / `{ success, code, message }`). Mọi response đều phải đi qua `HttpResponseInterceptor` và `AllExceptionsFilter`.

9. **KHÔNG** tạo file mới mà không kiểm tra xem đã có file/module tương tự tồn tại. Ưu tiên mở rộng module hiện có.

---

## 6. 📦 CORE LIBRARY: `mvc-common-toolkit`

Dự án phụ thuộc vào thư viện `mvc-common-toolkit`. Các types/services quan trọng:

| Export               | Mô tả                                                      | Sử dụng tại                         |
|-----------------------|--------------------------------------------------------------|---------------------------------------|
| `HttpResponse<T>`    | Generic response type `{ success, data, message, code, httpCode }` | Return type của Service methods       |
| `OperationResult<T>` | Alias/extended của HttpResponse                               | Return type phổ biến nhất             |
| `PaginationResult<T>`| `{ rows, total, limit, offset }`                              | Kết quả pagination                    |
| `AuditService`       | Logging/audit trail service                                   | Global provider (Symbol injection)    |
| `ErrorLog`           | Structured error log object                                   | Exception filter, partner service     |
| `RedisService`       | Redis client wrapper (CacheService interface)                 | Rate limiting, OTP, cache             |
| `CacheService`       | Interface cho cache (get/set/del)                             | Injected via `INJECTION_TOKEN.REDIS_SERVICE` |
| `AxiosHttpService`   | HTTP client wrapper                                           | Outbound API calls                    |
| `SET_CACHE_POLICY`   | Enum cho cache TTL policies                                   | Rate limiting interceptor             |
| `SyncTaskQueue`      | Sequential task execution queue                               | Call queue interceptor                |
| `stringUtils`        | `generateRandomId()`, `maskFn`, `generatePassword()`          | Log masking, JWT fallback             |

---

## 7. 🔐 SECURITY PATTERNS

### Authentication Flow
1. `AuthGuard` extracts Bearer token → `JwtService.verifyAsync(token)` → lấy `{ id }`
2. Load full `User` entity từ DB → check `status === ENTITY_STATUS.ACTIVE`
3. Gắn vào `request.activeUser` (full entity) và `request.user = { id }` (minimal)
4. `@RequestUser()` decorator → trả về `request.activeUser`

### Authorization (RBAC)
- Roles được định nghĩa trong `ROLE` enum (ví dụ: `USER`, `ADMIN`)
- `@Roles(ROLE.ADMIN)` + `@UseGuards(AuthGuard, RolesGuard)` cho restricted endpoints
- `OptionalAuthGuard` cho endpoints cần biết user nhưng không bắt buộc đăng nhập

### Rate Limiting
- Redis-backed: `@ApplyRateLimiting(limit, ttlSeconds)`
- Key format: `rate_limit:{method}:{endpoint}:{ip}`
- Default: 60 requests / 60 seconds

### Brute Force Protection
- `@UseMaxAttempts(N)` — ban user sau N lần thất bại liên tiếp
- Cache key: `user:{userId}:route:{routeId}:failed-attempts`

### Concurrency Control
- `@UseCallQueue()` — serialize concurrent calls per user
- Ngăn race condition trên các endpoint quan trọng (auth, write operations)

### Input Sanitization
- `@SanitizeInput()` — strip HTML tags + escape HTML entities
- `@OnlyTextAndNumbers()` — reject special characters
- `@TrimAndLowercase()` — normalize input
- Global `ValidationPipe` với `forbidNonWhitelisted: true` — reject unknown fields

---

## 8. 📊 DATABASE CONVENTIONS

### Entity Design Rules
- **Primary Key:** UUID (`@PrimaryGeneratedColumn('uuid')`) cho tất cả bảng
- **Soft Delete:** Mọi entity kế thừa `AuditWithTimezone` (có `deletedAt`)
- **Column Naming:** DB dùng `snake_case`, TypeScript dùng `camelCase`, map qua `{ name: '...' }`
- **Relations:** Khai báo explicit với `@OneToMany`, `@ManyToOne`, `@OneToOne`
- **JSONB:** Dùng cho dữ liệu flexible (metadata, config, tags)
- **Indexes:** Đặt `@Index()` cho các cột query thường xuyên

### Ví dụ Relation Pattern
```typescript
// Parent entity
@OneToMany(() => ChildEntity, (child) => child.parent, { cascade: true })
children: ChildEntity[];

// Child entity
@ManyToOne(() => ParentEntity, (parent) => parent.children)
@JoinColumn({ name: 'parent_id' })
parent: ParentEntity;

@Column({ name: 'parent_id' })
parentId: string;
```

---

## 9. 🧪 TESTING CONVENTIONS

- **Framework:** Jest 29 + ts-jest
- **E2E:** Supertest
- **File pattern:** `*.spec.ts` trong cùng thư mục với source
- **Coverage:** `jest --coverage` → output tại `../coverage/`
- **Test environment:** `node`

---

## 10. ⚙️ FORMATTING & LINTING

### Prettier (.prettierrc)
```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "all",
  "singleQuote": true,
  "semi": true,
  "endOfLine": "lf"
}
```

### Import Order (Enforced)
1. Tracing setup (nếu có)
2. Third-party (`mvc-common-toolkit`, `typeorm`, `dayjs`, ...)
3. `@nestjs/*`
4. `@configs/*`
5. `@modules/*`
6. `@shared/*`
7. Relative (`./`, `../`)

---

## 11. 🗓️ MISCELLANEOUS PATTERNS

### API Versioning
- URI-based: `/api/v1/...` (default version = 1)
- Cấu hình trong `setup.ts`: `app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })`

### Swagger
- Auto-generated tại `/docs` (kiểm soát bởi `ENABLE_SWAGGER` env)
- `persistAuthorization: true` — giữ token qua page reload
- Dùng `@ApiOperationSuccess<T>()` và `@ApiOperationError()` decorators cho response docs

### Event-Driven Architecture
- `@nestjs/event-emitter` cho domain events
- Event keys dạng: `<domain>.<action>` (ví dụ: `order.created`, `user.verified`)
- Listeners xử lý async side-effects (notifications, cache invalidation, ...)

### Scheduled Tasks
- `@nestjs/schedule` cho cron jobs
- Đặt cron logic trong file riêng: `<module>/cron/<name>.cron.ts`

### Logging
- NestJS `Logger` class, khởi tạo: `new Logger(ClassName.name)`
- Request-level tracing via `X-Log-ID` header (auto-generated nếu không có)
- `HttpLoggingInterceptor` logs request/response với timing

### Storage Paths
Tổ chức cloud storage theo pattern:
```typescript
getStorageFolder() => ({
  AVATARS: `${APP_NAME}/images/upload/avatars`,
  UPLOADS: `${APP_NAME}/images/upload/<feature>`,
  FILES: `${APP_NAME}/files/upload/<feature>`,
})
```

### Timezone
- Set default timezone trong `main.ts` nếu cần (ví dụ: `dayjs.tz.setDefault('Asia/Ho_Chi_Minh')`)
- DB timestamps: luôn dùng `timestamp with time zone`

### Body Size Limit
- Configured trong `setup.ts`: `app.use(json({ limit: '500mb' }))` — điều chỉnh theo nhu cầu dự án

### Graceful Shutdown
- `app.enableShutdownHooks()` được gọi trong `setup.ts`
