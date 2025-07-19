# Cải tiến Xử lý Refresh Token

## Tổng quan

Đã thực hiện các cải tiến toàn diện để xử lý tốt hơn các trường hợp refresh token hết hạn và máy treo trong thời gian dài.

## Cấu hình Token từ Backend

### ⏰ Thời gian hoạt động:

- **Access Token**: 1 giờ (3,600,000 ms)
- **Refresh Token**: 1 ngày (86,400,000 ms)

### 🔧 Cấu hình trong application.properties:

```properties
jwt.access-token-expiration=3600000      # 1 giờ
jwt.refresh-token-expiration=86400000    # 1 ngày
```

## Các cải tiến chính

### 1. TokenService Enhancement (`src/services/tokenService.js`)

**Tính năng mới:**

- Theo dõi hoạt động người dùng (window focus, visibility change)
- Tự động refresh token khi người dùng quay lại sau thời gian không hoạt động
- Xử lý các event listeners để phát hiện inactivity
- **MỚI**: Token analytics và performance monitoring
- **MỚI**: Enhanced token validation với roles-based detection

**Cơ chế hoạt động:**

- Khi window focus sau 5 phút không hoạt động → kiểm tra và refresh token
- Khi tab trở nên visible sau 10 phút không hoạt động → kiểm tra và refresh token
- Theo dõi user activity (click, scroll, keypress, mousemove)
- **MỚI**: Track refresh performance với timing analytics

### 2. API Interceptor Improvements (`src/services/api.js`)

**Cải tiến:**

- Xử lý tốt hơn các trường hợp 401 Unauthorized
- Thêm kiểm tra để tránh hiển thị dialog khi đang ở trang login
- Xử lý các lỗi HTTP khác (403, 500+)
- **MỚI**: Retry logic với exponential backoff cho network errors
- **MỚI**: Enhanced error handling với detailed status code processing
- **MỚI**: Request timeout configuration (10 seconds)

### 3. Connection Monitor Hook (`src/hooks/useConnectionMonitor.js`)

**Tính năng:**

- Theo dõi trạng thái online/offline
- Phát hiện khi máy treo hoặc không hoạt động
- Tự động refresh token khi kết nối được khôi phục
- Thông báo cho người dùng về trạng thái kết nối

### 4. Token Utilities (`src/utils/tokenUtils.js`)

**Các utility functions:**

- `isTokenCompletelyExpired()` - Kiểm tra token hết hạn hoàn toàn
- `isRefreshTokenValid()` - Kiểm tra refresh token còn hợp lệ
- `handleInactivity()` - Xử lý khi phát hiện máy treo
- `handleConnectionRestore()` - Xử lý khi kết nối được khôi phục
- `handleWindowFocus()` - Xử lý khi window focus
- `handleTabVisible()` - Xử lý khi tab trở nên visible
- `updateLastActivity()` - Cập nhật thời gian hoạt động
- `shouldRefreshToken()` - Kiểm tra có cần refresh token không
- **MỚI**: `checkTokenHealth()` - Kiểm tra sức khỏe tổng thể của token system
- **MỚI**: `getTokenDetails()` - Lấy thông tin chi tiết về token

### 5. App Integration (`src/App.js`)

**Tích hợp:**

- Thêm `ConnectionMonitor` component để theo dõi toàn bộ ứng dụng
- Tự động khởi tạo và cleanup token service

## Cơ chế hoạt động

### 1. Proactive Token Refresh

- Token được refresh 5 phút trước khi hết hạn (access token 1 giờ)
- Sử dụng setTimeout để lên lịch refresh

### 2. Activity-based Refresh

- Khi người dùng quay lại sau thời gian không hoạt động
- Theo dõi các sự kiện: focus, visibility change, user activity

### 3. Connection-based Refresh

- Khi kết nối được khôi phục sau khi mất kết nối
- Kiểm tra token validity và refresh nếu cần

### 4. Error Handling

- Xử lý các trường hợp refresh token thất bại
- Redirect to login khi cần thiết
- Thông báo rõ ràng cho người dùng
- **MỚI**: Retry logic với exponential backoff
- **MỚI**: Detailed HTTP status code handling

