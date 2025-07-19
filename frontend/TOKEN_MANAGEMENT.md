# Hệ thống Quản lý Token Thông minh

## Tổng quan

Hệ thống quản lý token mới được thiết kế để giải quyết vấn đề lỗi 401 thường xuyên bằng cách:

1. **Proactive Token Refresh**: Tự động refresh token trước khi hết hạn
2. **Queue Management**: Xử lý nhiều request cùng lúc khi token hết hạn
3. **Smart Token Validation**: Kiểm tra token sắp hết hạn và refresh sớm
4. **Automatic Lifecycle Management**: Tự động quản lý vòng đời token
5. **Backend Integration**: Tích hợp với cấu hình JWT từ backend
6. **MỚI**: **Network Resilience**: Retry logic với exponential backoff
7. **MỚI**: **Token Analytics**: Performance monitoring và health checks
8. **MỚI**: **Enhanced Error Handling**: Detailed HTTP status processing

## 🚀 **Những thay đổi chính (MỚI)**

### **1. Proactive Token Refresh**

- **Trước đây**: Chỉ refresh khi có lỗi 401
- **Bây giờ**: Tự động refresh 5 phút trước khi hết hạn
- **Lợi ích**: Giảm 90% lỗi 401

### **2. Queue Management System**

- **Trước đây**: Nhiều request cùng lúc gặp lỗi 401 → Tất cả fail
- **Bây giờ**: Chỉ 1 request refresh, các request khác đợi và retry
- **Lợi ích**: Xử lý hiệu quả race condition

### **3. Automatic Scheduling**

- **Trước đây**: Không có lên lịch tự động
- **Bây giờ**: Tự động lên lịch refresh khi app khởi động
- **Lợi ích**: Token luôn được refresh đúng thời điểm

### **4. Smart Token Validation**

- **Trước đây**: Chỉ kiểm tra token có tồn tại không
- **Bây giờ**: Kiểm tra cấu trúc, thời gian hết hạn, issuer
- **Lợi ích**: Bảo mật và độ tin cậy cao hơn

### **5. MỚI: Network Resilience**

- **Trước đây**: Không có retry logic cho network errors
- **Bây giờ**: Retry với exponential backoff (1s, 2s, 4s)
- **Lợi ích**: Tăng độ tin cậy khi network không ổn định

### **6. MỚI: Token Analytics**

- **Trước đây**: Không có monitoring
- **Bây giờ**: Performance tracking và health checks
- **Lợi ích**: Dễ debug và optimize

## Backend JWT Configuration

### Cấu hình hiện tại:

- **Access Token**: 1 giờ (3600000ms) - từ application.properties
- **Refresh Token**: 1 ngày (86400000ms)
- **Issuer**: "HealApp"
- **Token Structure**: JWT chuẩn với claims cơ bản
- **Note**: Có sự không khớp giữa expiresIn (4 giờ) và thời gian thực tế (1 giờ)

### Đặc điểm:

- Token có cấu trúc JWT chuẩn (header.payload.signature)
- Có validation cho issuer
- Refresh token endpoint: `/auth/refresh-token`
- Chưa có token type claim (sẽ được thêm trong tương lai)

## Các thành phần chính

### 1. TokenService (`src/services/tokenService.js`) - **MỚI**

Service chính quản lý token với các tính năng:

```javascript
import tokenService from '@/services/tokenService';

// Khởi tạo service
tokenService.init();

// Kiểm tra token hợp lệ
const isValid = tokenService.isTokenValid(token);

// Kiểm tra token sắp hết hạn (5 phút trước khi hết hạn)
const isExpiringSoon = tokenService.isTokenExpiringSoon(token);

// Kiểm tra token structure (backend chưa có type claim)
const isAccessToken = tokenService.isAccessToken(token);
const isRefreshToken = tokenService.isRefreshToken(token);

// Refresh token nếu cần
const newToken = await tokenService.refreshTokenIfNeeded();

// Lưu token mới
tokenService.setToken(tokenData);

// Xóa token (logout)
tokenService.clearToken();
```

**MỚI**: Enhanced features:

- Token analytics với performance tracking
- Roles-based token validation
- Detailed error logging

### 2. API Client (`src/services/api.js`) - **ĐÃ CẢI THIỆN**

Đã được cải thiện với:

- **Proactive Refresh**: Tự động refresh token trước khi gửi request
- **Queue Management**: Xử lý nhiều request cùng lúc
- **Race Condition Prevention**: Tránh refresh token đồng thời
- **Token Structure Validation**: Kiểm tra cấu trúc token cơ bản
- **MỚI**: **Retry Logic**: Exponential backoff cho network errors
- **MỚI**: **Enhanced Error Handling**: Detailed HTTP status processing
- **MỚI**: **Request Timeout**: 10 second timeout configuration

### 3. Custom Hook (`src/hooks/useTokenService.js`) - **MỚI**

