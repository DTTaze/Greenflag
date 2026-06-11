# BÁO CÁO DỰ ÁN GREENFLAG

## 1. Khảo sát hiện trạng và xác định yêu cầu

GreenFlag là nền tảng số hướng đến việc khuyến khích lối sống xanh thông qua nhiệm vụ môi trường, sự kiện cộng đồng, diễn đàn trao đổi, cơ chế tích điểm Coin/Rank và khu trao đổi vật phẩm. Theo cấu trúc repository, hệ thống gồm frontend Next.js trong `FRONTEND`, backend NestJS chính trong `backend-nestjs`, cơ sở dữ liệu PostgreSQL, Redis/BullMQ và bộ hạ tầng Docker/observability. Backend Express cũ trong `BACKEND` được README gốc ghi rõ là đã deprecated và không còn được sử dụng.

### Phỏng vấn/Khảo sát

[Dữ liệu khảo sát dưới đây là nội dung mô phỏng hợp lý theo định hướng dự án; cần thay bằng số liệu thật nếu nhóm đã có khảo sát người dùng.]

Đối tượng khảo sát giả định gồm học sinh, sinh viên, nhân viên văn phòng, thành viên câu lạc bộ môi trường và đơn vị tổ chức sự kiện xanh. Kết quả khảo sát định tính cho thấy người dùng có nhu cầu cao đối với một nền tảng có thể biến hành vi bảo vệ môi trường thành hoạt động thường xuyên, có ghi nhận tiến độ, có phần thưởng và có cộng đồng cùng tham gia.

Các nhu cầu nổi bật:

- Người dùng muốn có danh sách nhiệm vụ xanh rõ ràng, ví dụ phân loại rác, giảm nhựa dùng một lần, xem video giáo dục môi trường, tham gia sự kiện.
- Người dùng cần cơ chế xác nhận hoàn thành nhiệm vụ bằng minh chứng như hình ảnh, QR hoặc tiến độ.
- Người dùng muốn nhận Coin, Rank hoặc streak để duy trì động lực.
- Ban tổ chức hoặc đối tác cần công cụ tạo nhiệm vụ, sự kiện, vật phẩm và theo dõi người tham gia.
- Quản trị viên cần công cụ kiểm duyệt nội dung forum, quản lý người dùng, giao dịch, vật phẩm và luồng đơn hàng.
- Người dùng muốn trao đổi hoặc mua vật phẩm bằng Coin, có địa chỉ nhận hàng và theo dõi đơn giao vận.

### Yêu cầu chức năng

Các yêu cầu chức năng được xác định từ controller, route frontend, service backend và lược đồ ERD:

- Xác thực và tài khoản: đăng ký, đăng nhập, xác minh OTP/email, quên mật khẩu, đổi mật khẩu, Google OAuth, `whoami`.
- Hồ sơ người dùng: cập nhật thông tin cá nhân, avatar, địa chỉ nhận hàng, lịch sử nhiệm vụ, lịch sử giao dịch.
- Task/Mission: xem danh sách nhiệm vụ, lọc theo loại và độ khó, nhận nhiệm vụ, tăng tiến độ, nộp minh chứng, duyệt submission, thưởng Coin.
- Event: xem sự kiện, đăng ký tham gia, lấy QR, check-in/check-out, quản lý người tham gia, thưởng Coin sau khi hoàn tất.
- Forum: xem feed bài viết, tạo/sửa/xóa mềm bài viết, bình luận, vote bài viết/bình luận, bài viết gắn sự kiện, hỗ trợ AI enhance nội dung.
- Commerce/Exchange Market: xem sản phẩm/vật phẩm, tạo item/product, mua vật phẩm bằng Coin, tạo transaction, xử lý đơn qua queue.
- Delivery: quản lý địa chỉ nhận hàng, tài khoản giao vận của partner, preview phí/đơn giao hàng, tạo delivery order từ transaction, hủy đơn.
- Coin/Rank: xem Coin, cập nhật Coin bởi admin, tăng/giảm Coin, sắp xếp Rank.
- Admin: quản lý users, tasks, events, products, items, transactions, delivery accounts/orders, community moderation.
- Partner/Customer workspace: giao diện và API riêng cho đối tác tạo nhiệm vụ, sự kiện, vật phẩm, đơn hàng và quét QR.
- Media/Storage: upload media, Cloudinary signature, cấu hình Cloudinary và Cloudflare R2 trong môi trường mẫu.
- Health/Observability: health endpoint, logging interceptor, metrics service, OpenTelemetry, Prometheus/Grafana/Jaeger/Loki qua Docker infra.

