# CHƯƠNG 2: QUY TRÌNH PHẦN MỀM (SOFTWARE PROCESS)

---

## 1. Khái niệm Quy trình phần mềm

**Quy trình phần mềm (Software Process)** là một tập hợp có tổ chức các hoạt động, hành động và tác vụ cần thiết để xây dựng một sản phẩm phần mềm chất lượng cao. 
* Thay vì lập trình theo bản năng, quy trình cung cấp một "lộ trình" giúp các nhóm phát triển phối hợp hiệu quả, kiểm soát tiến độ và đảm bảo sản phẩm đáp ứng đúng yêu cầu.
* Một quy trình tốt không bóp nghẹt sự sáng tạo mà tạo ra một nền tảng ổn định để sự sáng tạo được phát huy.

---

## 2. Các hoạt động khung (Framework Activities)

Bất kể dự án phần mềm có quy mô hay độ phức tạp thế nào, một quy trình chuẩn luôn bao gồm 5 hoạt động khung cơ bản (theo mô hình của Roger S. Pressman):

1. **Giao tiếp (Communication):** Giao tiếp với khách hàng và các bên liên quan để hiểu rõ mục tiêu dự án và thu thập yêu cầu hệ thống.
2. **Lập kế hoạch (Planning):** Tạo ra một "bản đồ" cho dự án, xác định các rủi ro, ước lượng tài nguyên cần thiết, phân chia công việc và lên lịch trình.
3. **Mô hình hóa (Modeling):** Tạo ra các mô hình (phân tích và thiết kế) để nhà phát triển và khách hàng hình dung rõ hơn về cấu trúc, dữ liệu và kiến trúc của phần mềm trước khi viết code.
4. **Xây dựng (Construction):** Kết hợp việc sinh mã (coding) và kiểm thử (testing) để phát hiện và loại bỏ lỗi.
5. **Triển khai (Deployment):** Phần mềm (hoặc một phần của nó) được giao cho khách hàng để họ đánh giá và cung cấp phản hồi (feedback).

---

## 3. Các hoạt động bảo vệ (Umbrella Activities)

Bên cạnh 5 hoạt động khung diễn ra theo trình tự, quy trình phần mềm còn có các **hoạt động bảo vệ** diễn ra xuyên suốt toàn bộ vòng đời của dự án để kiểm soát chất lượng và sự thay đổi:

* **Quản lý dự án phần mềm (Software Project Tracking and Control):** Giám sát tiến độ so với kế hoạch và thực hiện điều chỉnh nếu cần.
* **Quản lý rủi ro (Risk Management):** Đánh giá và kiểm soát các yếu tố có thể làm hỏng dự án.
* **Đảm bảo chất lượng phần mềm (Software Quality Assurance - SQA):** Các hoạt động đánh giá để đảm bảo sản phẩm đạt tiêu chuẩn chất lượng.
* **Đánh giá kỹ thuật chính thức (Formal Technical Reviews):** Đánh giá các sản phẩm công việc (tài liệu, code) để tìm và sửa lỗi sớm.
* **Quản lý cấu hình phần mềm (Software Configuration Management - SCM):** Quản lý các thay đổi của mã nguồn và tài liệu trong suốt dự án.
* **Chuẩn bị và sản xuất tài liệu (Work Product Preparation and Production):** Tạo ra các tài liệu hỗ trợ, log files, và biểu mẫu.

---

## 4. Các luồng quy trình (Process Flows)

Cách thức 5 hoạt động khung được sắp xếp theo thời gian gọi là luồng quy trình:
* **Luồng tuyến tính (Linear process flow):** Thực hiện tuần tự từ Giao tiếp đến Triển khai.
* **Luồng lặp (Iterative process flow):** Lặp lại một hoặc nhiều hoạt động trước khi chuyển sang bước tiếp theo.
* **Luồng tiến hóa (Evolutionary process flow):** Thực hiện các hoạt động theo vòng tròn, mỗi vòng tạo ra một phiên bản phần mềm hoàn thiện hơn.
* **Luồng song song (Parallel process flow):** Thực hiện đồng thời một số hoạt động (ví dụ: vừa thiết kế module này vừa xây dựng module khác).

---

## 5. Đánh giá và Cải tiến Quy trình (Process Assessment and Improvement)

Sự tồn tại của quy trình không đảm bảo phần mềm sẽ được giao đúng hạn. Quy trình cần được đánh giá định kỳ để tìm ra điểm yếu và cải thiện. Các tiêu chuẩn phổ biến bao gồm:
* **CMMI (Capability Maturity Model Integration):** Đánh giá mức độ trưởng thành của quy trình tổ chức theo 5 cấp độ (từ Initial đến Optimizing).
* **ISO 9001:2000:** Tiêu chuẩn chung về quản lý chất lượng áp dụng được cho phần mềm.
* **SPICE (ISO/IEC 15504):** Đánh giá năng lực của quy trình phần mềm.