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
