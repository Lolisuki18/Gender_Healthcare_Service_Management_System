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
import { Box, Container, Typography, Link, Grid, Divider } from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #2C5282 0%, #1ABC9C 100%)",
        color: "white",
        mt: "auto",
        py: 4,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "white",
              }}
            >
              Gender Health Care
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              Dịch vụ chăm sóc sức khỏe chuyên biệt cho mọi bản dạng giới tính.
              Chúng tôi cam kết mang đến dịch vụ y tế chất lượng cao và an toàn.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "white",
              }}
            >
              Liên kết nhanh
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/sti-test", label: "Xét nghiệm STIs" },
                { href: "/blog", label: "Blogs" },
                { href: "/about", label: "Giới thiệu" },
                { href: "/ovulation", label: "Chu kì rụng trứng" },
                { href: "/pill-reminder", label: "Nhắc uống thuốc" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "white",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "white",
              }}
            >
              Thông tin liên hệ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  info@genderhealthcare.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +84 123 456 789
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  FPT University, Hà Nội
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 3,
            borderColor: "rgba(255, 255, 255, 0.2)",
            opacity: 0.6,
          }}
        />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            © {new Date().getFullYear()} Gender Health Care. All rights
            reserved.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-end" },
            }}
          >
            <Link
              href="/privacy"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                fontSize: "0.875rem",
                transition: "color 0.3s ease",
                "&:hover": {
                  color: "white",
                },
              }}
            >
              Chính sách bảo mật
            </Link>
            <Typography sx={{ opacity: 0.6 }}>|</Typography>
            <Link
              href="/terms"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                fontSize: "0.875rem",
                transition: "color 0.3s ease",
                "&:hover": {
                  color: "white",
                },
              }}
            >
              Điều khoản dịch vụ
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
