Chào bạn, tôi là Gemini. Dưới đây là file Markdown mô tả chi tiết kiến trúc và cấu trúc source code Frontend dựa trên tài liệu kỹ thuật bạn đã cung cấp. Bạn có thể copy nội dung này để lưu thành file `.md` (ví dụ: `FRONTEND_ARCHITECTURE.md`).

---

# Tài Liệu Kiến Trúc Frontend (Frontend Architecture)

Tài liệu này cung cấp cái nhìn tổng quan về kiến trúc, cách tổ chức code và các quy chuẩn phát triển cho toàn bộ các dự án frontend website (bao gồm web client và web admin). Mục tiêu chính là chuẩn hóa cách phát triển, giúp code dễ đọc, dễ bảo trì, và hỗ trợ thành viên mới onboarding hiệu quả.

(Cập nhật: Tháng 5/2026 )

---

## 1. Cấu trúc Thư mục Tổng quan

Source code được tổ chức trong thư mục `src/`, phân tách rõ ràng giữa routing, UI, business logic, API, và state management.

* 
**`app/`**: Quản lý route, layout và page theo cấu trúc App Router của Next.js.


* 
**`assets/`**: Chứa các icons dùng trong source code.


* 
**`components/`**: Chứa UI components dùng chung, hạn chế chứa business logic phức tạp.


* 
**`constants/`**: Chứa các hằng số dùng chung toàn dự án.


* 
**`helpers/`**: Chứa các hàm hỗ trợ xử lý logic hoặc format dữ liệu.


* 
**`hooks/`**: Chứa custom hooks xử lý logic cho UI hoặc tính năng (feature).


* 
**`i18n/`**: Cấu hình đa ngôn ngữ và các translation keys.


* 
**`lib/`**: Cấu hình các thư viện bên ngoài hoặc utility cấp ứng dụng.


* 
**`providers/`**: Chứa các provider bọc toàn bộ ứng dụng.


* 
**`queries/`**: Quản lý server state thông qua React Query (bao gồm hooks, mutations, query keys).


* 
**`services/`**: Nơi quản lý API services, gọi API và giao tiếp với backend.


* 
**`store/`**: Chứa global client state, sử dụng thư viện Zustand.


* 
**`styles/`**: Chứa global styles và theme styles.


* 
**`types/`**: Định nghĩa các TypeScript types dùng chung (payload, response, internal types).


* 
**`utils/`**: Chứa các utility functions thuần, có thể tái sử dụng, không phụ thuộc UI.


* 
**`proxy.ts`**: Proxy của Next.js dùng để xử lý auth guard và redirect.



---

## 2. Nguyên tắc Tổ chức và Luồng Dữ liệu (Data Flow)

Dự án tuân thủ nghiêm ngặt việc tách biệt UI khỏi business logic và API logic.

### Luồng xử lý cơ bản:

**UI Component** $\rightarrow$ **Custom Hook** $\rightarrow$ **React Query / Store** $\rightarrow$ **Service/API Layer** $\rightarrow$ **Backend API** .

### Nguyên tắc cốt lõi:

* UI component **không được** gọi API trực tiếp.


* Logic xử lý phải được tách ra các custom hooks.


* Dữ liệu API được gom vào `services/` và cache bằng React Query.


* Global client state sử dụng Zustand.


* State của form hoặc tính năng cụ thể sử dụng Context (không bọc ở toàn app).



---

## 3. Quản lý Trạng thái (State Layers)

State được chia thành 4 cấp độ rõ ràng để tối ưu hiệu năng và tránh lạm dụng công cụ:

1. 
**Server State (React Query):** Quản lý dữ liệu fetch từ backend API (ví dụ: danh sách, chi tiết dự án, profile). React Query xử lý cache, refetch và loading/error state.


2. 
**Global Client State (Zustand):** State dùng chung toàn app hoặc có tần suất update cao (ví dụ: Auth state, Global UI).


3. **Feature/Module State (Zustand/Context):** State dùng trong phạm vi nhỏ của một tính năng (ví dụ: Multi-step form). Context chỉ bọc ở phạm vi tính năng đó.


4. 
**Scoped/Local State (useState/RHF):** State cục bộ chỉ dùng trong một component (ví dụ: input tạm thời, đóng/mở dropdown).



