import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { keyframes } from "@mui/system";

// Define animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

export const NotFoundPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
          py: 8,
          px: 4,
          mt: 4,
          mb: 4,
          borderRadius: "24px",
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -100,
            left: -100,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.palette.primary.light}15, transparent 70%)`,
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.palette.secondary.light}15, transparent 70%)`,
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            animation: `${float} 6s ease-in-out infinite`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 70,
              color: theme.palette.primary.main,
              mb: 2,
              animation: `${pulse} 4s infinite ease-in-out`,
            }}
          />

          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: "5rem", sm: "8rem" },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.05em",
              mb: 2,
              textShadow: "2px 2px 15px rgba(0,0,0,0.1)",
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 3,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "4px",
                borderRadius: "2px",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            Trang không tìm thấy
          </Typography>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: "500px",
            fontSize: "1.1rem",
            lineHeight: 1.6,
            mt: 4,
            mb: 2,
            opacity: 0.8,
          }}
        >
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không
          khả dụng.
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<HomeIcon />}
          size="large"
          sx={{
            mt: 4,
            py: 1.5,
            px: 4,
            borderRadius: "50px",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            transition: "all 0.3s ease",
            "&:hover": {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
              transform: "translateY(-2px)",
            },
          }}
        >
          Quay về trang chủ
        </Button>
      </Paper>
    </Container>
  );
};
