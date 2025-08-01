package com.healapp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private LocalDate birthDay;
    private String gender;
    private String phone;
    private String email;
    private String username;
    private String avatar;
    private Boolean isActive;
    private String role;
    private String address;
    private LocalDateTime createdDate;
    private Boolean isDeleted;
    private LocalDateTime deletedAt;
    private String provider; // Thêm provider để frontend biết user đăng nhập qua Google hay Local
}