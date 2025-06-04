import React, { createContext, useContext, useState, useEffect } from "react";
import { getWithExpiry, setWithExpiry } from "@utils/helpers";

// Tạo context cho thông tin người dùng
const UserContext = createContext();

// Hook tùy chỉnh để sử dụng UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider Component để quản lý trạng thái người dùng
export const UserProvider = ({ children }) => {
  // Trạng thái người dùng
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Kiểm tra xem có thông tin người dùng trong localStorage hay không
        const storedUser = getWithExpiry("user");

        if (storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        setError("Không thể xác thực người dùng");
        console.error("Error checking authentication:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Hàm đăng nhập
  const login = async (userData) => {
    try {
      setIsLoading(true);

      // Giả lập gọi API đăng nhập
      // Thay thế bằng cuộc gọi API thực khi có backend
      // const response = await apiClient.post('/auth/login', userData);
      // const { user, token } = response.data;

      // Mô phỏng response
      const mockUser = {
        id: "1",
        name: "Người dùng mẫu",
        email: userData.email,
        role: "user",
      };

      const mockToken = "fake-jwt-token";

      // Lưu thông tin người dùng vào state và localStorage
      setUser(mockUser);
      setWithExpiry("user", mockUser, 60); // Lưu trong 60 phút
      localStorage.setItem("token", mockToken);

      return { success: true };
    } catch (err) {
      setError("Đăng nhập không thành công");
      console.error("Login error:", err);
      return {
        success: false,
        message: err.message || "Đăng nhập không thành công",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Giá trị sẽ được cung cấp cho context
  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
