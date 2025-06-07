/\*\*

- Hướng dẫn phát triển - Gender Health Care Frontend
-
- Tài liệu này cung cấp các nguyên tắc và quy ước khi phát triển dự án,
- giúp đảm bảo tính nhất quán và dễ bảo trì của code.
  \*/

# Hướng dẫn phát triển

## Quy tắc đặt tên

### Components

- Sử dụng PascalCase: `UserProfile.js`, `AppHeader.js`
- Mỗi component nên có một file riêng
- Tên file phải khớp với tên component

### Hooks

- Sử dụng camelCase và bắt đầu bằng "use": `useAuth.js`, `useWindowSize.js`

### Hàm và biến

- Sử dụng camelCase: `getUserData()`, `isAuthenticated`

### Constants

- Sử dụng UPPER_SNAKE_CASE: `API_ENDPOINT`, `MAX_FILE_SIZE`

## Cấu trúc Component

### Functional Component

```jsx
import React from "react";
import PropTypes from "prop-types";

const ComponentName = ({ prop1, prop2 }) => {
  // Logic ở đây

  return <div>{/* JSX ở đây */}</div>;
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

## Import Order

1. React và các thư viện React
2. Thư viện bên thứ ba
3. Components
4. Hooks
5. Utils và services
6. Assets và styles

Ví dụ:

```jsx
// 1. React và các thư viện React
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Thư viện bên thứ ba
import { Button, TextField } from "@mui/material";
import axios from "axios";

// 3. Components
import Header from "../common/Header";

// 4. Hooks
import { useAuth } from "../../hooks/useAuth";

// 5. Utils và services
import { formatDate } from "../../utils/helpers";
import { userService } from "../../services/userService";

// 6. Assets và styles
import "./styles.css";
import logo from "../../assets/images/logo.png";
```

## State Management

### Khi nào dùng Redux

- Khi state cần được truy cập bởi nhiều components không liên quan
- Khi state phức tạp và có nhiều actions
- Khi bạn cần serialize state hoặc phục hồi từ localStorage

### Khi nào dùng Context API

- Khi state cần được truy cập bởi nhiều components con
- Khi state đơn giản hoặc ít thay đổi
- Khi bạn không cần serialize hoặc debug state một cách phức tạp

### Khi nào dùng local state

- Khi state chỉ được sử dụng trong một component
- Khi state không cần lưu giữa các lần re-renders

## API Calls

- Sử dụng service pattern
- Xử lý lỗi một cách nhất quán
- Sử dụng loading state và error state

## Performance Optimization

- Sử dụng React.memo cho components thuần UI
- Sử dụng useCallback và useMemo cho hàm và giá trị tính toán phức tạp
- Lazy loading components với React.lazy và Suspense

## Testing

- Viết unit tests cho utils và hooks
- Viết integration tests cho các flows quan trọng
- Sử dụng snapshot tests cho components UI

## Git Workflow

- Mỗi tính năng/bug fix nên có một branch riêng
- Pull requests nên nhỏ và tập trung
- Commit message nên rõ ràng và mô tả thay đổi

## Code Comments

- Comment các hàm phức tạp
- Comment các logic nghiệp vụ đặc biệt
- Sử dụng JSDoc cho API công khai

## Accessibility

- Sử dụng semantic HTML
- Đảm bảo keyboard navigation
- Cung cấp alt text cho hình ảnh
- Đảm bảo đủ contrast cho text

## Deployment

- Kiểm tra lỗi với ESLint trước khi build
- Tối ưu bundle size
- Test trên nhiều trình duyệt

## Tài liệu tham khảo

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/introduction/getting-started)
- [Material UI Documentation](https://mui.com/getting-started/usage/)
