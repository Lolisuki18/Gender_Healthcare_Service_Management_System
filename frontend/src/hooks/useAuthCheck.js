import { useState, useEffect } from "react";
import localStorageUtil from "@/utils/localStorage";

const useAuthCheck = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorageUtil.get("token");
    if (token && token.accessToken) {
      setIsLoggedIn(true);
      setUser(token); // hoặc fetch profile nếu muốn
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    // Cleanup function khi component unmount
    return () => {};
  }, []);

  const logout = () => {
    localStorageUtil.remove("token");
    localStorageUtil.remove("userProfile");
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
