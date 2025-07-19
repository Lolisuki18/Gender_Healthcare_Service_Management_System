# HƯỚNG DẪN ÔN TẬP BẢO VỆ ĐỒ ÁN FRONTEND

## 1. TỔNG QUAN DỰ ÁN

- **Tên dự án:** Gender Healthcare Service Management System
- **Mục tiêu:** Xây dựng hệ thống quản lý dịch vụ chăm sóc sức khỏe giới tính, hỗ trợ người dùng đặt lịch tư vấn, theo dõi sức khỏe, nhắc uống thuốc, quản lý blog, đánh giá dịch vụ, v.v.
- **Công nghệ sử dụng:** ReactJS, Material-UI (MUI), Redux, React Router, Axios, Context API, Custom Hooks, PDF Export.

---

## 2. CHỨC NĂNG CHÍNH CỦA FRONTEND

- Đăng ký, đăng nhập, xác thực và làm mới token.
- Quản lý hồ sơ người dùng (Admin, Tư vấn viên, Khách hàng).
- Đặt lịch tư vấn, nhắc uống thuốc, theo dõi chu kỳ kinh nguyệt.
- Quản lý blog, câu hỏi, đánh giá, dịch vụ xét nghiệm.
- Quản lý thanh toán, xuất hóa đơn/kết quả xét nghiệm ra PDF.
- Responsive UI, hỗ trợ đa thiết bị.

### 2.1. Chức năng phụ

- Thay đổi mật khẩu, email, số điện thoại.
- Thông báo, nhắc nhở.
- Quản lý phương thức thanh toán.
- Quản lý lịch sử giao dịch.
- Quản lý quyền truy cập theo vai trò.

---

## 3. LUỒNG ĐI CHÍNH (FLOW)

- **Đăng nhập/Đăng ký:**
  1. Người dùng nhập thông tin → Gửi API → Nhận token → Lưu vào localStorage.
  2. Token được kiểm tra ở mỗi request, nếu hết hạn sẽ tự động refresh.
- **Đặt lịch tư vấn:**
  1. Người dùng chọn dịch vụ, thời gian → Gửi API đặt lịch → Nhận xác nhận.
- **Nhắc uống thuốc:**
  1. Người dùng thiết lập nhắc nhở → Lưu vào backend → Hiển thị thông báo nhắc nhở.
- **Theo dõi chu kỳ:**
  1. Người dùng nhập thông tin chu kỳ → Lưu backend → Hiển thị lịch, dự đoán ngày rụng trứng.
- **Quản lý blog, câu hỏi:**
  1. Người dùng/Quản trị viên tạo, chỉnh sửa, xóa bài viết/câu hỏi → Giao tiếp API → Cập nhật UI.
- **Thanh toán, xuất PDF:**
  1. Người dùng thanh toán dịch vụ → Nhận hóa đơn/kết quả xét nghiệm → Có thể xuất ra PDF.

---

## 4. GIẢI THÍCH CẤU TRÚC THƯ MỤC

- `src/components/`: Chứa các component chia theo chức năng:
  - `AdminProfile/`, `ConsultantProfile/`, `CustomerProfile/`, `StaffProfile/`: Giao diện từng vai trò.
  - `common/`: Component dùng chung (Header, Footer, Dialog, Card, ...).
  - `modals/`: Các modal (popup) như đổi mật khẩu, xem chi tiết, xuất PDF, ...
  - `PillReminder/`, `MenstrualCycle/`, `TestRegistration/`: Chức năng đặc thù.
  - `siderBar/`, `layouts/`: Sidebar, layout tổng thể.
- `src/pages/`: Các trang chính (Home, Login, Register, Blog, Profile, ...).
- `src/redux/`: Quản lý state toàn cục:
  - `slices/`: Chia nhỏ state theo chức năng (auth, stiTests, ...).
  - `thunks/`: Xử lý logic bất đồng bộ (gọi API, ...).
  - `middleware/`: Middleware cho Redux.
  - `store.js`: Khởi tạo store.
