import { useState, useEffect } from "react";
import localStorageUtil from "@/utils/localStorage";

const useAuthCheck = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorageUtil.get("user");
    if (userData) {
      setIsLoggedIn(true);
      setUser(userData);
    }

    // Cleanup function khi component unmount
    return () => {
      // Xóa tất cả các interval để tránh memory leak
      const intervalId = setInterval(() => {}, 100);
      for (let i = 1; i <= intervalId; i++) {
        clearInterval(i);
      }
    };
  }, []);

  const logout = () => {
    localStorageUtil.remove("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return {
    isLoggedIn,
    user,
    setIsLoggedIn,
    setUser,
    logout,
  };
};

export default useAuthCheck;
