import React, { createContext, useContext, useState, useEffect } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";

// Tạo context cho thông tin theme
const ThemeContext = createContext();

// Hook tùy chỉnh để sử dụng ThemeContext
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a CustomThemeProvider");
  }
  return context;
};

// Các chủ đề có sẵn
const themes = {
  light: createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2",
        light: "#42a5f5",
        dark: "#1565c0",
      },
      secondary: {
        main: "#f50057",
        light: "#ff4081",
        dark: "#c51162",
      },
      background: {
        default: "#f5f5f5",
        paper: "#ffffff",
      },
    },
  }),
  dark: createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9",
        light: "#e3f2fd",
        dark: "#42a5f5",
      },
      secondary: {
        main: "#f48fb1",
        light: "#f8bbd0",
        dark: "#f06292",
      },
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
    },
  }),
};

// Provider Component để quản lý thông tin theme
export const CustomThemeProvider = ({ children }) => {
  // Kiểm tra xem người dùng có lưu theme trong localStorage không
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme && (savedTheme === "light" || savedTheme === "dark")
      ? savedTheme
      : "light"; // Mặc định là theme light
  };

  const [currentTheme, setCurrentTheme] = useState(getSavedTheme);
  const theme = themes[currentTheme];

  // Lưu theme vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  // Hàm thay đổi theme
  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Giá trị sẽ được cung cấp cho context
  const value = {
    theme,
    currentTheme,
    toggleTheme,
    isDarkMode: currentTheme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
