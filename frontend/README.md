# Gender Health Care Frontend

Đây là dự án frontend cho ứng dụng Gender Health Care, một nền tảng cung cấp dịch vụ chăm sóc sức khỏe chuyên biệt.

## Cấu trúc Dự Án

```
src/
├── assets/                # Tài nguyên tĩnh (images, styles)
│   └── styles/            # Biến CSS, file style phụ trợ
├── components/            # Các components React
│   ├── common/            # Components dùng chung (Header, Footer, Button...)
│   ├── layouts/           # Layout tổng thể (MainLayout...)
│   ├── AdminProfile/      # Giao diện & sidebar cho Admin
│   ├── ConsultantProfile/ # Giao diện & sidebar cho Tư vấn viên
│   ├── CustomerProfile/   # Giao diện & sidebar cho Khách hàng, các content trang con
│   └── StaffProfile/      # Giao diện & sidebar cho Nhân viên
├── context/               # React Context API (Theme, User...)
├── hooks/                 # Custom hooks (useAuthCheck, useLocalStorage...)
├── pages/                 # Các trang chính (HomePage, LoginPage, RegisterPage...)
├── redux/                 # Redux store, slices (authSlice...)
│   └── slices/            # Các slice quản lý state
├── services/              # Gọi API (api.js, userService.js...)
├── styles/                # File CSS riêng cho từng component/layout
└── utils/                 # Hàm tiện ích (helpers, localStorage, notification...)

public/                    # File tĩnh public (index.html, manifest, favicon...)


Các file cấu hình chính:
- package.json, jsconfig.json, craco.config.js
- README.md, ARCHITECTURE.md
```

## Công nghệ sử dụng

- React.js
- Redux & Redux Toolkit
- React Router DOM
- Material UI
- Axios
- Styled Components

## Bắt Đầu

Dự án này được khởi tạo bằng [Create React App](https://github.com/facebook/create-react-app).

## Các Lệnh Khả Dụng

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