### Yêu cầu phi chức năng

- Hiệu năng: backend dùng Redis và BullMQ để xử lý tác vụ mua hàng bất đồng bộ; giao dịch mua item dùng pessimistic lock trên item và coin để hạn chế race condition.
- Bảo mật: backend dùng JWT, Passport, bcryptjs, guard xác thực, role guard cho `admin` và `partner`, ValidationPipe với whitelist/forbidNonWhitelisted, decorator sanitize input.
- Tin cậy dữ liệu: luồng mua hàng có transaction database và cơ chế SAGA compensating action để hoàn Coin, khôi phục tồn kho khi tạo đơn giao hàng thất bại.
- Khả năng mở rộng: NestJS chia module theo domain; frontend chia theo route App Router, feature components và service handlers.
- Quan sát hệ thống: repository có cấu hình OpenTelemetry Collector, Prometheus, Grafana, Jaeger, Loki, Promtail và Redis Exporter.
- Khả năng triển khai: Dockerfile cho frontend/backend, `docker-compose.yml`, `docker-compose.infra.yml` và Makefile hỗ trợ chạy local/staging.
- Quốc tế hóa giao diện: frontend dùng route `[locale]` và `next-intl`.
- Hạn chế cần lưu ý: CORS hiện đang cấu hình `origin: '*'`; `DB_SYNCHRONIZE=true` trong env mẫu phù hợp phát triển nhưng cần migration strategy cho production.

## 2. Phân tích và thiết kế hệ thống

### 2.1. Phân tích yêu cầu

Tóm tắt SRS của GreenFlag:

- Mục tiêu hệ thống: xây dựng nền tảng khuyến khích hành vi sống xanh bằng nhiệm vụ, sự kiện, cộng đồng và cơ chế thưởng.
- Tác nhân chính: Guest, User, Partner, Admin.
- Guest: xem nội dung công khai, đăng ký/đăng nhập.
- User: hoàn thành nhiệm vụ, tham gia sự kiện, đăng bài forum, bình luận/vote, mua vật phẩm bằng Coin, quản lý hồ sơ và địa chỉ nhận hàng.
- Partner: tạo và quản lý nhiệm vụ, sự kiện, sản phẩm/vật phẩm, tài khoản giao vận, đơn hàng và quét QR người tham gia.
- Admin: quản lý người dùng, Coin/Rank, kiểm duyệt nội dung, quản lý transaction, item/product, task/event và delivery.
- Ràng buộc nghiệp vụ: Coin là đơn vị trao đổi nội bộ; mua item phải kiểm tra tồn kho, số dư Coin và địa chỉ nhận hàng; transaction thất bại phải hoàn Coin và stock.
- Ràng buộc kỹ thuật: API backend đặt global prefix `api`, versioning URI mặc định `v1`; frontend env mẫu trỏ đến `http://localhost:3030/api/v1`.

### 2.2. Thiết kế hệ thống

Kiến trúc tổng thể:

- Frontend: Next.js 16, React 19, App Router, route theo locale, React Query, Zustand, Axios, MUI/Ant Design/shadcn/Tailwind.
- Backend: NestJS 11, TypeScript, TypeORM, PostgreSQL, Redis/BullMQ, Swagger, JWT/Passport, class-validator.
- Database: PostgreSQL, lược đồ ERD trong `docs/erd.dbml`.
- Queue: BullMQ queue `COMMERCE` xử lý job mua item.
- External services: GHN Shipping API, Cloudinary, Cloudflare R2, SMTP, Google OAuth, Groq/LangChain cho AI enhance nội dung.
- Observability: OpenTelemetry, Prometheus, Grafana, Jaeger, Loki, Promtail.

Danh sách Use Case chính:

