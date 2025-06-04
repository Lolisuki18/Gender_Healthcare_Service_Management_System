/**
 * Footer.js - Thành phần chân trang của ứng dụng
 *
 * Component này tạo phần chân trang (footer) xuất hiện ở dưới cùng mọi trang trong ứng dụng,
 * chứa thông tin bản quyền, liên kết chính sách và các thông tin pháp lý khác.
 *
 * Lý do tạo file:
 * - Cung cấp thông tin quan trọng về pháp lý và liên hệ
 * - Tạo điểm kết thúc trực quan cho mỗi trang
 * - Áp dụng thiết kế responsive với Material UI
 *
 * Các tính năng:
 * - Hiển thị thông tin bản quyền với năm hiện tại
 * - Liên kết đến các trang chính sách và điều khoản
 * - Tự động điều chỉnh màu sắc dựa trên chế độ sáng/tối
 */

import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          Gender Health Care © {new Date().getFullYear()}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {"All Rights Reserved | "}
          <Link color="inherit" href="/">
            Privacy Policy
          </Link>
          {" | "}
          <Link color="inherit" href="/">
            Terms of Service
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
