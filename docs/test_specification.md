# Tài Liệu Đặc Tả Kiểm Thử (Test Case Specification) - TechSolve 2025

Tài liệu này định nghĩa danh sách các ca kiểm thử (Test Cases) được thiết kế cho hệ thống NestJS backend, tập trung vào nghiệp vụ cốt lõi: xử lý giao dịch mua hàng (`TransactionService`), tính toán điểm và hoàn tiền coin (`CoinService`), quản lý xếp hạng (`RankService`), và tích hợp hàng đợi BullMQ / API bên ngoài.

---

## Danh sách các ca kiểm thử (Test Cases)

| Test ID | Test Type | Target Method/Endpoint | Description & Scenario | Input Data / Payload | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UTC-001** | Unit | `TransactionService.cancelTransactionById()` | **Happy Path:** Hủy giao dịch thành công khi trạng thái hiện tại là `PENDING`. | `id`: UUID hợp lệ,<br>`currentUserId`: khớp với `buyerId` | Trả về `success: true` với trạng thái `CANCELLED` và gọi phương thức hoàn tiền. |
| **UTC-002** | Unit | `TransactionService.cancelTransactionById()` | **Edge Case:** Hủy giao dịch thất bại vì người dùng không có quyền (không phải buyer). | `id`: UUID hợp lệ,<br>`currentUserId`: không khớp với `buyerId`, `isAdmin`: `false` | Trả về lỗi `FORBIDDEN` (`403 Forbidden`). |
| **UTC-003** | Unit | `TransactionService.cancelTransactionById()` | **Edge Case:** Hủy giao dịch thất bại vì giao dịch đã bị hủy trước đó. | `id`: UUID hợp lệ,<br>`currentUserId`: khớp với `buyerId`, trạng thái là `CANCELLED` | Trả về lỗi `BAD_REQUEST` (`400 Bad Request`). |
| **UTC-004** | Unit | `TransactionService.cancelTransactionById()` | **Edge Case:** Hủy giao dịch thất bại vì giao dịch đã được chấp nhận (`ACCEPTED`). | `id`: UUID hợp lệ,<br>`currentUserId`: khớp với `buyerId`, trạng thái là `ACCEPTED` | Trả về lỗi `BAD_REQUEST` (`400 Bad Request`). |
| **UTC-005** | Unit | `TransactionService.refundTransaction()` | **Happy Path:** Hoàn trả Coin cho người mua thành công và hoàn trả số lượng hàng trong kho. | `transactionId`: UUID hợp lệ,<br>`reason`: 'User cancelled' | Cập nhật `Transaction` thành `CANCELLED`, hoàn coin cho Buyer, cộng tồn kho và phát socket cập nhật kho. |
| **UTC-006** | Unit | `TransactionService.refundTransaction()` | **Edge Case:** Giao dịch không tồn tại trong DB. | `transactionId`: UUID ngẫu nhiên | Trả về lỗi `NOT_FOUND` (`404 Not Found`). |
| **UTC-007** | Unit | `TransactionService.makeDecision()` | **Happy Path:** Seller đồng ý giao dịch (chuyển sang `ACCEPTED`). | `id`: UUID hợp lệ,<br>`decision`: `ACCEPTED`, `currentUserId`: khớp với `sellerId` | Trả về `success: true` với trạng thái `ACCEPTED`. |
| **ITC-001** | Integration | `ItemService.purchaseItem()` | **Happy Path:** User mua hàng thành công, hệ thống tạo bản ghi Transaction, trừ Coin tạm thời và đẩy Job vào BullMQ. | `userId`: UUID,<br>`itemId`: UUID,<br>Payload: `PurchaseItemDto` | Trả về `success: true` với thông tin job hàng đợi và thông điệp 'Purchase request is in queue'. |
| **ITC-002** | Integration | `CommerceProcessor.process()` | **Happy Path:** Xử lý job thành công: Trừ kho thực tế, thăng hạng user (nếu đủ điều kiện), hoàn thành Transaction. | Job dữ liệu chứa `transactionId`, `userId`, `itemId` | Tồn kho của Item trừ đi lượng mua, Transaction chuyển sang `ACCEPTED`, và cập nhật rank thành công. |
| **ITC-003** | Integration | `GhnShippingStrategy.createOrder()` | **Edge Case:** API bên ngoài (GHN) trả về lỗi 500 hoặc timeout. | Mock HTTP response error | Ném ra ngoại lệ thích hợp, kích hoạt kịch bản bù đắp SAGA (`refundTransaction`) để khôi phục coin/kho. |
| **FTC-001** | Functional / E2E | `POST /commerce/items/:itemId/purchase` | **Happy Path:** Gửi yêu cầu mua hàng qua API Http. | **Headers:** `Authorization: Bearer <token>`<br>**Params:** `:itemId` hợp lệ<br>**Payload:** `PurchaseItemDto` hợp lệ | Trả về HTTP Status `201 Created` với cấu trúc JSON chuẩn xác. |
| **FTC-002** | Functional / E2E | `POST /commerce/items/:itemId/purchase` | **Edge Case:** Gửi yêu cầu mua hàng nhưng không truyền token xác thực. | Không có header `Authorization` | Trả về HTTP Status `401 Unauthorized`. |
| **FTC-003** | Functional / E2E | `POST /commerce/items/:itemId/purchase` | **Edge Case:** Gửi payload không hợp lệ (ví dụ số lượng mua âm). | Payload: `quantity: -1` | Trả về HTTP Status `400 Bad Request` chứa thông tin lỗi validation. |