- UC01: Đăng ký tài khoản và xác minh OTP.
- UC02: Đăng nhập bằng email/password hoặc Google OAuth.
- UC03: Cập nhật hồ sơ, avatar và địa chỉ nhận hàng.
- UC04: Xem, nhận và hoàn thành nhiệm vụ xanh.
- UC05: Nộp minh chứng nhiệm vụ và chờ duyệt.
- UC06: Nhận Coin sau khi hoàn thành task/event.
- UC07: Xem bảng Rank và số dư Coin.
- UC08: Xem danh sách sự kiện và đăng ký tham gia.
- UC09: Check-in/check-out sự kiện bằng QR.
- UC10: Tạo bài viết forum, bình luận, vote và xóa mềm.
- UC11: Dùng AI enhance để cải thiện nội dung bài viết.
- UC12: Mua vật phẩm bằng Coin trên exchange market.
- UC13: Tạo transaction, xử lý queue, tạo delivery order.
- UC14: Partner tạo product/item/task/event.
- UC15: Admin kiểm duyệt nội dung, quản lý người dùng và giao dịch.
- UC16: Theo dõi health, logs, metrics và traces hệ thống.

Các class/entity chính của hệ thống:

- Nhóm người dùng: `User`, `UserProfile`, `UserSocialAccount`, `Coin`, `Rank`.
- Nhóm nhiệm vụ: `Task`, `Type`, `TaskType`, `TaskUser`, `TaskSubmit`.
- Nhóm sự kiện: `Event`, `EventUser`.
- Nhóm forum: `Post`, `PostVote`, `Comment`, `CommentVote`.
- Nhóm commerce: `Product`, `Item`, `Transaction`.
- Nhóm delivery: `DeliveryAccount`, `ReceiverInformation`, `DeliveryOrder`.
- Nhóm cấu hình: `SystemConfig`.

Các module backend thực tế:

- `AuthModule`, `UserModule`, `TaskModule`, `EventModule`, `ForumModule`, `CommerceModule`, `DeliveryModule`, `CloudinaryModule`, `MediaModule`, `StorageModule`, `SystemConfigModule`, `GlobalModule`, `HealthModule`, `EmailModule`.

### 2.3. Thiết kế cơ sở dữ liệu

Lược đồ ERD được mô tả trong `docs/erd.dbml`, khai báo database type là PostgreSQL. Các bảng chính:

- `users`: lưu tài khoản, email, username, password hash, role `admin/partner/user`, status, avatar, metadata.
- `user_profiles`: quan hệ 1-1 với `users`, lưu họ tên, số điện thoại, streak và thời điểm hoàn thành task gần nhất.
- `user_social_accounts`: lưu tài khoản OAuth theo provider.
- `coins`: quan hệ 1-1 với `users`, lưu số dư Coin.
- `ranks`: quan hệ 1-1 với `users`, lưu điểm và thứ hạng.
- `tasks`: nhiệm vụ xanh, gồm title, description, content, coins, difficulty, total, status.
- `types` và `task_types`: phân loại nhiệm vụ theo nhiều type.
- `task_users`: trạng thái người dùng nhận task, progress count, assigned/completed time.
- `task_submits`: minh chứng nộp task, description, status, images.
- `events`: sự kiện xanh, gồm title, location, capacity, coins, thời gian đăng ký và thời gian diễn ra.
- `event_users`: bảng liên kết người dùng tham gia sự kiện, joined/completed time.
- `posts`, `comments`: nội dung forum, vote count, score, status, moderation fields.
- `post_votes`, `comment_votes`: lưu vote theo user và target.
- `products`, `items`: sản phẩm/vật phẩm trao đổi, giá Coin, tồn kho, kích thước/khối lượng giao vận.
- `transactions`: giao dịch mua item, buyer/seller/item, receiver information, snapshot, quantity, total price, status.
- `receiver_informations`: địa chỉ nhận hàng của user.
- `delivery_accounts`: tài khoản giao vận của seller/partner, carrier mặc định `ghn`, api config.
- `delivery_orders`: đơn giao vận gắn 1-1 với transaction.
- `system_configs`: cấu hình runtime như moderation, auto approve hoặc role policy.

Quan hệ dữ liệu quan trọng:

- `users` 1-1 `coins`, `ranks`, `user_profiles`.
- `users` 1-n `tasks`, `events`, `products`, `items`, `posts`, `comments`, `transactions`.
- `tasks` n-n `types` qua `task_types`.
- `users` n-n `tasks` qua `task_users`.
- `task_users` 1-n `task_submits`.
- `users` n-n `events` qua `event_users`.
- `posts` 1-n `comments`; `comments` có `parent_id` để hỗ trợ reply/thread.
- `items` n-1 `products`; `transactions` tham chiếu buyer, seller, item và receiver information.
- `transactions` 1-1 `delivery_orders`.

## 3. Lập trình và triển khai

### Ngôn ngữ và Framework

Backend chính:

- TypeScript.
- NestJS 11.
- TypeORM 0.3.
- PostgreSQL driver `pg`.
- JWT/Passport cho xác thực.
- BullMQ và Redis cho queue.
- Swagger/OpenAPI qua `@nestjs/swagger`.
- class-validator/class-transformer cho validation DTO.
- Axios/NestJS Axios cho gọi API bên ngoài.
- OpenTelemetry packages cho tracing/metrics.
- Cloudinary, AWS SDK S3 compatible cho media/storage.
- Nodemailer cho email.
- LangChain/Groq cho tính năng AI enhance nội dung forum.

Frontend:

- TypeScript, JavaScript, TSX/JSX, CSS.
- Next.js 16 với App Router.
- React 19.
- `next-intl` cho đa ngôn ngữ.
- `@tanstack/react-query` cho server state.
- Zustand cho client state.
- Axios cho HTTP client.
- MUI, Ant Design, shadcn/base-ui, Tailwind CSS 4 cho UI.
- Framer Motion cho animation.
- Lucide React cho icon.
- ZXing cho QR/barcode scanner.
- React Player cho trang video mission.

### Cơ sở dữ liệu

- PostgreSQL 16 Alpine trong `docker-compose.yml`.
- TypeORM cấu hình `type: 'postgres'`, `autoLoadEntities: true`.
- Database schema mặc định trong env mẫu: `greenflag`.
- Redis 7 Alpine được dùng cho cache/BullMQ.
- ERD chính thức nằm tại `docs/erd.dbml`.

### Quản lý mã nguồn và triển khai

- Git repository có `.git`, `.github`, `.gitignore`.
- Backend Dockerfile nằm tại `backend-nestjs/Dockerfile`.
- Frontend Dockerfile nằm tại `FRONTEND/Dockerfile`.
- `docker-compose.yml` chạy PostgreSQL, Redis, backend NestJS và frontend Next.js trên network `greenflag-net`.
- `docker-compose.infra.yml` chạy Cloudflare Tunnel, OpenTelemetry Collector, Prometheus, Jaeger, Loki, Promtail, Grafana và Redis Exporter.
- Makefile hỗ trợ các lệnh như `make init`, `make infra-up`, `make app-up`, `make down`, `make clean`, `make logs`.
- Backend API local theo README: `http://localhost:3030`; Swagger tại `http://localhost:3030/docs`.
- Frontend dev theo README: `http://localhost:3000`; Docker expose frontend ở `5173`.

## 4. Kiểm thử và đảm bảo chất lượng

Repository có tài liệu kiểm thử tại `docs/test_specification.md` và test code trong `backend-nestjs`.

### 4.1. Unit Test (Jest)

Backend dùng Jest, ts-jest và `@nestjs/testing`. Các unit test thực tế:

- `backend-nestjs/src/modules/commerce/services/transaction.service.spec.ts`.
- `backend-nestjs/test/forum/vote-handler.helper.spec.ts`.

Phạm vi đã kiểm thử:

- `TransactionService.cancelTransactionById()`: hủy transaction thành công khi buyer hợp lệ và trạng thái `PENDING`; chặn user không phải buyer; chặn transaction đã `CANCELLED` hoặc `ACCEPTED`.
- `TransactionService.makeDecision()`: seller chấp nhận transaction; chặn user không phải seller.
- `TransactionService.refundTransaction()`: hoàn Coin cho buyer, khôi phục stock item, cập nhật trạng thái item, phát stock update qua socket stub; xử lý transaction không tồn tại.
- `handleVote()`: vote mới, đổi UP sang DOWN, hủy vote bằng `NONE`, cập nhật `upvotes`, `downvotes`, `score`.

