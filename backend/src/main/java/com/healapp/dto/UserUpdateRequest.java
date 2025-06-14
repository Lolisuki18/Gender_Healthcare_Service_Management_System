package com.healapp.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @Past(message = "Birth day must be in the past")
    private LocalDate birthDay;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be between 10 and 11 digits")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^$|^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,100}$", message = "Password must be empty or contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character and be 6-100 characters long")
    private String password;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;
    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "MALE|FEMALE|OTHER|Nam|Nữ|Khác", message = "Gender must be MALE, FEMALE, OTHER, Nam, Nữ, or Khác")
    private String gender;

    @NotNull(message = "isActive flag is required")
    private Boolean isActive;

    @NotBlank(message = "Role is required")
    private String role;
}