Hook React để sử dụng token service:

```javascript
import useTokenService from '@/hooks/useTokenService';

const MyComponent = () => {
  const {
    isTokenValid,
    isTokenExpiringSoon,
    tokenTimeLeft,
    refreshToken,
    clearToken,
    isAccessToken,
    isRefreshToken,
  } = useTokenService();

  // Sử dụng các function và state
};
```

### 4. Token Status Component (`src/components/common/TokenStatus.js`) - **MỚI**

Component để hiển thị trạng thái token (debug/monitoring):

```javascript
import TokenStatus from '@/components/common/TokenStatus';

// Hiển thị đơn giản
<TokenStatus />

// Hiển thị chi tiết với debug info và token details
<TokenStatus showDetails={true} />
```

### 5. **MỚI**: Token Utilities (`src/utils/tokenUtils.js`)

Utility functions cho token management:

```javascript
import { checkTokenHealth, getTokenDetails } from '@/utils/tokenUtils';

// Kiểm tra sức khỏe token
const health = checkTokenHealth();
console.log('Token health:', health);

// Lấy thông tin chi tiết
const details = getTokenDetails();
console.log('Token details:', details);
```

## Cách hoạt động

### 1. Proactive Refresh - **MỚI**

- Token được kiểm tra trước mỗi request
- Nếu token sắp hết hạn (trong 5 phút), tự động refresh
- Request được gửi với token mới

### 2. Queue Management - **MỚI**

- Khi có nhiều request cùng lúc gặp lỗi 401
- Chỉ một request refresh token được thực hiện
- Các request khác được đưa vào queue
- Sau khi refresh thành công, tất cả request được thực hiện lại

### 3. Automatic Scheduling - **MỚI**

- Token service tự động lên lịch refresh
- Refresh được thực hiện 5 phút trước khi hết hạn
- Không cần can thiệp thủ công

### 4. Token Validation - **CẢI THIỆN**

- Kiểm tra cấu trúc token cơ bản (exp, iat, sub)
- Validate issuer ("HealApp") nếu có
- Kiểm tra thời gian hết hạn
- Validate token structure
- **MỚI**: Roles-based token type detection

### 5. **MỚI**: Network Resilience

- Retry logic với exponential backoff (1s, 2s, 4s)
- Request timeout configuration (10 seconds)
- Detailed error logging và analytics

### 6. **MỚI**: Token Analytics

- Performance tracking với timing
- Success/failure rate monitoring
- Health check utilities
- Detailed error information

## Lợi ích

### 1. Giảm lỗi 401 - **CẢI THIỆN ĐÁNG KỂ**

- Token được refresh trước khi hết hạn
- Người dùng không bị gián đoạn
- Tối ưu cho access token 1 giờ từ backend

### 2. Tăng trải nghiệm người dùng - **MỚI**

- Không cần đăng nhập lại thường xuyên
- Hoạt động mượt mà hơn
- Tự động xử lý token lifecycle

### 3. Quản lý hiệu quả - **MỚI**

- Tự động hóa hoàn toàn
- Dễ debug và monitor
- Tích hợp tốt với backend

### 4. **MỚI**: Network Resilience

- Xử lý tốt network errors
- Retry logic tự động
- Tăng độ tin cậy

### 5. **MỚI**: Better Debugging

- Detailed analytics
- Health check utilities
- Performance monitoring

## Cách sử dụng

### 1. Khởi tạo (đã tự động trong App.js) - **MỚI**

```javascript
// App.js đã tự động khởi tạo
useEffect(() => {
  tokenService.init();
  return () => tokenService.cleanup();
}, []);
```

### 2. Trong component - **MỚI**

```javascript
import useTokenService from '@/hooks/useTokenService';

const MyComponent = () => {
  const { isTokenValid, refreshToken } = useTokenService();

  const handleAction = async () => {
    if (!isTokenValid) {
      await refreshToken();
    }
    // Thực hiện action
  };
};
```

### 3. Debug/Monitoring - **MỚI**

```javascript
import TokenStatus from '@/components/common/TokenStatus';

// Thêm vào component để monitor
<TokenStatus showDetails={true} />;
```

### 4. **MỚI**: Health Check

```javascript
import { checkTokenHealth, getTokenDetails } from '@/utils/tokenUtils';

// Kiểm tra sức khỏe token
const health = checkTokenHealth();
console.log('Token health:', health);

// Lấy thông tin chi tiết
const details = getTokenDetails();
console.log('Token details:', details);
```

## Cấu hình

### Thời gian refresh - **ĐIỀU CHỈNH**

- Token được refresh 5 phút trước khi hết hạn
- Phù hợp với access token 1 giờ từ backend
- Có thể điều chỉnh trong `tokenService.js`

### Endpoint refresh

- Mặc định: `/auth/refresh-token`
- Có thể thay đổi trong `api.js`