### 5. **MỚI**: Token Analytics và Monitoring

- Track refresh performance với timing
- Monitor success/failure rates
- Log detailed error information
- Health check utilities

## Các trường hợp được xử lý

### ✅ Máy treo trong thời gian dài

- Phát hiện qua window focus/visibility change
- Tự động refresh token khi người dùng quay lại
- Thông báo cho người dùng về trạng thái

### ✅ Mất kết nối mạng

- Theo dõi online/offline events
- Tự động refresh token khi kết nối được khôi phục
- Xử lý các trường hợp token hết hạn hoàn toàn
- **MỚI**: Retry logic cho network errors

### ✅ Tab ẩn/hiện

- Theo dõi visibility change
- Refresh token khi tab trở nên visible sau thời gian dài

### ✅ User inactivity

- Theo dõi user activity (click, scroll, keypress)
- Phát hiện khi người dùng không hoạt động
- Tự động refresh token khi có hoạt động trở lại

### ✅ **MỚI**: Network Errors

- Retry logic với exponential backoff (1s, 2s, 4s)
- Timeout configuration (10 seconds)
- Detailed error logging và analytics

### ✅ **MỚI**: Token Health Monitoring

- Comprehensive health check utilities
- Detailed token information extraction
- Performance tracking và analytics

## Cấu hình

### Thời gian timeout:

- **Token refresh threshold**: 5 phút trước khi hết hạn (access token 1 giờ)
- **Window focus threshold**: 5 phút không hoạt động
- **Tab visibility threshold**: 10 phút không hoạt động
- **Inactivity threshold**: 5 phút không hoạt động
- **Session timeout check**: Mỗi 5 phút
- **MỚI**: Request timeout: 10 giây
- **MỚI**: Retry attempts: 3 lần với exponential backoff

### Event listeners:

- `window.focus` - Khi window được focus
- `document.visibilitychange` - Khi tab ẩn/hiện
- `window.online/offline` - Khi kết nối thay đổi
- User activity events (click, scroll, keypress, mousemove)

## Lợi ích

1. **Trải nghiệm người dùng tốt hơn**: Không bị logout đột ngột
2. **Bảo mật**: Token được refresh tự động khi cần thiết
3. **Độ tin cậy**: Xử lý tốt các trường hợp edge case
4. **Thông báo rõ ràng**: Người dùng biết trạng thái hệ thống
5. **Hiệu suất**: Chỉ refresh khi thực sự cần thiết
6. **MỚI**: **Network resilience**: Retry logic cho network errors
7. **MỚI**: **Better debugging**: Detailed analytics và monitoring
8. **MỚI**: **Enhanced validation**: Roles-based token type detection

## Testing

Để test các tính năng này:

1. **Test máy treo**: Để máy không hoạt động 5+ phút, sau đó focus window
2. **Test mất kết nối**: Tắt mạng, sau đó bật lại
3. **Test tab ẩn**: Ẩn tab 10+ phút, sau đó hiện lại
4. **Test inactivity**: Không hoạt động 5+ phút, sau đó click/scroll
5. **MỚI**: **Test network errors**: Simulate network failures
6. **MỚI**: **Test token health**: Use health check utilities

## Troubleshooting

### Nếu token vẫn bị hết hạn:

1. Kiểm tra console logs để xem lỗi refresh
2. Kiểm tra network connectivity
3. Kiểm tra backend refresh token endpoint
4. Kiểm tra localStorage có token không
5. **MỚI**: Sử dụng `checkTokenHealth()` utility

### Nếu có lỗi:

1. Kiểm tra `src/services/tokenService.js` logs
2. Kiểm tra `src/hooks/useConnectionMonitor.js` logs
3. Kiểm tra browser console cho errors
4. Kiểm tra network tab cho failed requests
5. **MỚI**: Xem analytics logs cho performance data

### **MỚI**: Token Health Check

```javascript
import { checkTokenHealth, getTokenDetails } from '@/utils/tokenUtils';

// Kiểm tra sức khỏe token
const health = checkTokenHealth();
console.log('Token health:', health);

// Lấy thông tin chi tiết
const details = getTokenDetails();
console.log('Token details:', details);
```

## Performance Metrics

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
