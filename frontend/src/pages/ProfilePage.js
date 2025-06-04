import React, { useState, useEffect } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NoLoggedInView from "@components/common/NoLoggedInView";
import AdminProfile from "@components/AdminProfile/AdminProfile";
import ConsultantProfile from "@components/ConsultantProfile/ConsultantProfile";
import StaffProfile from "@components/StaffProfile/StaffProfile";
import CustomerProfile from "@components/CustomerProfile/CustomerProfile";
import localStorageUtil from "@utils/localStorage";
import styled from "styled-components";

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

const ProfileContainer = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`;

const ErrorContainer = styled(Box)`
  margin: 48px auto;
  max-width: 480px;
  padding: 32px;
  background: #1e293b;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
`;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a small delay for better UX
    const timer = setTimeout(() => {
      try {
        // Lấy thông tin user từ localStorage
        const userData = localStorageUtil.get("user");

        // Kiểm tra xem userData có tồn tại không
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Nếu có lỗi, clear localStorage và redirect
        localStorageUtil.remove("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress
          size={60}
          sx={{
            color: "blue",
            mb: 2,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "rgba(57, 37, 208, 0.8)",
            fontWeight: "500",
          }}
        >
          Đang tải thông tin...
        </Typography>
      </LoadingContainer>
    );
  }

  if (!user) {
    return <NoLoggedInView />;
  }

  // Render component tương ứng với role
  const renderProfileByRole = () => {
    const role = user.role?.toLowerCase();
    switch (role) {
      case "admin":
        return <AdminProfile user={user} />;
      case "consultant":
        return <ConsultantProfile user={user} />;
      case "staff":
        return <StaffProfile user={user} />;
      case "customer":
        return <CustomerProfile user={user} />;
      default:
        return (
          <ErrorContainer>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                color: "#f59e0b",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Vai trò không xác định
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                textAlign: "center",
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              Vai trò "{user.role}" không được hỗ trợ.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                fontSize: "0.875rem",
              }}
            >
              Các vai trò được hỗ trợ: Admin, Consultant, Staff, Customer
            </Typography>
          </ErrorContainer>
        );
    }
  };

  return (
    <ProfileContainer maxWidth={false} disableGutters>
      {renderProfileByRole()}
    </ProfileContainer>
  );
};

export default ProfilePage;