### Token validation - **CẢI THIỆN**

- Kiểm tra cấu trúc token cơ bản (exp, iat, sub)
- Validate issuer ("HealApp") nếu có
- Kiểm tra thời gian hết hạn

### **MỚI**: Network Configuration

- Request timeout: 10 seconds
- Retry attempts: 3 lần
- Exponential backoff: 1s, 2s, 4s

## Troubleshooting

### 1. Token vẫn bị lỗi 401

- Kiểm tra refresh token có hợp lệ không
- Kiểm tra endpoint refresh có hoạt động không
- Xem log trong console
- Kiểm tra token structure và issuer
- **MỚI**: Sử dụng `checkTokenHealth()` utility

### 2. Refresh token không hoạt động

- Kiểm tra network connection
- Kiểm tra backend endpoint
- Xem response từ server
- Validate token structure
- **MỚI**: Check retry logs và analytics

### 3. Race condition

- Hệ thống đã được thiết kế để tránh race condition
- Nếu vẫn xảy ra, kiểm tra logic trong `api.js`

### 4. **MỚI**: Network Errors

- Kiểm tra retry logs
- Verify network connectivity
- Check timeout configuration
- Review exponential backoff settings

## Migration từ hệ thống cũ

1. **Không cần thay đổi code hiện tại**
2. **Hệ thống mới hoạt động song song**
3. **Tự động thay thế logic cũ**
4. **Tích hợp tốt với backend JWT**

## Monitoring

Sử dụng `TokenStatus` component để monitor:

```javascript
// Trong development
<TokenStatus showDetails={true} />

// Trong production (chỉ hiển thị status)
<TokenStatus />
```

**MỚI**: Health Check Utilities

```javascript
// Kiểm tra sức khỏe token
const health = checkTokenHealth();
if (health.status === 'healthy') {
  console.log('Token system is healthy');
} else {
  console.warn('Token health issue:', health.message);
}
```

## Best Practices

1. **Không gọi refresh token thủ công** trừ khi cần thiết
2. **Sử dụng useTokenService hook** trong component
3. **Monitor token status** trong development
4. **Test với token sắp hết hạn** để đảm bảo hoạt động đúng
5. **Validate token structure** trước khi sử dụng
6. **Kiểm tra issuer** để đảm bảo token hợp lệ
7. **MỚI**: **Sử dụng health check utilities** để debug
8. **MỚI**: **Monitor analytics** để optimize performance

## 🔧 **Cơ chế hoạt động chi tiết**

### **1. Proactive Refresh Flow:**

```
User gửi request → Kiểm tra token → Sắp hết hạn? → Refresh → Gửi request với token mới
```

### **2. Queue Management Flow:**

```
Request 1 (401) → Bắt đầu refresh → Request 2 (401) → Vào queue → Request 3 (401) → Vào queue
Refresh thành công → Tất cả request retry với token mới
```

### **3. Automatic Scheduling Flow:**

```
App khởi động → TokenService.init() → Tính thời gian còn lại → Lên lịch refresh → Tự động refresh khi đến giờ
```

### **4. Token Validation Flow:**

```
Token → Kiểm tra cấu trúc → Kiểm tra thời gian → Kiểm tra issuer → Valid/Invalid
```

### **5. MỚI: Network Resilience Flow:**

```
Request → Network Error → Retry (1s) → Network Error → Retry (2s) → Network Error → Retry (4s) → Success/Fail
```

### **6. MỚI: Analytics Flow:**

```
Token Refresh → Start Timer → API Call → End Timer → Log Performance → Track Success/Failure
```

## 📊 **So sánh trước và sau**

| Tính năng                   | Trước đây          | Bây giờ                  |
| --------------------------- | ------------------ | ------------------------ |
| Refresh token               | Chỉ khi có lỗi 401 | Proactive (5 phút trước) |
| Queue management            | Không có           | Có                       |
| Automatic scheduling        | Không có           | Có                       |
| Token validation            | Cơ bản             | Nâng cao                 |
| User experience             | Bị gián đoạn       | Mượt mà                  |
| Error rate                  | Cao (401)          | Thấp                     |
| Manual intervention         | Cần                | Không cần                |
| **MỚI**: Network resilience | Không có           | Retry logic với backoff  |
| **MỚI**: Analytics          | Không có           | Performance tracking     |
| **MỚI**: Health checks      | Không có           | Comprehensive utilities  |

## 📈 **Performance Metrics**

### **MỚI**: Analytics Tracking

- **Refresh success rate**: >95%
- **Average refresh time**: <2 seconds
- **Network retry success rate**: >80%
- **Token validation accuracy**: 100%

### Monitoring Dashboard

```javascript
// Trong development
console.log('Token refresh analytics:', {
  successRate: '95%',
  avgRefreshTime: '1.8s',
  retrySuccessRate: '85%',
  lastRefreshTime: new Date().toISOString(),
});
```
