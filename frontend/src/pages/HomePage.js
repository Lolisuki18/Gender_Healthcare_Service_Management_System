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
          bgcolor: "#10b981",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Gender Health Care
          </Typography>
          <Typography variant="h5" paragraph>
            Specialized healthcare solutions for all gender identities
          </Typography>
          <Button variant="contained" color="secondary" size="large">
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
          sx={{ mb: 4 }}
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
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-8px)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://source.unsplash.com/random/300×200/?health&sig=${item}`}
                  alt={`Service ${item}`}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Service {item}
                  </Typography>
                  <Typography>
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
      <Box sx={{ bgcolor: "secondary.light", py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Join our community
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph>
            Sign up for our newsletter to receive the latest updates and health
            tips
          </Typography>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button variant="contained" color="primary">
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