- `src/services/`: Giao tiếp API backend (userService, blogService, ...).
- `src/utils/`: Hàm tiện ích (dateUtils, notify, helpers, ...).
- `src/context/`: Context cho theme, user.
- `src/assets/`: Ảnh, font, style.
- `src/data/`, `src/dataDemo/`: Dữ liệu mẫu, dữ liệu tĩnh.

---

## 5. GIẢI THÍCH VỀ HOOK, REDUX, UTIL

### 5.1. Custom Hook

- **useAuthCheck:** Kiểm tra trạng thái đăng nhập, tự động refresh token nếu cần.
- **useTokenService:** Quản lý token, xử lý lưu/refresh token.
- **useSTIServicesAndPackages:** Lấy dữ liệu dịch vụ xét nghiệm và gói dịch vụ.
- **useConnectionMonitor:** Theo dõi trạng thái kết nối mạng.
- **Lợi ích:** Tái sử dụng logic, tách biệt khỏi UI, code gọn gàng.

### 5.2. Redux

- **Slices:** Chia nhỏ state, ví dụ: `authSlice` (quản lý đăng nhập), `stiTestsSlice` (quản lý xét nghiệm).
- **Thunks:** Xử lý logic bất đồng bộ như gọi API, ví dụ: `userThunks`, `stiTestsThunks`.
- **Store:** Nơi tập trung state toàn ứng dụng.
- **Middleware:** Xử lý logic trung gian, ví dụ: lưu state vào localStorage.
- **Lợi ích:** Quản lý state tập trung, dễ debug, dễ mở rộng.

### 5.3. Utils

- **dateUtils.js:** Xử lý ngày tháng (format, parse, ...).
- **notify.js:** Hiển thị thông báo cho người dùng.
- **helpers.js:** Hàm tiện ích chung.
- **imageUrl.js:** Xử lý đường dẫn ảnh.
- **localStorage.js:** Quản lý lưu trữ localStorage.
- **tokenUtils.js:** Xử lý token (decode, kiểm tra hạn, ...).

---

## 6. DANH SÁCH CÂU HỎI & TRẢ LỜI MẪU

### 6.1. Tổng quan & Kiến trúc

**Q:** Bạn hãy trình bày kiến trúc tổng thể của frontend dự án?
**A:** Dự án sử dụng ReactJS, chia component theo chức năng, sử dụng Redux quản lý state, Material-UI cho UI, các service giao tiếp API, custom hook tái sử dụng logic, util hỗ trợ xử lý dữ liệu, context quản lý theme và user.

**Q:** Vì sao bạn chọn ReactJS và Material-UI?
**A:** ReactJS giúp xây dựng UI linh hoạt, dễ mở rộng. Material-UI cung cấp bộ component hiện đại, responsive, tiết kiệm thời gian phát triển.

**Q:** Redux được sử dụng như thế nào trong dự án?
**A:** Redux quản lý state toàn cục như thông tin đăng nhập, dữ liệu xét nghiệm, giúp các component truy cập và cập nhật dữ liệu dễ dàng, nhất quán.

**Q:** Bạn tổ chức các component và page ra sao? Ưu điểm?
**A:** Component chia theo chức năng, page đại diện cho từng màn hình. Cách này giúp code rõ ràng, dễ bảo trì, dễ mở rộng.

### 6.2. Chức năng & Luồng xử lý

**Q:** Luồng đăng nhập/đăng ký và xác thực token hoạt động như thế nào?
**A:** Người dùng nhập thông tin → Gửi API → Nhận token → Lưu localStorage. Mỗi request kiểm tra token, nếu hết hạn sẽ tự động refresh.

**Q:** Làm sao đảm bảo bảo mật khi lưu token trên frontend?
**A:** Token lưu ở localStorage, chỉ gửi qua HTTPS, token có hạn sử dụng ngắn, refresh token tự động.

