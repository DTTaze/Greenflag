# CHƯƠNG 1: TỔNG QUAN VỀ CÔNG NGHỆ PHẦN MỀM (SOFTWARE ENGINEERING OVERVIEW)

---

## 1. Các khái niệm cơ bản

### 1.1 Phần mềm (Software) là gì?
Phần mềm không chỉ là các dòng code. Nó bao gồm một tập hợp hoàn chỉnh các yếu tố:
* **Chương trình máy tính (Computer programs):** Các tập lệnh thực thi chức năng mong muốn.
* **Cấu trúc dữ liệu (Data structures):** Cho phép chương trình thao tác với thông tin một cách hợp lý.
* **Tài liệu (Documentation):** Mô tả thao tác, cách sử dụng và cấu trúc của hệ thống.

### 1.2 Công nghệ phần mềm (Software Engineering) là gì?
Theo chuẩn IEEE, Công nghệ phần mềm là việc áp dụng một cách tiếp cận có hệ thống, có kỷ luật và định lượng được cho việc phát triển, vận hành và bảo trì phần mềm.

Nói cách khác, đây là một ngành kỹ thuật kết hợp giữa khoa học máy tính, toán học và quản trị dự án để tạo ra các phần mềm chất lượng cao, đúng hạn và nằm trong ngân sách cho phép.

---

## 2. Đặc trưng và sự khác biệt của Phần mềm

Khác với các sản phẩm cơ khí hay phần cứng (Hardware), phần mềm có những đặc điểm độc nhất:
* **Phần mềm được phát triển (developed/engineered), không phải được chế tạo (manufactured):** Không có dây chuyền lắp ráp vật lý.
* **Phần mềm không bị "hao mòn" (doesn't wear out):** Phần cứng sẽ bị suy giảm chất lượng theo thời gian do ma sát, nhiệt độ (tỷ lệ lỗi tăng dần theo hình bồn tắm - Bathtub curve). Phần mềm không bị ảnh hưởng bởi môi trường vật lý, nhưng sẽ bị "lỗi thời" do thay đổi yêu cầu hoặc môi trường hệ thống.
* **Được xây dựng theo yêu cầu cụ thể (Custom-built):** Dù hiện nay có nhiều thư viện và thành phần tái sử dụng (component-based), phần lớn các phần mềm vẫn được tùy biến để giải quyết các bài toán đặc thù.

---

## 3. Khủng hoảng phần mềm (Software Crisis)

Đây là thuật ngữ ra đời vào cuối thập niên 1960 để chỉ những khó khăn nghiêm trọng trong việc viết các phần mềm lớn và phức tạp.
* **Biểu hiện:** Dự án trễ hạn, vượt ngân sách, phần mềm làm ra chất lượng kém, không đáp ứng đúng yêu cầu khách hàng, hoặc mã nguồn "rối như tơ vò" (spaghetti code) không thể bảo trì.
* **Nguyên nhân:** Sự phát triển quá nhanh của sức mạnh phần cứng làm nảy sinh các yêu cầu phần mềm phức tạp hơn, trong khi phương pháp lập trình thủ công cũ không còn đáp ứng được.
* **Giải pháp:** Sự ra đời của ngành **Công nghệ phần mềm** chính là để giải quyết cuộc khủng hoảng này thông qua các quy trình, phương pháp và công cụ chuẩn hóa.

---

## 4. Các tầng của Công nghệ phần mềm (Layered Technology)

Công nghệ phần mềm được xây dựng dựa trên 4 tầng nền tảng:
1. **Trọng tâm chất lượng (A Quality Focus):** Tầng nền móng. Mọi dự án phần mềm đều phải hướng tới việc đảm bảo chất lượng.
2. **Quy trình (Process):** Chất kết dính các tầng lại với nhau. Xác định "ai làm gì, khi nào, và làm như thế nào" (ví dụ: Agile, Waterfall).
3. **Phương pháp (Methods):** Cung cấp các kỹ thuật chi tiết để xây dựng phần mềm (ví dụ: phương pháp phân tích yêu cầu, thiết kế hướng đối tượng, kỹ thuật kiểm thử).
4. **Công cụ (Tools):** Các phần mềm hỗ trợ tự động hoặc bán tự động cho quy trình và phương pháp (ví dụ: Git, Jira, IDEs, Docker).

---

## 5. Phân loại phần mềm

Phần mềm hiện đại được chia thành nhiều miền ứng dụng khác nhau:
* **Phần mềm hệ thống (System Software):** Hệ điều hành (Windows, Linux), trình biên dịch.
* **Phần mềm ứng dụng (Application Software):** Microsoft Office, các hệ thống quản lý doanh nghiệp.
* **Phần mềm khoa học & kỹ thuật (Engineering/Scientific Software):** CAD/CAM, phần mềm mô phỏng vật lý, dự báo thời tiết.
* **Phần mềm nhúng (Embedded Software):** Code chạy trong lò vi sóng, hệ thống chống bó cứng phanh (ABS) của ô tô.
* **Phần mềm ứng dụng Web (Web/Mobile Apps):** Mạng xã hội, ứng dụng thương mại điện tử.
* **Phần mềm Trí tuệ nhân tạo (AI Software):** Hệ thống chuyên gia, nhận dạng hình ảnh, mạng nơ-ron nhân tạo, LLMs.