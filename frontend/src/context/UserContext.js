import React, { createContext, useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWithExpiry } from "@utils/helpers";
import {
  selectUser,
  selectAvatar,
  selectIsAuthenticated,  
} from "@/redux/slices/authSlice";
import { fetchCurrentUser, logoutUser } from "@/redux/thunks/userThunks";
import { loginUser } from "@/redux/thunks/userThunks";

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
  const dispatch = useDispatch();

  // Lấy thông tin user từ Redux store
  const user = useSelector(selectUser);
  const avatarUrl = useSelector(selectAvatar);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Trạng thái local
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAvatar, setUserAvatar] = useState(avatarUrl);

  // Cập nhật avatar local khi avatar trong Redux thay đổi
  useEffect(() => {
    setUserAvatar(avatarUrl);
  }, [avatarUrl]);

  // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Kiểm tra token trong localStorage
        const token = localStorage.getItem("token");

        if (token) {
          // Nếu có token, lấy thông tin người dùng từ API
          // Sử dụng skipAutoRedirect để tránh redirect tự động trên các trang public
          console.log("🔍 [UserContext] Calling fetchCurrentUser with skipAutoRedirect=true");
          await dispatch(fetchCurrentUser(true)).unwrap();
          console.log("UserContext: Đã tải thông tin người dùng từ API");
        } else {
          console.log("UserContext: Không tìm thấy token trong localStorage");
        }
      } catch (err) {
        setError("Không thể xác thực người dùng");
        console.error("Error checking authentication:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, [dispatch]);
  // Hàm đăng nhập sử dụng Redux
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);

      // Dispatch action đăng nhập từ Redux thunk
      await dispatch(loginUser(credentials)).unwrap();

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

  // Hàm đăng xuất sử dụng Redux
  const logout = async () => {
    try {
      // Dispatch action đăng xuất từ Redux thunk
      await dispatch(logoutUser()).unwrap();
      console.log("UserContext: Đã đăng xuất thành công");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  // Giá trị sẽ được cung cấp cho context
  const value = {
    user,
    userAvatar,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