**Q:** Quy trình đặt lịch tư vấn hoặc nhắc uống thuốc?
**A:** Người dùng chọn dịch vụ/thời gian → Gửi API → Nhận xác nhận/nhắc nhở.

**Q:** Làm thế nào để xuất hóa đơn/kết quả xét nghiệm ra file PDF?
**A:** Sử dụng component xuất PDF, lấy dữ liệu từ API, render ra file PDF cho người dùng tải về.

**Q:** Bạn xử lý lỗi API và hiển thị thông báo như thế nào?
**A:** Sử dụng util notify.js để hiển thị thông báo lỗi, các lỗi được bắt và xử lý ở service hoặc redux thunk.

### 6.3. UI/UX & Responsive

**Q:** Làm gì để giao diện thân thiện với người dùng?
**A:** Sử dụng Material-UI, thiết kế layout rõ ràng, màu sắc hài hòa, hỗ trợ responsive.

**Q:** Làm sao để giao diện hiển thị tốt trên nhiều thiết bị?
**A:** Sử dụng grid, breakpoint của MUI, kiểm tra responsive trên nhiều thiết bị.

**Q:** Có sử dụng custom theme hoặc dark mode không? Triển khai ra sao?
**A:** Có, sử dụng Context API để quản lý theme, cho phép chuyển đổi giữa các theme.

### 6.4. Kết nối Backend & API

**Q:** Giao tiếp với backend như thế nào? Sử dụng thư viện gì?
**A:** Sử dụng Axios để gọi API, các service tách biệt logic gọi API khỏi UI.

**Q:** Làm sao xử lý token hết hạn?
**A:** Sử dụng custom hook và middleware để tự động refresh token khi hết hạn.

**Q:** Có kiểm tra dữ liệu đầu vào trước khi gửi backend không?
**A:** Có, validate dữ liệu ở form trước khi gửi API.

### 6.5. Testing & Best Practices

**Q:** Có viết test cho frontend không? Dùng công cụ gì?
**A:** Có thể sử dụng Jest, React Testing Library để viết test cho component và logic.

**Q:** Làm sao đảm bảo code frontend dễ bảo trì, mở rộng?
**A:** Chia nhỏ component, tách biệt logic, sử dụng Redux, custom hook, util, đặt tên rõ ràng.

**Q:** Xử lý state phức tạp như thế nào?
**A:** Sử dụng Redux để quản lý state phức tạp, chia nhỏ slice, sử dụng thunk cho logic bất đồng bộ.

### 6.6. Khác

**Q:** Nếu có lỗi phát sinh ở production, bạn sẽ debug như thế nào?
**A:** Kiểm tra log lỗi, sử dụng console.error, kiểm tra network request, kiểm tra redux state.

**Q:** Làm gì để tối ưu hiệu năng frontend?
**A:** Sử dụng React.memo, useCallback, lazy load component, tối ưu render, giảm số lần gọi API không cần thiết.

**Q:** Nếu được làm lại, bạn sẽ cải tiến gì cho dự án?
**A:** Tối ưu UI/UX hơn nữa, bổ sung test tự động, tối ưu performance, nâng cấp trải nghiệm người dùng.

---

## 7. LƯU Ý KHI TRẢ LỜI

- Trả lời ngắn gọn, đúng trọng tâm, lấy ví dụ thực tế từ dự án.
- Nếu được hỏi về code, có thể mở file cụ thể để trình bày.
- Nhấn mạnh vai trò của mình trong việc xây dựng, tối ưu, đảm bảo chất lượng frontend.

---

## 8. GIẢI THÍCH CHI TIẾT VỀ CUSTOM HOOK VÀ REDUX

### 8.1. Custom Hook

#### 1. useAuthCheck

