# Cập nhật Hỗ trợ Tiếng Việt cho Gender

## Ngày: 14/06/2025

## Tổng quan

Cập nhật này cho phép hệ thống hỗ trợ tiếng Việt cho các giá trị giới tính, cho phép frontend gửi giá trị gender bằng cả tiếng Việt ("Nam", "Nữ", "Khác") và tiếng Anh ("MALE", "FEMALE", "OTHER").

## Các thay đổi chi tiết

### 1. Cập nhật `UserUpdateRequest.java`

Đã sửa đổi regex để chấp nhận giá trị giới tính bằng cả tiếng Việt và tiếng Anh:

```java
@NotBlank(message = "Gender is required")
@Pattern(regexp = "MALE|FEMALE|OTHER|Nam|Nữ|Khác", message = "Gender must be MALE, FEMALE, OTHER, Nam, Nữ, or Khác")
private String gender;
```

### 2. Cập nhật `CreateAccountRequest.java`

Đã thêm validation pattern để chấp nhận giá trị giới tính bằng cả tiếng Việt và tiếng Anh:

```java
@NotBlank(message = "Gender is required!")
@Pattern(regexp = "^(Nam|Nữ|Khác|MALE|FEMALE|OTHER)$", message = "Giới tính phải là: Nam, Nữ, Khác, MALE, FEMALE, hoặc OTHER")
private String gender;
```

### 3. Cải thiện enum `Gender.java`

Đã nâng cấp phương thức `fromDisplayName` để xử lý cả tên hiển thị và tên enum:

```java
public static Gender fromDisplayName(String displayName) {
    if (displayName == null) {
        throw new IllegalArgumentException("Gender cannot be null");
    }

    // First try exact match with display name
    for (Gender gender : Gender.values()) {
        if (gender.displayName.equalsIgnoreCase(displayName.trim())) {
            return gender;
        }
    }

    // If not found, try matching with enum name
    try {
        return Gender.valueOf(displayName.trim().toUpperCase());
    } catch (IllegalArgumentException e) {
        // Not a valid enum name either
        throw new IllegalArgumentException("Invalid gender: " + displayName);
    }
}
```

Đã thêm phương thức tiện ích để lấy tên hiển thị từ tên enum:

```java
public static String getDisplayNameFromEnumName(String enumName) {
    if (enumName == null) {
        return null;
    }
    try {
        return Gender.valueOf(enumName.toUpperCase()).getDisplayName();
    } catch (IllegalArgumentException e) {
        return enumName; // Return as-is if not a valid enum name
    }
}
```

### 4. Sửa đổi `UserService.java`

Đã sửa các chỗ sử dụng `Gender.valueOf()` để sử dụng `Gender.fromDisplayName()` với fallback:

```java
try {
    user.setGender(Gender.fromDisplayName(request.getGender()));
} catch (IllegalArgumentException e) {
    // Try as enum constant if display name fails
    try {
        user.setGender(Gender.valueOf(request.getGender()));
    } catch (IllegalArgumentException ex) {
        throw new IllegalArgumentException("Invalid gender: " + request.getGender());
    }
}
```

## Cách hoạt động

Frontend có thể gửi giá trị giới tính bằng tiếng Việt ("Nam", "Nữ", "Khác") hoặc tiếng Anh ("MALE", "FEMALE", "OTHER").

1. Khi backend nhận giá trị gender từ frontend:

   - Đầu tiên nó sẽ thử so khớp với tên hiển thị (Nam, Nữ, Khác)
   - Nếu không tìm thấy, nó sẽ thử chuyển đổi thành tên enum (MALE, FEMALE, OTHER)

2. Trong trường hợp lưu trữ, các giá trị sẽ được lưu dưới dạng enum (MALE, FEMALE, OTHER).

3. Khi trả về giá trị cho frontend, backend sẽ trả về tên hiển thị tiếng Việt thông qua `getGenderDisplayName()`.

## Lưu ý

- Tất cả các validation đã được cập nhật để chấp nhận cả giá trị tiếng Việt và tiếng Anh.
- Logic xử lý đã được cải thiện để xử lý các trường hợp ngoại lệ và báo lỗi rõ ràng hơn.
- Các test case cần được cập nhật để test cả các giá trị tiếng Việt và tiếng Anh.