### 4.2. Integration Test

Tài liệu `docs/test_specification.md` mô tả nhóm integration test cho:

- `ItemService.purchaseItem()`: tạo transaction, trừ Coin, đẩy job vào BullMQ.
- `CommerceProcessor.process()`: xử lý job mua hàng, tạo delivery order, cập nhật transaction.
- `GhnShippingStrategy.createOrder()`: xử lý lỗi API giao vận và kích hoạt bù trừ SAGA.

Tuy nhiên, trong code hiện tại chưa thấy file integration test tách riêng chạy với database/Redis thật. Một phần hành vi integration được kiểm chứng gián tiếp qua service unit test và E2E test có mock dependency. Để hoàn thiện QA production, nên bổ sung integration test sử dụng test database, Redis test container hoặc Docker Compose riêng cho test.

### 4.3. Functional/E2E Test (Supertest)

Các E2E test thực tế:

- `backend-nestjs/test/commerce/commerce.e2e-spec.ts`.
- `backend-nestjs/test/forum/forum.e2e-spec.ts`.

Công cụ:

- Supertest.
- `@nestjs/testing`.
- Nest application test instance.
- ValidationPipe.
- Mock AuthGuard/OptionalAuthGuard, mock service layer.

Phạm vi E2E Commerce:

- `GET /commerce/items`: trả danh sách item.
- `POST /commerce/items/:itemId/purchase`: tạo yêu cầu mua hàng, trả `Purchase request is in queue`.
- Payload quantity âm trả `400 Bad Request`.

Phạm vi E2E Forum:

- `GET /forum/posts`: lấy feed phân trang.
- `POST /forum/posts`: tạo bài viết.
- Content trống trả `400 Bad Request`.
- `GET /forum/posts/my-posts`: lấy bài viết của user.
- `GET /forum/posts/:id`: lấy chi tiết bài.
- `PUT /forum/posts/:id`: cập nhật bài viết.
- `POST /forum/posts/:id/vote`: vote bài viết, reject vote type không hợp lệ.
- `POST /forum/posts/ai-enhance`: tối ưu nội dung nháp bằng AI.
- `GET/POST /forum/posts/:id/comments`: lấy và tạo bình luận.
- `PUT /forum/comments/:id`: sửa bình luận.
- `POST /forum/comments/:id/vote`: vote bình luận.
- `DELETE /forum/posts/:id`, `DELETE /forum/comments/:id`: xóa mềm.

### Quy tắc kiểm thử 80/20

Chiến lược kiểm thử nên tập trung 80% nỗ lực vào 20% luồng có rủi ro nghiệp vụ cao nhất:

- Giao dịch Coin: trừ Coin khi mua item, hoàn Coin khi hủy/thất bại, chống số dư âm.
- Tồn kho item: lock, trừ stock, sold out, khôi phục stock khi refund.
- Transaction lifecycle: `PENDING`, `ACCEPTED`, `CANCELLED`, `REJECTED`.
- Giao vận: tạo order GHN, lỗi API/timeout, hủy đơn, đồng bộ trạng thái.
- Task/Event reward: duyệt nhiệm vụ, check-in/check-out sự kiện, cộng Coin đúng một lần.
- Forum moderation/vote: tránh vote sai, vote lặp, nội dung không hợp lệ hoặc bị kiểm duyệt.
- Phân quyền: user/partner/admin không truy cập nhầm chức năng của nhau.

## 5. Áp dụng quy trình phát triển phần mềm

Dự án phù hợp với mô hình SDLC theo Agile/Scrum, chia thành các phase ngắn theo domain nghiệp vụ.

### Phase 1: Khởi tạo và phân tích yêu cầu

- Xác định mục tiêu sản phẩm: nền tảng sống xanh có nhiệm vụ, sự kiện, cộng đồng và phần thưởng.
- Xác định actor: Guest, User, Partner, Admin.
- Xây dựng backlog chức năng theo module: Auth, User, Task, Event, Forum, Commerce, Delivery, Admin.

### Phase 2: Thiết kế kiến trúc và dữ liệu

- Chọn kiến trúc frontend Next.js và backend NestJS modular.
- Thiết kế ERD trong `docs/erd.dbml`.
- Chuẩn hóa domain entity theo nhóm user, task, event, forum, commerce, delivery.
- Thiết lập API prefix/versioning, Swagger và DTO validation.

