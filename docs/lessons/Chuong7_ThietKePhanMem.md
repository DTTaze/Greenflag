# CHƯƠNG 7: THIẾT KẾ PHẦN MỀM (SOFTWARE DESIGN)

---

## 1. Khái niệm và Vai trò
Nếu pha Phân tích (Chương 6) trả lời cho câu hỏi "Phần mềm cần làm CÁI GÌ? (What)", thì pha Thiết kế sẽ trả lời cho câu hỏi "Phần mềm sẽ được xây dựng NHƯ THẾ NÀO? (How)".

* **Định nghĩa:** Thiết kế phần mềm là quá trình chuyển đổi các yêu cầu và mô hình phân tích thành một bản vẽ kỹ thuật chi tiết (blueprint) để các lập trình viên có thể dựa vào đó viết mã nguồn.
* **Vai trò:** Đây là bước cực kỳ quan trọng để đảm bảo chất lượng phần mềm. Một thiết kế tốt sẽ giúp phần mềm dễ bảo trì, dễ mở rộng và giảm thiểu lỗi trong quá trình thực thi.

---

## 2. Các nguyên lý thiết kế cơ bản (Design Principles)
Một thiết kế phần mềm được đánh giá là tốt nếu nó tuân thủ các nguyên lý nền tảng sau:

* **Trừu tượng hóa (Abstraction):** Loại bỏ các chi tiết phức tạp, chỉ tập trung vào các đặc điểm cốt lõi của đối tượng ở mức tổng quan.
* **Mô-đun hóa (Modularity):** Chia phần mềm thành các thành phần (mô-đun) nhỏ hơn, có thể đặt tên và quản lý độc lập. Việc này giúp dễ phân công công việc và sửa lỗi.
* **Che giấu thông tin (Information Hiding):** Các thông tin và thuật toán nội bộ của một mô-đun nên được che giấu, không cho các mô-đun khác can thiệp trực tiếp. Chúng chỉ giao tiếp qua các giao diện (interfaces) được định nghĩa sẵn.
* **Độc lập chức năng (Functional Independence):** * **Độ gắn kết (Cohesion):** Phải **CAO**. Các phần tử trong cùng một mô-đun phải có mối liên hệ chặt chẽ và cùng thực hiện một nhiệm vụ duy nhất.
  * **Độ kết dính (Coupling):** Phải **THẤP**. Các mô-đun khác nhau nên có sự phụ thuộc vào nhau ít nhất có thể.

---

## 3. Các mức độ / Thành phần của Thiết kế

Quá trình thiết kế thường được chia thành 4 mức độ từ tổng quan đến chi tiết:

### 3.1. Thiết kế dữ liệu (Data / Database Design)
* Chuyển đổi mô hình thực thể (ERD) hoặc mô hình lớp dữ liệu thành các cấu trúc dữ liệu thực tế và lược đồ cơ sở dữ liệu (Database Schema).
* Đảm bảo tính toàn vẹn, tối ưu hóa truy vấn và lưu trữ dữ liệu.

### 3.2. Thiết kế kiến trúc (Architectural Design)
* Xác định cấu trúc tổng thể của phần mềm, các hệ thống con (sub-systems) và cách chúng tương tác với nhau.
* **Các phong cách kiến trúc phổ biến:**
  * Kiến trúc phân tầng (Layered Architecture).
  * Kiến trúc Model-View-Controller (MVC).
  * Kiến trúc Khách-Chủ (Client-Server).
  * Kiến trúc Microservices (Dịch vụ vi mô).

### 3.3. Thiết kế giao diện (Interface / UI Design)
* Thiết kế cách phần mềm giao tiếp với người dùng (User Interface - UI), với các hệ thống khác, và giao tiếp giữa các mô-đun bên trong.
* Trọng tâm: Tính dễ sử dụng (Usability), nhất quán, cung cấp phản hồi rõ ràng và xử lý lỗi thân thiện.

### 3.4. Thiết kế cấp thành phần / thuật toán (Component-level / Procedural Design)
* Mức độ chi tiết nhất. Chuyển đổi các cấu trúc từ thiết kế kiến trúc thành các mô tả giải thuật hoặc logic điều khiển cho từng mô-đun (thường dùng mã giả - pseudocode hoặc lưu đồ thuật toán).

---

## 4. Các phương pháp Thiết kế
* **Thiết kế hướng cấu trúc (Structured Design):** Đi đôi với phân tích hướng cấu trúc. Tập trung vào việc phân rã hệ thống dựa trên luồng dữ liệu (Data Flow).
* **Thiết kế hướng đối tượng (Object-Oriented Design - OOD):** Đi đôi với OOA. Sử dụng các mô hình UML chi tiết hơn để mô tả cách các đối tượng được cài đặt trong thực tế (Sử dụng các Design Patterns như Singleton, Factory, Observer...).

---

## 5. Đánh giá chất lượng thiết kế
Một bản thiết kế đạt chuẩn cần:
1. Thể hiện được tất cả các yêu cầu chức năng và phi chức năng đã đặc tả.
2. Dễ đọc, dễ hiểu đối với các lập trình viên và những người tham gia phát triển.
3. Cung cấp một bức tranh hoàn chỉnh về dữ liệu, chức năng và hành vi của phần mềm.