- **Chức năng:** Kiểm tra trạng thái đăng nhập của người dùng, tự động refresh token nếu token hết hạn.
- **Cách sử dụng:**
  - Import hook vào component cha (ví dụ App.js hoặc MainLayout.js).
  - Khi component mount, hook sẽ kiểm tra token, nếu hết hạn sẽ gọi API refresh.
  - Nếu không hợp lệ, tự động chuyển hướng về trang đăng nhập.
- **Ví dụ:**
  ```js
  import useAuthCheck from '../hooks/useAuthCheck';
  function App() {
    useAuthCheck();
    // ...rest code
  }
  ```

#### 2. useTokenService

- **Chức năng:** Quản lý token (lưu, lấy, xóa, refresh token), cung cấp các hàm tiện ích liên quan đến token.
- **Cách sử dụng:**
  - Import vào các service hoặc component cần thao tác với token.
  - Gọi các hàm như getToken, setToken, refreshToken.
- **Ví dụ:**
  ```js
  import useTokenService from '../hooks/useTokenService';
  const { getToken, refreshToken } = useTokenService();
  const token = getToken();
  ```

#### 3. useSTIServicesAndPackages

- **Chức năng:** Lấy danh sách dịch vụ xét nghiệm và các gói dịch vụ từ backend, quản lý state loading, error.
- **Cách sử dụng:**
  - Import vào component hiển thị danh sách dịch vụ.
  - Hook trả về data, loading, error để render UI phù hợp.
- **Ví dụ:**
  ```js
  import useSTIServicesAndPackages from '../hooks/useSTIServicesAndPackages';
  const { services, packages, loading, error } = useSTIServicesAndPackages();
  ```

#### 4. useConnectionMonitor

- **Chức năng:** Theo dõi trạng thái kết nối mạng (online/offline), hiển thị thông báo khi mất kết nối.
- **Cách sử dụng:**
  - Import vào App.js hoặc MainLayout.js.
  - Hook sẽ tự động lắng nghe sự kiện thay đổi kết nối.
- **Ví dụ:**
  ```js
  import useConnectionMonitor from '../hooks/useConnectionMonitor';
  useConnectionMonitor();
  ```

#### **Lợi ích của custom hook:**

- Tái sử dụng logic giữa nhiều component.
- Giúp code gọn gàng, dễ bảo trì, tách biệt logic khỏi UI.

---

### 8.2. Redux (Slices, Thunks, Middleware)

#### 1. Slices

- **authSlice:** Quản lý trạng thái đăng nhập, thông tin người dùng, token.
- **stiTestsSlice:** Quản lý dữ liệu xét nghiệm, kết quả xét nghiệm.
- **Cách sử dụng:**
  - Import các selector và action từ slice vào component.
  - Dùng useSelector để lấy state, useDispatch để gọi action.
- **Ví dụ:**
  ```js
  import { useSelector, useDispatch } from 'react-redux';
  import { logout } from '../redux/slices/authSlice';
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const handleLogout = () => dispatch(logout());
  ```

#### 2. Thunks

- **userThunks:** Xử lý các thao tác bất đồng bộ liên quan đến người dùng (đăng nhập, đăng ký, cập nhật thông tin...).
- **stiTestsThunks:** Xử lý lấy dữ liệu xét nghiệm, gửi kết quả xét nghiệm.
- **Cách sử dụng:**
  - Import thunk vào component.
  - Dùng useDispatch để gọi thunk (thường là các hàm async).
- **Ví dụ:**
  ```js
  import { useDispatch } from 'react-redux';
  import { fetchUserProfile } from '../redux/thunks/userThunks';
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  ```

#### 3. Middleware

- **localStorageMiddleware:** Tự động lưu một số state vào localStorage khi có thay đổi (ví dụ: thông tin đăng nhập).

---

#### **Lợi ích của Redux:**

- Quản lý state tập trung, nhất quán.
- Dễ debug, dễ mở rộng.
- Hỗ trợ tốt cho các ứng dụng lớn, nhiều luồng dữ liệu phức tạp.
