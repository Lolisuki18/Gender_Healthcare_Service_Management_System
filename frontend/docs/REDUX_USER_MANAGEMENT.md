# Hướng dẫn Sử dụng Redux cho Quản lý User và Avatar

## Tổng quan

Dự án đã được cập nhật để sử dụng Redux cho việc quản lý trạng thái người dùng và avatar, thay vì chỉ dựa vào localStorage và Context API. Việc chuyển đổi này giải quyết các vấn đề về đồng bộ hóa dữ liệu người dùng giữa các thành phần khác nhau (sidebar, header, profile), đặc biệt là đối với việc cập nhật avatar.

## Cấu trúc Redux

### Các thành phần chính

1. **Redux Store**: `/src/redux/store.js` - Lưu trữ và quản lý trạng thái toàn cục của ứng dụng
2. **Auth Slice**: `/src/redux/slices/authSlice.js` - Quản lý trạng thái liên quan đến xác thực và thông tin người dùng
3. **User Thunks**: `/src/redux/thunks/userThunks.js` - Xử lý các thao tác bất đồng bộ như gọi API
4. **Middleware**: `/src/redux/middleware/localStorageMiddleware.js` - Đồng bộ trạng thái Redux với localStorage

### Các state quan trọng trong Auth Slice

```javascript
{
  user: Object,             // Thông tin người dùng đầy đủ
  isAuthenticated: Boolean, // Trạng thái đăng nhập
  loading: Boolean,         // Trạng thái đang tải
  error: String,            // Thông báo lỗi (nếu có)
  avatarUrl: String         // Đường dẫn đến avatar người dùng
}
```

## Hướng dẫn sử dụng

### 1. Lấy thông tin User và Avatar từ Redux

```javascript
// Component
import { useSelector } from "react-redux";
import {
  selectUser,
  selectAvatar,
  selectIsAuthenticated,
} from "@/redux/slices/authSlice";

function YourComponent() {
  // Lấy thông tin user
  const user = useSelector(selectUser);

  // Lấy URL avatar
  const avatar = useSelector(selectAvatar);

  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = useSelector(selectIsAuthenticated);

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h3>Xin chào, {user?.fullName}</h3>
          <img
            src={avatar ? imageUrl.getFullImageUrl(avatar) : defaultAvatar}
            alt="Avatar"
          />
        </>
      ) : (
        <p>Vui lòng đăng nhập</p>
      )}
    </div>
  );
}
import { loginUser, logoutUser } from "@/redux/thunks/userThunks";

function LoginComponent() {
  const dispatch = useDispatch();

  const handleLogin = async (credentials) => {
    try {
      // Gọi action đăng nhập
      await dispatch(loginUser(credentials)).unwrap();
      // Xử lý thành công (chuyển hướng, hiển thị thông báo...)
    } catch (error) {
      // Xử lý lỗi
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // ...
}
```

### 2. Đăng nhập và đăng xuất

Sử dụng các thunk actions để thực hiện đăng nhập và đăng xuất:

```javascript
// Component
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "@/redux/thunks/userThunks";

function LoginComponent() {
  const dispatch = useDispatch();

  // Xử lý đăng nhập
  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      // Chuyển hướng sau khi đăng nhập thành công
      navigate("/dashboard");
    } catch (error) {
      // Xử lý lỗi đăng nhập
      console.error("Đăng nhập thất bại:", error);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      // Chuyển hướng sau khi đăng xuất
      navigate("/login");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin({ email, password });
      }}
    >
      {/* Form fields */}
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
```

### 3. Cập nhật Avatar

```javascript
// Component
import { useDispatch } from "react-redux";
import { uploadAvatar } from "@/redux/thunks/userThunks";

function AvatarUploadComponent() {
  const dispatch = useDispatch();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const avatarPath = await dispatch(uploadAvatar(file)).unwrap();
        console.log("Avatar đã được cập nhật:", avatarPath);
        // Avatar đã tự động được cập nhật trong Redux store
        // và đồng bộ với localStorage
      } catch (error) {
        console.error("Lỗi cập nhật avatar:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}
```

### 4. Cập nhật thông tin người dùng

```javascript
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/redux/thunks/userThunks";
import { selectUser } from "@/redux/slices/authSlice";

function ProfileEditComponent() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    // Các trường thông tin khác...
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      // Thông tin người dùng đã tự động cập nhật trong Redux
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Cập nhật</button>
    </form>
  );
}
```

### 5. Lấy thông tin người dùng hiện tại

```javascript
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/redux/thunks/userThunks";

function ProfilePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Lấy thông tin người dùng khi component mount
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return <div>{/* Component content */}</div>;
}
```

## Luồng xử lý dữ liệu

1. **Khi đăng nhập**:

   - `loginUser` thunk được gọi với thông tin đăng nhập
   - Thunk gọi API đăng nhập và lấy thông tin người dùng
   - Action `loginSuccess` được dispatch
   - Reducer cập nhật state trong Redux store
   - Middleware lưu thông tin vào localStorage

