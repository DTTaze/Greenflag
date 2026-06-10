# CHƯƠNG 5: KỸ NGHỆ YÊU CẦU (REQUIREMENTS ENGINEERING)

---

## 1. Khái niệm và Tầm quan trọng
**Kỹ nghệ yêu cầu** là quá trình xác định, tài liệu hóa và quản lý các yêu cầu của hệ thống. 
Yêu cầu phần mềm là những tính năng, đặc điểm và rào cản mà hệ thống phải đáp ứng để giải quyết bài toán của khách hàng. Việc xác định sai yêu cầu ngay từ đầu là nguyên nhân hàng đầu dẫn đến sự thất bại, đội vốn và trễ hạn của các dự án phần mềm.

---

## 2. Phân loại Yêu cầu
Yêu cầu hệ thống thường được chia thành hai nhóm chính:

* **Yêu cầu chức năng (Functional Requirements):** Mô tả những hành động mà hệ thống PHẢI LÀM. Định nghĩa các đầu vào, đầu ra và quá trình xử lý (Ví dụ: Hệ thống phải cho phép người dùng thêm sản phẩm vào giỏ hàng, gửi email đặt lại mật khẩu).
* **Yêu cầu phi chức năng (Non-functional Requirements):** Mô tả CÁCH hệ thống hoạt động hoặc các tiêu chuẩn chất lượng mà hệ thống phải đạt được (Ví dụ: Thời gian tải trang dưới 2 giây, hệ thống có thể chịu tải 10.000 người dùng cùng lúc, bảo mật dữ liệu theo chuẩn ISO).

---

## 3. Quy trình Kỹ nghệ yêu cầu
Quy trình này là một chuỗi các hoạt động lặp đi lặp lại, thường bao gồm các bước cốt lõi sau:

1. **Khởi đầu (Inception):** Xác định sự cần thiết của dự án, nhận diện các bên liên quan (Stakeholders) và đánh giá tính khả thi.
2. **Khảo sát và Thu thập (Elicitation):** Làm việc trực tiếp với khách hàng và người dùng để tìm hiểu nhu cầu thực sự của họ.
3. **Phân tích và Thương lượng (Elaboration & Negotiation):** Phân tích sự hợp lý, làm rõ các yêu cầu mâu thuẫn, ưu tiên các tính năng quan trọng và đàm phán giới hạn (phạm vi) của dự án.
4. **Đặc tả (Specification):** Chuyển đổi các yêu cầu đã thu thập thành tài liệu chính thức, mô hình hoặc mã giả.
5. **Thẩm định (Validation):** Đánh giá lại tài liệu đặc tả cùng khách hàng và đội phát triển để đảm bảo tính chính xác, đầy đủ và khả thi.
6. **Quản lý yêu cầu (Requirements Management):** Kiểm soát, theo dõi và quản lý các thay đổi của yêu cầu trong suốt vòng đời dự án.

---

## 4. Các kỹ thuật thu thập yêu cầu phổ biến
Để lấy được yêu cầu chính xác từ khách hàng, Kỹ sư phần mềm thường sử dụng các phương pháp:

* **Phỏng vấn (Interviews):** Trao đổi trực tiếp (1-1 hoặc nhóm) với khách hàng/người dùng cuối.
* **Quan sát (Observation):** Theo dõi cách người dùng làm việc trong môi trường thực tế của họ để tìm ra các vấn đề ẩn giấu.
* **Bảng câu hỏi (Questionnaires):** Sử dụng khảo sát để thu thập ý kiến từ một tập hợp người dùng lớn.
* **Nguyên mẫu (Prototyping):** Xây dựng các bản nháp giao diện (mockups/wireframes) để khách hàng dễ hình dung sản phẩm và cung cấp phản hồi sớm.
* **Use Case:** Mô hình hóa các tình huống tương tác cụ thể giữa người dùng (Actor) và hệ thống.

---

## 5. Tài liệu Đặc tả Yêu cầu (SRS)
Tài liệu Đặc tả Yêu cầu Phần mềm (Software Requirements Specification - SRS) đóng vai trò như bản hợp đồng kỹ thuật giữa nhóm phát triển và khách hàng. Một tài liệu SRS chất lượng cần đáp ứng các tiêu chí:

* **Chính xác (Accurate):** Rõ ràng, không gây hiểu lầm hay mơ hồ.
* **Hoàn chỉnh (Complete):** Không bỏ sót các chức năng hoặc ràng buộc quan trọng.
* **Nhất quán (Consistent):** Không chứa các yêu cầu mâu thuẫn, xung đột với nhau.
* **Có thể kiểm chứng (Testable):** Mọi yêu cầu đều phải có tiêu chí rõ ràng để tester có thể viết kịch bản kiểm thử (test case) sau này.