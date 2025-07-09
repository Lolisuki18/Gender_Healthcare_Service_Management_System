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

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Facebook,
  Instagram,
  LinkedIn,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showScroll, setShowScroll] = useState(false);

  // Scroll to top logic
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2C5282 0%, #1ABC9C 100%)',
        color: 'white',
        mt: 'auto',
        py: 4,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
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
                mb: 1,
                color: 'white',
              }}
            >
              Gender Health Care
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontStyle: 'italic',
                opacity: 0.85,
                mb: 1,
              }}
            >
              "Chăm sóc sức khỏe - Tôn trọng sự đa dạng"
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
            {/* Social Media Icons */}
            <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
              <Tooltip title="Facebook">
                <IconButton
                  component="a"
                  href="https://www.facebook.com/FPTU.HCM"
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    transition: 'all 0.3s',
                    '&:hover': { bgcolor: '#1877f2', color: '#fff' },
                  }}
                  size="small"
                >
                  <Facebook fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Instagram">
                <IconButton
                  component="a"
                  href="https://www.instagram.com/fptuniversityhcm?fbclid=IwY2xjawLbHNVleHRuA2FlbQIxMABicmlkETFwMXNqZ1BWZnJZZ1gwZWdrAR4xvjCtYeABikRwmJ9q-FjhZc-GJ4zu5v5g1YH0fVW3iA8l31x1vUhQCBiD1A_aem_LY3b5brF0p87V4o73peULw"
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    transition: 'all 0.3s',
                    '&:hover': { bgcolor: '#E1306C', color: '#fff' },
                  }}
                  size="small"
                >
                  <Instagram fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="LinkedIn">
                <IconButton
                  component="a"
                  href="https://daihoc.fpt.edu.vn/?fbclid=IwY2xjawLbHPFleHRuA2FlbQIxMABicmlkETFwMXNqZ1BWZnJZZ1gwZWdrAR6JSHX9gJSYcHIWU8KIF7pwXlrOdcO4kqkaLIWL0HtC9DMtFQAyQCekNcqsAA_aem_2E-tKl-AVUkKSx3oHE9UKg"
                  target="_blank"
                  rel="noopener"
                  sx={{
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    transition: 'all 0.3s',
                    '&:hover': { bgcolor: '#0A66C2', color: '#fff' },
                  }}
                  size="small"
                >
                  <LinkedIn fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'white',
              }}
            >
              Liên kết nhanh
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { href: '/', label: 'Trang chủ' },
                { href: '/sti-services', label: 'Xét nghiệm STIs' },
                { href: '/blog', label: 'Blogs' },
                { href: '/about', label: 'Giới thiệu' },
                { href: '/ovulation', label: 'Chu kì rụng trứng' },
                { href: '/pill-reminder', label: 'Nhắc uống thuốc' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#1ABC9C',
                      bgcolor: 'rgba(255,255,255,0.15)',
                      pl: 2,
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
                color: 'white',
              }}
            >
              Thông tin liên hệ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  info@genderhealthcare.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +84 123 456 789
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  FPT University, Hồ Chí Minh
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 3,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            opacity: 0.6,
          }}
        />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' },
            }}
          >
            <Link
              href="/privacy"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#1ABC9C',
                },
              }}
            >
              Chính sách bảo mật
            </Link>
            <Typography sx={{ opacity: 0.6 }}>|</Typography>
            <Link
              href="/terms"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#1ABC9C',
                },
              }}
            >
              Điều khoản dịch vụ
            </Link>
          </Box>
        </Box>
        {/* Copyright */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              textAlign: 'center',
              fontSize: isMobile ? '0.85rem' : '1rem',
              mt: 1,
            }}
          >
            © {new Date().getFullYear()} Gender Health Care. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
      {/* Scroll to Top Button */}
      {showScroll && (
        <IconButton
          onClick={handleScrollTop}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            bgcolor: '#1ABC9C',
            color: '#fff',
            boxShadow: 3,
            zIndex: 1200,
            '&:hover': { bgcolor: '#2C5282' },
            transition: 'all 0.3s',
          }}
          size="large"
        >
          <KeyboardArrowUp fontSize="inherit" />
        </IconButton>
      )}
    </Box>
  );
};

export default Footer;
