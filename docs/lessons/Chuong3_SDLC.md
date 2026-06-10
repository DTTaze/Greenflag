# CHƯƠNG 3: MÔ HÌNH VÒNG ĐỜI PHÁT TRIỂN PHẦN MỀM (SDLC)

---

## 1. Khái niệm SDLC (Software Development Life Cycle)

**Vòng đời phát triển phần mềm (SDLC)** là một khung quy trình (framework) định nghĩa các bước tiêu chuẩn cần thiết để thiết kế, phát triển, kiểm thử và triển khai một phần mềm. 

Mục tiêu của SDLC là cung cấp một cấu trúc chuẩn hóa giúp đội ngũ phát triển tạo ra phần mềm chất lượng cao, đáp ứng đúng yêu cầu của khách hàng trong khoảng thời gian và chi phí cho phép.

### Các giai đoạn cơ bản trong một SDLC:
* **Khởi tạo và Thu thập yêu cầu (Requirements Gathering):** Xác định phần mềm cần làm gì.
* **Phân tích (Analysis):** Đánh giá tính khả thi và tài liệu hóa các yêu cầu.
* **Thiết kế (Design):** Lên bản vẽ kiến trúc hệ thống và giao diện.
* **Xây dựng/Lập trình (Coding/Implementation):** Viết mã nguồn.
* **Kiểm thử (Testing):** Tìm và sửa lỗi đảm bảo phần mềm chạy đúng.
* **Triển khai (Deployment):** Cài đặt phần mềm vào môi trường thực tế của người dùng.
* **Bảo trì (Maintenance):** Nâng cấp, sửa lỗi phát sinh trong quá trình sử dụng.

---

## 2. Các mô hình vòng đời phần mềm phổ biến

Trong Công nghệ phần mềm, không có một mô hình nào là hoàn hảo cho mọi dự án. Việc lựa chọn mô hình phụ thuộc vào tính chất dự án, yêu cầu khách hàng và nguồn lực của đội ngũ.

### 2.1 Mô hình Thác nước (Waterfall Model)
Đây là mô hình lâu đời và mang tính tuyến tính khắt khe nhất. Quá trình phát triển chảy theo một hướng duy nhất (như thác nước) qua các pha cơ bản.
* **Đặc điểm:** Giai đoạn sau chỉ được bắt đầu khi giai đoạn trước đã hoàn thành và được phê duyệt.
* **Ưu điểm:** Dễ quản lý, tiến độ rõ ràng, tài liệu được chuẩn bị đầy đủ ở từng bước.
* **Nhược điểm:** Rất khó và tốn kém nếu muốn thay đổi yêu cầu khi dự án đang ở giai đoạn code hoặc test; khách hàng phải đợi đến cuối dự án mới thấy được sản phẩm.

### 2.2 Mô hình chữ V (V-Model)
Được coi là sự mở rộng của mô hình Thác nước, nhưng tập trung mạnh mẽ hơn vào khâu kiểm thử.
* **Đặc điểm:** Mỗi giai đoạn phát triển (nhánh trái của chữ V) đều có một giai đoạn kiểm thử tương ứng (nhánh phải của chữ V).
* **Ưu điểm:** Chất lượng phần mềm cao, lỗi được lên kế hoạch tìm kiếm ngay từ khâu lấy yêu cầu và thiết kế.
* **Nhược điểm:** Thiếu linh hoạt, khó phản ứng với những thay đổi về mặt yêu cầu.

### 2.3 Mô hình Xoắn ốc (Spiral Model)
Kết hợp giữa tính lặp đi lặp lại của mô hình prototype và sự kiểm soát chặt chẽ của mô hình Thác nước, với trọng tâm là phân tích rủi ro.
* **Đặc điểm:** Phát triển theo nhiều vòng lặp xoắn ốc. Mỗi vòng lặp đều trải qua 4 góc phần tư: Lập kế hoạch, Phân tích rủi ro, Kỹ thuật (phát triển) và Đánh giá.
* **Ưu điểm:** Cực kỳ hiệu quả cho các dự án lớn, phức tạp, chưa rõ ràng yêu cầu từ đầu; kiểm soát rủi ro tuyệt vời.
* **Nhược điểm:** Mô hình phức tạp, chi phí quản lý rủi ro cao, đòi hỏi đội ngũ chuyên gia phân tích rủi ro giỏi.

### 2.4 Mô hình Agile (Phát triển linh hoạt)
Đây là tư duy phát triển phần mềm hiện đại và phổ biến nhất hiện nay (với các framework như Scrum, Kanban).
* **Đặc điểm:** Chia dự án thành các chu kỳ ngắn (Sprint, thường từ 2-4 tuần). Cuối mỗi chu kỳ, một phần mềm có thể chạy được (increment) sẽ được giao cho khách hàng.
* **Ưu điểm:** Cực kỳ linh hoạt trước các thay đổi, khách hàng nhận được giá trị sớm và liên tục, đề cao giao tiếp trực tiếp.
* **Nhược điểm:** Tài liệu thường bị xem nhẹ, khó đánh giá chính xác tổng chi phí và thời gian ngay từ ban đầu.

---

## 3. Bảng so sánh nhanh các mô hình

| Yếu tố đánh giá | Thác nước (Waterfall) | Chữ V (V-Model) | Xoắn ốc (Spiral) | Linh hoạt (Agile) |
| :--- | :--- | :--- | :--- | :--- |
| **Sự thay đổi yêu cầu** | Rất khó khăn | Khó khăn | Dễ dàng quản lý | Rất linh hoạt |
| **Tập trung chính** | Tài liệu, Kế hoạch | Kiểm thử (Testing) | Quản trị rủi ro | Giao sản phẩm nhanh |
| **Sự tham gia của KH** | Ban đầu và cuối dự án | Ban đầu và cuối dự án | Đánh giá qua mỗi vòng | Liên tục trong dự án |
| **Quy mô dự án phù hợp** | Nhỏ, yêu cầu tĩnh | Nhỏ-Vừa, rủi ro cao | Lớn, cực kỳ phức tạp | Mọi quy mô, thay đổi nhanh|
