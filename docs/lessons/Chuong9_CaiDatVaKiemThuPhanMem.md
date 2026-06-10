# CHƯƠNG 9: CÀI ĐẶT VÀ KIỂM THỬ PHẦN MỀM (IMPLEMENTATION & TESTING)

---

## 1. Cài đặt phần mềm (Implementation / Coding)
Đây là giai đoạn chuyển đổi các bản thiết kế phần mềm (từ Chương 7 và 8) thành các dòng mã lệnh thực thi (source code) bằng một ngôn ngữ lập trình cụ thể.
* **Mục tiêu:** Viết ra mã nguồn dễ đọc, dễ hiểu, dễ bảo trì và tối ưu hiệu suất.
* **Tiêu chuẩn mã hóa (Coding Standards):** Đội ngũ phát triển cần tuân thủ các quy tắc chung về cách đặt tên biến/hàm, cách thụt lề, và cách viết chú thích (comments) để đảm bảo tính nhất quán trong toàn bộ dự án.

---

## 2. Tổng quan về Kiểm thử phần mềm (Software Testing)
Kiểm thử là quá trình thực thi một chương trình với mục đích **tìm ra lỗi (bugs)**. 
* Một ca kiểm thử (Test Case) thành công là ca phát hiện ra một lỗi chưa từng được biết đến.
* Kiểm thử không thể chứng minh rằng phần mềm hoàn toàn không có lỗi, nó chỉ có thể chứng minh sự tồn tại của lỗi trong hệ thống.
* Việc phát hiện và sửa lỗi càng sớm (ngay từ khâu lấy yêu cầu, thiết kế hoặc code) thì chi phí khắc phục càng rẻ so với khi phần mềm đã đến tay khách hàng.

---

## 3. Các kỹ thuật kiểm thử cốt lõi
Có hai cách tiếp cận chính để thiết kế các kịch bản kiểm thử:

* **Kiểm thử hộp đen (Black-box Testing):** Bỏ qua cấu trúc code bên trong, chỉ tập trung vào việc kiểm tra các chức năng của phần mềm. Người kiểm thử nhập đầu vào (Input) và kiểm tra xem đầu ra (Output) có đúng như mong đợi hay không.
* **Kiểm thử hộp trắng (White-box Testing):** Dựa vào việc hiểu rõ cấu trúc mã nguồn bên trong. Người kiểm thử sẽ thiết kế các test case để đảm bảo mọi nhánh điều kiện (if/else), mọi vòng lặp (for/while) trong đoạn code đều được chạy qua ít nhất một lần.

---

## 4. Các cấp độ kiểm thử
Quá trình kiểm thử thường được thực hiện từ mức độ nhỏ nhất đến lớn nhất để dễ dàng khoanh vùng lỗi:

* **Kiểm thử đơn vị (Unit Testing):** Kiểm tra từng thành phần, từng hàm hoặc lớp (class) nhỏ nhất một cách độc lập. Thường do chính lập trình viên thực hiện.
* **Kiểm thử tích hợp (Integration Testing):** Ghép nối các đơn vị đã test lại với nhau và kiểm tra xem chúng có giao tiếp, truyền dữ liệu đúng chuẩn hay không.
* **Kiểm thử hệ thống (System Testing):** Kiểm tra toàn bộ phần mềm đã được lắp ráp hoàn chỉnh trong một môi trường giả lập giống với thực tế để đánh giá các yêu cầu chức năng và phi chức năng (hiệu năng, bảo mật, chịu tải).
* **Kiểm thử chấp nhận (Acceptance Testing):** Được thực hiện bởi khách hàng hoặc người dùng cuối để quyết định xem phần mềm có đáp ứng đúng nhu cầu nghiệp vụ của họ và sẵn sàng để đưa vào sử dụng hay chưa (thường bao gồm Alpha Testing và Beta Testing).

---

## 5. Bảng tóm tắt các cấp độ kiểm thử

| Cấp độ kiểm thử | Đối tượng thực hiện | Mục tiêu chính | Kỹ thuật chủ đạo |
| :--- | :--- | :--- | :--- |
| **Đơn vị (Unit)** | Lập trình viên | Đảm bảo code chạy đúng logic | Hộp trắng |
| **Tích hợp (Integration)** | Lập trình viên / Tester | Đảm bảo các module kết nối đúng | Hộp trắng & Hộp đen |
| **Hệ thống (System)** | Tester độc lập | Đánh giá toàn bộ hệ thống | Hộp đen |
| **Chấp nhận (Acceptance)** | Khách hàng / Người dùng | Nghiệm thu sản phẩm thực tế | Hộp đen |