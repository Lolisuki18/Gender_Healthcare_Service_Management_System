import React, { useState, useEffect } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import NoLoggedInView from "@components/common/NoLoggedInView";
import ConsultantProfile from "@components/ConsultantProfile/ConsultantProfile";
import StaffProfile from "@components/StaffProfile/StaffProfile";
import CustomerProfile from "@components/CustomerProfile/CustomerProfile";
import localStorageUtil from "@utils/localStorage";
import styled from "styled-components";

// Styled components
// LoadingContainer: Hiển thị khi đang tải thông tin người dùng
const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;
// ProfileContainer: Container chính cho trang profile
const ProfileContainer = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`;
// ErrorContainer: Hiển thị khi có lỗi trong quá trình tải thông tin người dùng
const ErrorContainer = styled(Box)`
  margin: 48px auto;
  max-width: 480px;
  padding: 32px;
  background: #1e293b;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
`;
// ProfilePage: Component chính cho trang profile
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập thời gian tải dữ liệu từ localStorage
    const timer = setTimeout(() => {
      try {
        // Lấy thông tin user từ localStorage
        const userData = localStorageUtil.get("userProfile");

        //*Debugging: In ra thông tin userData để kiểm tra
        console.log(
          "ProfilePage - Retrieved user data from localStorage:",
          userData
        );

        // Kiểm tra xem userData có tồn tại không
        if (userData) {
          // nếu có dữ liệu user
          setUser(userData);
        } else {
          // nếu không có dữ liệu user
          //*Debugging: In ra kiểm tra thử
          console.log("ProfilePage - No user data found in localStorage");
        }
      } catch (error) {
        // nếu không lấy thành công dữ liệu từ localStorage
        console.error("Error parsing user data:", error);
        // Nếu có lỗi, clear localStorage và redirect
        localStorageUtil.remove("userProfile");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
  }, []);

  // Kiểm tra trạng thái loading và hiển thị thông báo tương ứng
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
  // Nếu không có user, hiển thị NoLoggedInView
  if (!user) {
    return <NoLoggedInView />;
  }

  // Render component tương ứng với role
  const renderProfileByRole = () => {
    // Kiểm tra định dạng dữ liệu user trước khi truy cập role
    console.log("User data structure:", user); // Kiểm tra hai cấu trúc dữ liệu có thể có (hoặc là {data: {...}} hoặc là trực tiếp object)
    console.log("Kiểm tra cấu trúc dữ liệu user:", user); // In ra cấu trúc dữ liệu user để kiểm tra
    let role = null;
    // Kiểm tra xem user có thuộc dạng {data: {...}} hay không
    if (user.data?.role) {
      // Nếu dữ liệu theo cấu trúc {data: {...}}
      role = user.data.role.toLowerCase();
      //*Debugging: In ra role để kiểm tra
      console.log(
        "Role from user.data.role:",
        user.data.role,
        "-> lowercase:",
        role
      );
    } else if (user.role) {
      // Nếu dữ liệu trực tiếp không có data
      role = user.role.toLowerCase();
      console.log("Role from user.role:", user.role, "-> lowercase:", role);
    }

    if (!role) {
      // nếu hok có role
      // Nếu role không được xác định, hiển thị thông báo lỗi
      console.error("User role is undefined:", user);
      return (
        <ErrorContainer>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ color: "#f59e0b", fontWeight: "bold", textAlign: "center" }}
          >
            Không tìm thấy vai trò người dùng
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255, 255, 255, 0.8)", textAlign: "center" }}
          >
            Vui lòng đăng nhập lại để tiếp tục.
          </Typography>
        </ErrorContainer>
      );
    }

    // Kiểm tra với cả lowercase và uppercase
    console.log("Checking role matches for:", role);

    // Convert role to lowercase and handle both case formats
    switch (role) {
      // case "admin":
      //   return <AdminProfile user={user} />;
      case "consultant": // nếu role là consultant
        console.log("Rendering ConsultantProfile");
        //truyển user vào ConsultantProfile
        // và hiển thị ConsultantProfile
        return <ConsultantProfile user={user} />;
      case "staff":
        // nếu role là staff
        console.log("Rendering StaffProfile");
        // truyền user vào StaffProfile
        // và hiển thị StaffProfile
        return <StaffProfile user={user} />;
      case "customer":
        //nếu role là customer
        console.log("Rendering CustomerProfile");
        // truyền user vào CustomerProfile
        // và hiển thị CustomerProfile
        return <CustomerProfile user={user} />;
      default:
        //con nếu role không khớp với bất kỳ trường hợp nào
        console.log("Role not recognized, showing error view. Role:", role);
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
              Vai trò "{user.data?.role || user.role}" không được hỗ trợ.
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
    // Hiển thị container chính với các component đã render
    <ProfileContainer maxWidth={false} disableGutters>
      {renderProfileByRole()}
    </ProfileContainer>
  );
};

export default ProfilePage;
