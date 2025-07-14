package com.healapp.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String avatar;
    private String role;
    private LocalDate birthDay;
    private String phone;
    private String provider; // Thêm provider để frontend biết user đăng nhập qua Google hay Local
}