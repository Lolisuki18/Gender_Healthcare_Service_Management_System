import React, { createContext, useContext, useState, useEffect } from "react";
import { getWithExpiry, setWithExpiry } from "@utils/helpers";
import { listenToAvatarUpdates } from "@/utils/storageEvent";

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
  const [userAvatar, setUserAvatar] = useState(null);

  // Lắng nghe sự kiện cập nhật avatar
  useEffect(() => {
    const unsubscribe = listenToAvatarUpdates((newAvatarUrl) => {
      if (newAvatarUrl) {
        setUserAvatar(newAvatarUrl);

        // Cập nhật trạng thái user nếu có, đảm bảo giữ cấu trúc dữ liệu đúng
        setUser((prevUser) => {
          if (!prevUser) return prevUser;

          // Nếu user có cấu trúc data (cấu trúc chuẩn)
          if (prevUser.data) {
            return {
              ...prevUser,
              data: {
                ...prevUser.data,
                avatar: newAvatarUrl,
              },
            };
          }
          // Nếu user là object trực tiếp
          else {
            return { ...prevUser, avatar: newAvatarUrl };
          }
        });

        // Force a re-render with a small delay
        setTimeout(() => {
          // This will force components to re-check localStorage
          window.dispatchEvent(new Event("storage"));
        }, 100);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Kiểm tra cả userProfile và token trong localStorage
        const userProfile = localStorage.getItem("userProfile");
        const token = localStorage.getItem("token");

        if (userProfile && token) {
          // Parse userProfile từ JSON string
          const parsedUserProfile = JSON.parse(userProfile);
          setUser(parsedUserProfile);

          console.log(
            "UserContext: Đã tải thông tin người dùng từ localStorage",
            parsedUserProfile
          );
        } else {
          console.log(
            "UserContext: Không tìm thấy thông tin đăng nhập trong localStorage"
          );
          setUser(null);
        }
      } catch (err) {
        setError("Không thể xác thực người dùng");
        console.error("Error checking authentication:", err);
        // Nếu có lỗi, xóa dữ liệu người dùng để tránh lỗi lặp lại
        localStorage.removeItem("userProfile");
        localStorage.removeItem("token");
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
    // Xóa tất cả dữ liệu người dùng khỏi localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("token");
    console.log("UserContext: Đã đăng xuất và xóa dữ liệu khỏi localStorage");
  };

  // Giá trị sẽ được cung cấp cho context
  const value = {
    user,
    userAvatar,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