> 
> **Lưu ý:** Setup Zustand và Context được triển khai theo **Redux Dispatch Pattern** (Action $\rightarrow$ Dispatch $\rightarrow$ Reducer $\rightarrow$ Update State) để chuẩn hóa luồng cập nhật và dễ debug.
> 
> 

---

## 4. Quản lý Form (Form Management)

Dự án sử dụng **React Hook Form** (quản lý state) và **Zod** (validate dữ liệu).

* 
**Kiến trúc Form:** Validation Schema (Zod) $\rightarrow$ Custom Hook (Logic) $\rightarrow$ Form UI Component $\rightarrow$ Reusable Components.


* 
**UI Layer:** Chỉ hiển thị giao diện, nhận state từ hook, không xử lý business logic hay validation.


* 
**Logic Layer (Hook):** Khởi tạo form, gắn schema, xử lý submit, mapping dữ liệu và quản lý side effects.


* 
**Validation Layer:** Tách biệt hoàn toàn để dễ tái sử dụng và đồng bộ type.



---

## 5. Hệ thống Kiểu dữ liệu (Type Systems)

Sử dụng TypeScript chặt chẽ, hạn chế tối đa việc sử dụng `any`. Types được phân loại theo đuôi file:

* **`.payload.ts`**: Dữ liệu gửi lên backend hoặc form values. Thường chia thành `Payload` (body request), `Params` (URL queries), và `FormValues` (local form state).


* 
**`.response.ts`**: Format dữ liệu nguyên bản trả về từ backend API.


* 
**`.type.ts`**: Internal types dùng cho UI (UI rendering, table items, options).


* 
**Generic Types**: Chuẩn hóa cấu trúc API, ví dụ `ApiResponse<T>` để tự động infer success/error response.



---

## 6. Luồng kết nối API và React Query

API được chia thành các layer độc lập để dễ bảo trì:

1. 
**API Service:** Khai báo endpoint, thực hiện HTTP request bằng axios, không có business logic .


2. 
**API Handler:** Lấy data, transform và chuẩn hóa response .


3. 
**Query Function:** Kiểm tra success/error, throw error nếu cần, trả về đúng kiểu dữ liệu cho UI .


4. 
**Query Hook:** Bọc cấu hình React Query (`staleTime`, `enabled`, `queryKey` dùng Enum) và expose ra cho UI component.



---

## 7. Kiến trúc UI Components & CRUD Pattern

### UI Components

Được xây dựng theo hướng reusable, chia thành các cấp:

* **Base UI $\rightarrow$ Shared/Common $\rightarrow$ Feature $\rightarrow$ Page**
* 
**Input Components:** Tách biệt rõ ràng giữa *UI Inputs* (chỉ hiển thị, không gắn form) và *Form Inputs* (tích hợp React Hook Form).


* **Table Architecture (Config-driven):** Tách biệt rendering engine (`DataTable`) khỏi giao diện riêng của dự án (`Project-specific Table`) và business logic (`Feature Table`). Các cột được định nghĩa qua config.



### CRUD Pattern

* Các màn hình thao tác dữ liệu được thiết kế theo hướng config-driven và feature-oriented .


* 
**Create/Edit:** Sử dụng chung các Form Sections (UI), nhưng tách biệt logic ra các custom hooks (`useCreate`, `useEdit`) vì luồng xử lý khác nhau. Dữ liệu form luôn đi qua **Transformation Layer** trước khi gọi API.


* 
**Delete:** Xử lý trực tiếp tại action component của từng row (quản lý modal, gọi API, refetch độc lập).



---

## 8. Luồng Xác thực (Authentication)

Authentication được quản lý tập trung (centralized):

* 
**Lưu trữ:** Access token lưu trong Cookie và tự động đính kèm vào Axios interceptor.


* 
**Profile API:** Là critical API; nếu fetch thất bại, session coi như invalid và tự động logout.


* 
**Logout Flow:** Khi logout, hệ thống sẽ thực hiện: Clear Cookie $\rightarrow$ Clear React Query Cache $\rightarrow$ Reset Zustand $\rightarrow$ Reload App .


* 
**Proxy:** Bảo vệ các Protected Routes và điều hướng các Public Routes trực tiếp từ Next.js proxy.


* 
**Lỗi 401:** Axios Interceptor tự động bắt lỗi 401 để xử lý logout đồng bộ toàn app.