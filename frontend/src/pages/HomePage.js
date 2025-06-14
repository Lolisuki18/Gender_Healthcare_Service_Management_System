import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import localStorageUtil from "@/utils/localStorage";
import notification from "@/utils/notification";

export const HomePage = () => {
  // --- LIFECYCLE HOOKS ---
  useEffect(() => {
    // Kiểm tra và hiển thị thông báo đăng nhập thành công
    const loginMessage = localStorageUtil.get("loginSuccessMessage");

    if (loginMessage) {
      // Hiển thị thông báo
      notification.success(
        loginMessage.title || "Đăng nhập thành công!",
        loginMessage.message || "Chào mừng bạn trở lại!",
        {
          duration: 3000,
        }
      );

      // XÓA NGAY LẬP TỨC để tránh hiển thị lại
      localStorageUtil.remove("loginSuccessMessage");
    }

    console.log("HomePage component mounted");
  }, []); // Chỉ chạy 1 lần khi component mount

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
          color: "#fff",
          py: 8,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Welcome to Gender Health Care
          </Typography>
          <Typography variant="h5" paragraph sx={{ opacity: 0.95 }}>
            Specialized healthcare solutions for all gender identities
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(45deg, #2E86AB, #A23B72)",
              color: "#fff",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(46, 134, 171, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #246A87, #8B2F5F)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(46, 134, 171, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Book an Appointment
          </Button>
        </Container>
      </Box>

      {/* Featured Services */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          sx={{
            mb: 4,
            color: "#2C5282",
            fontWeight: 600,
          }}
        >
          Our Services
        </Typography>
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item key={item} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 8px rgba(74, 144, 226, 0.15)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 24px rgba(74, 144, 226, 0.25)",
                    border: "1px solid #4A90E2",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://source.unsplash.com/random/300×200/?health&sig=${item}`}
                  alt={`Service ${item}`}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{
                      color: "#2D3748",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Service {item}
                  </Typography>
                  <Typography sx={{ color: "#4A5568", lineHeight: 1.6 }}>
                    This is a description for the health service. We provide
                    specialized care for all gender identities.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)",
          py: 6,
          borderTop: "1px solid #E2E8F0",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: "#2D3748",
              fontWeight: 600,
              mb: 2,
            }}
          >
            Join our community
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            paragraph
            sx={{
              color: "#4A5568",
              fontSize: "1.125rem",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Sign up for our newsletter to receive the latest updates and health
            tips
          </Typography>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(45deg, #4A90E2, #1ABC9C)",
                color: "#fff",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(74, 144, 226, 0.25)",
                "&:hover": {
                  background: "linear-gradient(45deg, #357ABD, #16A085)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(74, 144, 226, 0.35)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