### Phase 3: Xây dựng backend lõi

- Implement Auth/User/Coin/Rank.
- Implement Task/Event với submission, QR và reward.
- Implement Commerce với transaction, item, product và queue.
- Implement Delivery với receiver information, delivery account/order và strategy provider.

### Phase 4: Xây dựng frontend theo vai trò

- Giao diện người dùng: home, missions, video missions, forum, exchange market, profile, purchase/history/address.
- Giao diện admin: dashboard, users, roles-permissions, queues, transactions, orders, content management.
- Giao diện customer/partner: profile, items, orders, events, scanner.
- Giao diện auth: login, register, forgot password, OAuth callback.

### Phase 5: Kiểm thử và refactor

- Bổ sung Jest unit test cho transaction/refund và vote helper.
- Bổ sung Supertest E2E cho commerce và forum.
- Refactor Forum theo hướng controller/service rõ ràng, có moderation, vote, comment và AI enhance.
- Tối ưu luồng commerce bằng BullMQ và SAGA compensation.

### Phase 6: Triển khai và quan sát hệ thống

- Đóng gói backend/frontend bằng Docker.
- Chạy PostgreSQL, Redis và app bằng Docker Compose.
- Bổ sung observability stack: OpenTelemetry, Prometheus, Grafana, Jaeger, Loki, Promtail.
- Cấu hình Cloudflare Tunnel cho môi trường staging/public demo.

### Phase 7: Hoàn thiện sản phẩm

- Kiểm thử nội bộ theo kịch bản end-to-end.
- Thu thập phản hồi người dùng.
- Ưu tiên backlog còn lại: production migration, CI/CD, test tích hợp thật, hardening bảo mật.

## 6. Kết quả thực nghiệm

[Dữ liệu thực nghiệm dưới đây là kịch bản kiểm thử nội bộ mô phỏng dựa trên codebase; cần thay bằng log test thật nếu nhóm đã chạy kiểm thử với người dùng.]

### Môi trường chạy thử

- Frontend: Next.js app trong `FRONTEND`.
- Backend: NestJS app trong `backend-nestjs`.
- Database: PostgreSQL 16.
- Queue/cache: Redis 7 và BullMQ.
- API base: `http://localhost:3030/api/v1`.
- Swagger: `http://localhost:3030/docs`.
- Observability: Prometheus, Grafana, Jaeger, Loki theo `docker-compose.infra.yml`.

### Kịch bản test nội bộ

| Nhóm kịch bản     | Mô tả                                                          | Kết quả kỳ vọng                                                                         |
| ----------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Đăng ký/đăng nhập | User tạo tài khoản, xác minh OTP, đăng nhập và gọi `whoami`    | Tài khoản được tạo, JWT hợp lệ, profile/coin/rank được truy xuất                        |
| Mission           | User xem task, nhận task, nộp minh chứng và được duyệt         | TaskUser cập nhật tiến độ, TaskSubmit lưu trạng thái, Coin tăng khi hoàn tất            |
| Event             | User đăng ký sự kiện, partner/admin check-in/check-out bằng QR | EventUser ghi nhận joined/completed time, Coin thưởng theo cấu hình event               |
| Forum             | User tạo bài, bình luận, vote; admin kiểm duyệt community      | Bài viết/bình luận lưu đúng trạng thái, vote cập nhật score                             |
| Commerce          | User mua item bằng Coin                                        | Coin bị trừ, stock giảm, transaction `PENDING`, job BullMQ được tạo                     |
| Delivery          | Worker xử lý transaction và gọi shipping provider              | DeliveryOrder được tạo, transaction chuyển `ACCEPTED`; nếu lỗi thì refund Coin và stock |
| Admin             | Admin xem user, transaction, item, product, content            | API phân quyền đúng, dữ liệu trả về theo role                                           |
| Observability     | Gọi API và xử lý queue khi tracing bật                         | Metrics/logs/traces được gửi về stack quan sát                                          |

### Ghi nhận phản hồi

Phản hồi tích cực giả định:

