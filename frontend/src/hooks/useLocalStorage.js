import { useState, useEffect } from "react";

// Custom hook để quản lý trạng thái từ localStorage
export const useLocalStorage = (key, initialValue) => {
  // Trạng thái để lưu trữ giá trị
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Lấy giá trị từ localStorage bằng key
      const item = window.localStorage.getItem(key);
      // Parse giá trị lưu trữ hoặc trả về initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Trả về một hàm đã wrap để lưu trong localStorage và cập nhật state
  const setValue = (value) => {
    try {
      // Cho phép value là một function giống như useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Lưu state
      setStoredValue(valueToStore);
      // Lưu vào localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Custom hook để quản lý kích thước cửa sổ
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Gọi ngay lần đầu để set giá trị ban đầu

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
