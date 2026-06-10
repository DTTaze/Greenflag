# CHƯƠNG 8: THIẾT KẾ DỮ LIỆU (DATA DESIGN)

---

## 1. Khái niệm và Vai trò
Trong quá trình phát triển phần mềm, **Thiết kế dữ liệu** (hay Thiết kế cơ sở dữ liệu) là hoạt động thiết kế đầu tiên và mang tính nền tảng nhất. 
* Nếu kiến trúc phần mềm được ví như bộ khung của ngôi nhà, thì dữ liệu chính là nền móng. 
* Mục tiêu của pha này là chuyển đổi các mô hình dữ liệu mức khái niệm (đã được xây dựng ở pha Phân tích - ví dụ: biểu đồ ERD) thành các cấu trúc dữ liệu lưu trữ vật lý (Cơ sở dữ liệu) mà máy tính có thể trực tiếp xử lý và quản lý được.

---

## 2. Các cấp độ thiết kế dữ liệu
Quá trình thiết kế dữ liệu thường trải qua 3 cấp độ từ trừu tượng đến cụ thể:

### 2.1. Thiết kế mức khái niệm (Conceptual Design)
* **Đầu vào:** Yêu cầu nghiệp vụ của khách hàng thu thập được ở Chương 5.
* **Công việc:** Xác định các Thực thể (Entities), Thuộc tính (Attributes) và Mối quan hệ (Relationships) cốt lõi mà không phụ thuộc vào bất kỳ Hệ quản trị cơ sở dữ liệu (DBMS) cụ thể nào.
* **Công cụ:** Biểu đồ Thực thể - Mối quan hệ (ERD - Entity Relationship Diagram).

### 2.2. Thiết kế mức logic (Logical Design)
* **Đầu vào:** Mô hình khái niệm (ERD).
* **Công việc:** Ánh xạ các thực thể và mối quan hệ thành các bảng (Tables) trong mô hình dữ liệu quan hệ. Ở bước này, Kỹ sư phần mềm phải xác định các Khóa chính (Primary Key - PK) và Khóa ngoại (Foreign Key - FK).
* **Kết quả:** Lược đồ cơ sở dữ liệu quan hệ (Relational Schema).

### 2.3. Thiết kế mức vật lý (Physical Design)
* **Đầu vào:** Lược đồ mức logic.
* **Công việc:** Cài đặt cấu trúc dữ liệu lên một Hệ quản trị CSDL cụ thể (ví dụ: MySQL, SQL Server, Oracle, PostgreSQL). 
* **Chi tiết:** Lựa chọn kiểu dữ liệu (Data types) chính xác cho từng trường dữ liệu, tạo chỉ mục (Index) để tối ưu thời gian truy vấn, và thiết lập các ràng buộc toàn vẹn (Constraints/Triggers).

---

## 3. Chuẩn hóa dữ liệu (Data Normalization)
Đây là kỹ thuật cốt lõi trong thiết kế dữ liệu nhằm tổ chức các bảng trong CSDL sao cho giảm thiểu sự dư thừa dữ liệu (Data Redundancy) và tránh các "dị thường" (anomalies) khi thêm, sửa, xóa dữ liệu.
Các dạng chuẩn (Normal Forms - NF) phổ biến nhất:

* **Dạng chuẩn 1 (1NF):** Dữ liệu trong mỗi cột phải là nguyên tố (đơn trị, không thể chia nhỏ hơn). Tuyệt đối không có nhóm thuộc tính lặp lại trong một bảng.
* **Dạng chuẩn 2 (2NF):** Phải đạt 1NF và mọi thuộc tính không khóa phải phụ thuộc hoàn toàn vào toàn bộ khóa chính (chỉ thực sự cần xem xét khi bảng có khóa chính kết hợp từ nhiều cột).
* **Dạng chuẩn 3 (3NF):** Phải đạt 2NF và không có sự phụ thuộc bắc cầu (transitive dependency) giữa các thuộc tính không khóa (nghĩa là một thuộc tính không khóa không được suy ra từ một thuộc tính không khóa khác).

---

## 4. Các nguyên lý thiết kế dữ liệu phần mềm
Để có một thiết kế dữ liệu tốt, người kỹ sư cần tuân thủ các nguyên tắc sau:

1. **Phân tích có hệ thống:** Áp dụng các phương pháp phân tích bài bản đối với dữ liệu giống như cách phân tích chức năng của phần mềm.
2. **Từ điển dữ liệu (Data Dictionary):** Luôn phải xây dựng và duy trì một từ điển dữ liệu để định nghĩa rõ ràng ý nghĩa, kiểu dữ liệu, giới hạn và định dạng của mọi thành phần dữ liệu trong hệ thống.
3. **Che giấu thông tin (Information Hiding):** Việc thiết kế cấu trúc dữ liệu cấp thấp (cách lưu trữ mảng, danh sách...) nên được che giấu đằng sau các giao diện (interfaces/APIs) để các mô-đun chức năng khác không can thiệp và làm hỏng dữ liệu trực tiếp.
4. **Tối ưu hóa cấu trúc:** Lựa chọn đúng cấu trúc dữ liệu (mảng, danh sách liên kết, cây...) cho từng bài toán để tối ưu hóa không gian lưu trữ bộ nhớ và tốc độ thực thi thuật toán.