- Người dùng hiểu nhanh cơ chế nhiệm vụ, Coin và Rank.
- Trang mission, event và exchange market tạo cảm giác có tiến trình rõ ràng.
- Forum giúp cộng đồng chia sẻ hoạt động sống xanh và gắn bài viết với sự kiện.
- Partner có đủ công cụ để quản lý sự kiện, vật phẩm và đơn hàng.
- Admin dashboard hỗ trợ kiểm soát nội dung, người dùng và giao dịch.

Vấn đề được ghi nhận:

- Luồng giao vận phụ thuộc cấu hình tài khoản GHN/GHTK của seller; nếu thiếu delivery account thì transaction phải rollback/refund.
- E2E test hiện mock guard/service nên chưa chứng minh đầy đủ hành vi với PostgreSQL/Redis thật.
- `DB_SYNCHRONIZE=true` tiện cho development nhưng không phù hợp production nếu chưa có migration.
- CORS mở toàn bộ origin cần giới hạn khi triển khai public.
- Cần chuẩn hóa dữ liệu khảo sát thật và chỉ số tác động môi trường để tăng sức thuyết phục học thuật.
- Cần bổ sung monitoring dashboard cụ thể cho queue purchase, failed purchase và shipping failure.

## 7. Tổng kết

### 7.1. Kết quả đạt được

- Xây dựng được kiến trúc fullstack gồm Next.js frontend, NestJS backend, PostgreSQL, Redis/BullMQ và Docker.
- Hoàn thiện backend modular theo domain: Auth, User, Task, Event, Forum, Commerce, Delivery, Storage, System Config.
- Thiết kế ERD tương đối đầy đủ trong `docs/erd.dbml`, bao phủ user, coin, rank, task, event, forum, commerce và delivery.
- Hoàn thành module Forum với post, comment, vote, moderation fields, AI enhance và test E2E.
- Tích hợp luồng commerce dùng Coin, transaction, stock lock, BullMQ worker và bù trừ SAGA khi lỗi giao vận.
- Tích hợp delivery strategy với GHN, delivery account, receiver information và delivery order.
- Hoàn thiện nhiều bề mặt frontend: missions, forum, exchange market, profile, admin dashboard, customer/partner workspace, QR scanner.
- Có Docker Compose cho app và infra; có observability stack phục vụ demo/staging.
- Có kiểm thử Jest/Supertest cho các nghiệp vụ trọng yếu như transaction refund, vote logic, commerce API và forum API.

### 7.2. Hạn chế

- Chưa thấy integration test độc lập chạy với PostgreSQL/Redis thật.
- Chưa thấy migration TypeORM chính thức; cấu hình synchronize phù hợp phát triển nhưng rủi ro cho production.
- Một số dữ liệu học thuật như khảo sát người dùng, sprint log, feedback thật và số liệu tác động môi trường chưa có trong repo.
- E2E test hiện chủ yếu mock service/guard, nên chưa bao phủ toàn bộ đường đi từ HTTP đến database và external API.
- CORS đang mở rộng cho mọi origin; cần hardening trước khi public.
- Tích hợp giao vận phụ thuộc provider bên ngoài và credential của partner, cần kịch bản retry/dead-letter rõ hơn.
- Frontend sử dụng nhiều UI library cùng lúc, cần quy chuẩn design system để giảm chi phí bảo trì lâu dài.

### 7.3. Hướng phát triển tương lai

- Bổ sung migration database và seed data chuẩn cho demo/staging/production.
- Thiết lập CI/CD chạy lint, unit test, E2E test và Docker build.
- Bổ sung integration test với test database, Redis và mock server GHN.
- Hoàn thiện dashboard observability cho purchase queue, shipping failure, refund rate và API latency.
- Siết CORS, secret management, rate limit và audit log cho production.
- Mở rộng AI moderation cho forum và task submission.
- Bổ sung chỉ số tác động môi trường như lượng nhựa giảm, CO2 ước tính, số sự kiện xanh đã tham gia.
- Phát triển mobile/PWA để người dùng check-in, nộp minh chứng và theo dõi nhiệm vụ thuận tiện hơn.
- Mở rộng hệ sinh thái partner: trường học, doanh nghiệp, tổ chức môi trường, đơn vị tái chế và nhà tài trợ vật phẩm xanh.
