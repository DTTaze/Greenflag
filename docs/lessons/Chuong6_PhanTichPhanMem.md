# CHƯƠNG 6: PHÂN TÍCH PHẦN MỀM (SOFTWARE ANALYSIS)

---

## 1. Khái niệm và Mục tiêu
**Phân tích phần mềm** là giai đoạn ngay sau khi hoàn thành việc thu thập yêu cầu. Nếu Kỹ nghệ yêu cầu (Chương 5) trả lời cho câu hỏi "Phần mềm cần làm cái gì? (What)", thì pha Phân tích sẽ bắt đầu định hình "Cấu trúc lô-gic của hệ thống ra sao?".

* **Mục tiêu:** Hiểu rõ và làm mịn các yêu cầu, phát hiện những điểm chưa hợp lý, và tạo ra các **mô hình phân tích (Analysis Models)** đóng vai trò làm cầu nối giữa ngôn ngữ của khách hàng (nghiệp vụ) và ngôn ngữ của đội ngũ lập trình (kỹ thuật).

---

## 2. Các phương pháp Phân tích chính
Trong Công nghệ phần mềm, có 2 phương pháp tiếp cận kinh điển để phân tích hệ thống:

### 2.1. Phân tích hướng cấu trúc (Structured Analysis)
Phương pháp này coi dữ liệu và các quy trình xử lý dữ liệu là hai thành phần tách biệt. 
* Trọng tâm là luồng thông tin: Dữ liệu đầu vào đi qua các quá trình biến đổi nào để tạo ra đầu ra?
* Sử dụng chủ yếu: Biểu đồ luồng dữ liệu (DFD), Biểu đồ thực thể - mối quan hệ (ERD).

### 2.2. Phân tích hướng đối tượng (Object-Oriented Analysis - OOA)
Đây là phương pháp phổ biến nhất hiện nay. Nó kết hợp dữ liệu và các hàm xử lý dữ liệu vào trong một thực thể duy nhất gọi là **Đối tượng (Object)**.
* Trọng tâm là xác định các thực thể (classes/objects) và cách chúng tương tác với nhau để hoàn thành một Use Case của người dùng.
* Sử dụng chủ yếu: Ngôn ngữ mô hình hóa thống nhất (UML - Unified Modeling Language).

---

## 3. Các mô hình cốt lõi trong Phân tích (Theo Hướng cấu trúc)

Nếu áp dụng phương pháp phân tích truyền thống, kỹ sư phần mềm sẽ xây dựng 3 loại mô hình cốt lõi:

1. **Mô hình Dữ liệu (Data Modeling):** * Công cụ: Biểu đồ Thực thể - Mối quan hệ (ERD - Entity Relationship Diagram).
   * Đặc tả các đối tượng dữ liệu (Data Objects), các thuộc tính (Attributes) của chúng và định nghĩa các mối quan hệ (Relationships) giữa các đối tượng này (ví dụ: quan hệ 1-1, 1-nhiều, nhiều-nhiều).

2. **Mô hình Chức năng / Luồng thông tin (Functional/Information Flow Modeling):**
   * Công cụ: Biểu đồ Luồng dữ liệu (DFD - Data Flow Diagram).
   * Biểu diễn cách dữ liệu di chuyển qua hệ thống. DFD bao gồm: Thực thể ngoài, Quá trình xử lý, Kho dữ liệu, và Luồng dữ liệu. DFD thường được phân rã từ tổng quan đến chi tiết (Level 0 - Context Diagram, Level 1, Level 2...).

3. **Mô hình Hành vi (Behavioral Modeling):**
   * Công cụ: Biểu đồ Chuyển trạng thái (STD - State Transition Diagram).
   * Chỉ ra cách hệ thống phản ứng lại với các sự kiện bên ngoài. (Ví dụ: Trạng thái của một đơn hàng trên Shopee chuyển từ "Chờ xác nhận" sang "Đang giao" hay "Đã hủy" theo các hành động nào).

---

## 4. Mô hình hóa Phân tích Hướng đối tượng (Sử dụng UML)

Trong kỷ nguyên phát triển phần mềm hiện đại, việc phân tích thường gắn liền với bộ biểu đồ UML. Các biểu đồ quan trọng nhất trong pha phân tích bao gồm:

* **Biểu đồ Use Case (Use Case Diagram):** Cung cấp cái nhìn tổng quan về các chức năng chính của hệ thống và những ai sử dụng chức năng đó (Actors).
* **Biểu đồ Lớp (Class Diagram) - Mức phân tích:** Xác định các lớp thực thể (Entity classes), lớp biên (Boundary classes) và lớp điều khiển (Control classes), cùng với các thuộc tính và các mối quan hệ cốt lõi (Kế thừa, Kết hợp, Tập hợp).
* **Biểu đồ Hoạt động (Activity Diagram):** Mô tả chi tiết luồng công việc (workflow) hoặc các bước thực thi từ khi bắt đầu đến khi kết thúc của một Use Case.
* **Biểu đồ Tuần tự (Sequence Diagram):** Trình bày cách các đối tượng tương tác, truyền thông điệp (messages) cho nhau theo thứ tự thời gian để thực hiện một chức năng cụ thể.

---

## 5. Từ Phân tích đến Thiết kế
Kết quả cuối cùng của pha phân tích là một tập hợp các tài liệu và mô hình logic chặt chẽ. Cấu trúc này làm "đầu vào" (input) trực tiếp cho pha **Thiết kế phần mềm (Software Design)** ở chương tiếp theo, đảm bảo kiến trúc và cơ sở dữ liệu được xây dựng đúng với ý đồ hệ thống ban đầu.