2. **Khi cập nhật avatar**:

   - `uploadUserAvatar` thunk được gọi với file ảnh
   - Thunk gọi API để upload avatar
   - Action `updateUserAvatar` được dispatch
   - Reducer cập nhật avatar trong Redux store
   - Middleware cập nhật localStorage và kích hoạt sự kiện cập nhật

3. **Đồng bộ giữa các tab**:
   - Khi avatar được cập nhật, middleware gọi `triggerAvatarUpdate`
   - Sự kiện storage được kích hoạt, được lắng nghe bởi tất cả các tab
   - Các tab khác cập nhật UI tương ứng

## Lưu ý quan trọng

1. **Không reload trang**: Không cần `window.location.reload()` khi cập nhật avatar, Redux sẽ tự động cập nhật UI
2. **Token xác thực**: Vẫn lưu trong localStorage để sử dụng cho các API call
3. **UserProfile**: Vẫn duy trì trong localStorage để tương thích ngược, nhưng nguồn dữ liệu chính là Redux store

## Đồng bộ hóa với localStorage

Redux được đồng bộ hóa với localStorage thông qua:

1. **Redux Persist**: Lưu trữ tự động state Redux vào localStorage
2. **LocalStorage Middleware**: `/src/redux/middleware/localStorageMiddleware.js` - Theo dõi các hành động Redux và đồng bộ với localStorage

Thêm vào đó, chúng ta sử dụng `triggerAvatarUpdate()` từ `/src/utils/storageEvent.js` để thông báo cho các tab khác về việc avatar đã được cập nhật.

## Xử lý lỗi và Debug

### Công cụ Debug

Chúng tôi cung cấp một số tiện ích debug trong `/src/utils/debugHelper.js`:

- `debugLog()`: In log có điều kiện với nhãn phân loại
- `extractAvatarFromResponse()`: Hỗ trợ trích xuất avatar từ nhiều định dạng response API
- `logStorageState()`: Hiển thị trạng thái hiện tại của localStorage/sessionStorage

### Các vấn đề thường gặp và cách khắc phục

#### 1. Avatar không hiện sau khi upload

Nguyên nhân:

- Redux chưa cập nhật kịp thời
- Đường dẫn avatar không đúng định dạng

Giải pháp:

- Đảm bảo đang sử dụng `selectAvatar` từ Redux, không phải userData.avatar
- Kiểm tra console.log để xác định đường dẫn avatar thực tế
- Đảm bảo sử dụng `imageUrl.getFullImageUrl()` để render đường dẫn đầy đủ

#### 2. Thông tin người dùng không đồng bộ giữa các thành phần

Nguyên nhân:

- Component vẫn đang sử dụng Context hoặc localStorage trực tiếp

Giải pháp:

- Chuyển sang sử dụng hoàn toàn Redux (`useSelector`)
- Thêm `useEffect` để theo dõi thay đổi Redux và cập nhật state local

#### 3. Đăng nhập/đăng xuất không hoạt động

Nguyên nhân:

- Token không được lưu/xóa đúng cách

Giải pháp:

- Đảm bảo sử dụng Redux thunks: `loginUser()`, `logoutUser()`
- Kiểm tra middleware đang hoạt động với localStorage

## Tối ưu hiệu suất

### Memoization với useSelector

```javascript
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { selectUser } from "@/redux/slices/authSlice";

// Tạo selector tính toán
const selectUserName = createSelector(
  selectUser,
  (user) => user?.fullName || "Guest"
);

function UserGreeting() {
  // Chỉ re-render khi tên người dùng thay đổi
  const userName = useSelector(selectUserName);

  return <h2>Xin chào, {userName}!</h2>;
}
```

### Sử dụng ít action dispatch hơn

Thay vì dispatch nhiều action riêng lẻ, hãy xử lý nhiều cập nhật trong một action duy nhất khi có thể.

## Phát triển thêm

Để mở rộng hệ thống Redux:

1. Tạo slice mới trong `/src/redux/slices/`
2. Thêm reducer vào rootReducer trong `/src/redux/store.js`
3. Tạo thunks mới trong `/src/redux/thunks/` nếu cần

## Migration

Nếu bạn vẫn đang sử dụng một số component với Context API, theo các bước sau để chuyển đổi:

1. Import và sử dụng các selector: `selectUser`, `selectAvatar`, etc.
2. Thay thế các hàm Context với Redux thunks
3. Loại bỏ các state và effect xử lý localStorage trực tiếp

## Kết luận

Việc sử dụng Redux giúp dự án có luồng dữ liệu nhất quán và dễ bảo trì hơn. Đồng thời nó giải quyết các vấn đề đồng bộ hóa dữ liệu giữa các thành phần UI khác nhau, đặc biệt là với avatar và thông tin người dùng.

---

Tài liệu được cập nhật lần cuối: 17/06/2025
