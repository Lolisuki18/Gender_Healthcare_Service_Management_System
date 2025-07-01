// Description: Hiển thị giao diện người dùng đã đăng nhập với thông tin người dùng và nút đăng xuất
//LoggedInView.js
//Mục đích : Nếu người dùng đã đăng nhập rồi mà cố gắng truy cập vào trang đăng nhập thì sẽ redirect đến trang này
import React, { useState, useEffect } from "react";
import {
  alpha,
  Avatar,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import localStorageUtil from "@/utils/localStorage";
import imageUrl from "@/utils/imageUrl";
import { listenToAvatarUpdates } from "@/utils/storageEvent";
import { notify } from "@/utils/notify";

const LoggedInView = ({ user, onLogout }) => {
  const theme = useTheme();
  const [avatarSrc, setAvatarSrc] = useState(
    imageUrl.getFullImageUrl(user.avatar || user.avatarUrl) || undefined
  );

  // Thiết lập listener cho sự kiện cập nhật avatar
  useEffect(() => {
    const unsubscribe = listenToAvatarUpdates((newAvatarUrl) => {
      if (newAvatarUrl) {
        console.log(
          "LoggedInView nhận được sự kiện cập nhật avatar:",
          newAvatarUrl
        );
        setAvatarSrc(imageUrl.getFullImageUrl(newAvatarUrl));
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  const handleLogout = () => {
    onLogout();
    notify.info("Đăng xuất", "Bạn đã đăng xuất khỏi hệ thống");
    // Xóa tất cả thông tin người dùng khỏi localStorage
    localStorageUtil.remove("userProfile");
    localStorageUtil.remove("token");
    window.location.href = "/login"; // Redirect to login page after logout
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 3,
          background: `linear-gradient(145deg, ${alpha(
            theme.palette.primary.light,
            0.1
          )}, ${alpha(theme.palette.background.paper, 1)})`,
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.dark, 0.15)}`,
        }}
      >
        {" "}
        <Avatar
          sx={{
            m: 1,
            bgcolor: theme.palette.success.main,
            width: 90,
            height: 90,
            boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`,
          }}
          src={avatarSrc}
        >
          {!avatarSrc && user.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography
          variant="h4"
          sx={{
            mt: 3,
            fontWeight: "bold",
            color: theme.palette.primary.main,
          }}
        >
          Xin chào, {user.username}!
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 2, mb: 4, textAlign: "center", fontSize: "1.1rem" }}
        >
          Bạn đã đăng nhập rồi. Bạn có thể tiếp tục sử dụng các tính năng của hệ
          thống.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.location.href = "/";
          }}
          startIcon={<HomeIcon />}
          sx={{
            mb: 2,
            py: 1.5,
            px: 4,
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            fontSize: "1rem",
            textTransform: "none",
          }}
        >
          Đi đến trang chủ
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 2,
            fontWeight: "medium",
            textTransform: "none",
            fontSize: "0.95rem",
          }}
        >
          Đăng xuất
        </Button>
      </Paper>
    </Container>
  );
};

export default LoggedInView;