---

## Forum Module Test Cases (E2E)

| Test ID | Test Type | Target Method/Endpoint | Description & Scenario | Input Data / Payload | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FTC-FORUM-001** | Functional / E2E | `GET /forum/posts` | **Happy Path:** Lấy danh sách tin đăng bài viết phân trang thành công. | `query`: `{ limit: 10, page: 1 }` | Trả về HTTP Status `200 OK` chứa danh sách bài viết. |
| **FTC-FORUM-002** | Functional / E2E | `POST /forum/posts` | **Happy Path:** Tạo bài viết mới thành công. | `payload`: `{ content: '...', tags: [...], category: '...' }` | Trả về HTTP Status `201 Created` chứa bài viết vừa tạo. |
| **FTC-FORUM-003** | Functional / E2E | `POST /forum/posts` | **Edge Case:** Tạo bài viết thất bại do content trống. | `payload`: `{ tags: [...] }` | Trả về HTTP Status `400 Bad Request`. |
| **FTC-FORUM-004** | Functional / E2E | `GET /forum/posts/my-posts` | **Happy Path:** Lấy danh sách bài viết của bản thân. | Headers: `Authorization: Bearer <token>` | Trả về HTTP Status `200 OK` chứa danh sách bài viết của user. |
| **FTC-FORUM-005** | Functional / E2E | `GET /forum/posts/:id` | **Happy Path:** Lấy chi tiết bài viết theo ID. | `:id`: UUID của bài viết | Trả về HTTP Status `200 OK` chứa chi tiết bài viết. |
| **FTC-FORUM-006** | Functional / E2E | `PUT /forum/posts/:id` | **Happy Path:** Cập nhật nội dung bài viết. | `:id`: UUID, `payload`: `{ content: '...' }` | Trả về HTTP Status `200 OK` chứa bài viết đã cập nhật. |
| **FTC-FORUM-007** | Functional / E2E | `POST /forum/posts/:id/vote` | **Happy Path:** Thực hiện bình chọn (UP) cho bài viết thành công. | `:id`: UUID, `payload`: `{ type: 'up' }` | Trả về HTTP Status `201 Created` và thông điệp thành công. |
| **FTC-FORUM-008** | Functional / E2E | `POST /forum/posts/:id/vote` | **Edge Case:** Bình chọn thất bại do type không hợp lệ. | `:id`: UUID, `payload`: `{ type: 'INVALID' }` | Trả về HTTP Status `400 Bad Request`. |
| **FTC-FORUM-009** | Functional / E2E | `POST /forum/posts/ai-enhance` | **Happy Path:** Tối ưu nội dung bài viết nháp bằng AI. | `payload`: `{ content: '...' }` | Trả về HTTP Status `201 Created` chứa nội dung đã tối ưu. |
| **FTC-FORUM-010** | Functional / E2E | `GET /forum/posts/:id/comments` | **Happy Path:** Lấy danh sách bình luận của bài viết. | `:id`: UUID | Trả về HTTP Status `200 OK` chứa danh sách bình luận. |
| **FTC-FORUM-011** | Functional / E2E | `POST /forum/posts/:id/comments` | **Happy Path:** Thêm bình luận mới cho bài viết. | `:id`: UUID, `payload`: `{ content: '...' }` | Trả về HTTP Status `201 Created` chứa bình luận đã tạo. |
| **FTC-FORUM-012** | Functional / E2E | `PUT /forum/comments/:id` | **Happy Path:** Sửa nội dung bình luận. | `:id`: UUID, `payload`: `{ content: '...' }` | Trả về HTTP Status `200 OK` chứa bình luận đã cập nhật. |
| **FTC-FORUM-013** | Functional / E2E | `POST /forum/comments/:id/vote` | **Happy Path:** Bình chọn (UP) cho bình luận. | `:id`: UUID, `payload`: `{ type: 'up' }` | Trả về HTTP Status `201 Created` và thông điệp thành công. |
| **FTC-FORUM-014** | Functional / E2E | `DELETE /forum/posts/:id` | **Happy Path:** Xóa mềm bài viết. | `:id`: UUID | Trả về HTTP Status `200 OK` và thông báo xóa thành công. |
| **FTC-FORUM-015** | Functional / E2E | `DELETE /forum/comments/:id` | **Happy Path:** Xóa mềm bình luận. | `:id`: UUID | Trả về HTTP Status `200 OK` và thông báo xóa thành công. |
