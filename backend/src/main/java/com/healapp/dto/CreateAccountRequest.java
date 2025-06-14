package com.healapp.dto;

import java.time.LocalDate;

import com.healapp.model.Gender;
import com.healapp.model.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccountRequest {

    @NotBlank(message = "Role is required!")
    private String role;

    @NotBlank(message = "Full name is required!")
    private String fullName;

    @NotBlank(message = "Email is required!")
    private String email;
    @NotBlank(message = "Gender is required!")
    @Pattern(regexp = "^(Nam|Nữ|Khác|MALE|FEMALE|OTHER)$", message = "Giới tính phải là: Nam, Nữ, Khác, MALE, FEMALE, hoặc OTHER")
    private String gender;

    @Size(min = 4, max = 50, message = "Username must be between 4 and 50 characters")
    private String username;

    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$", message = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character")
    private String password;

    private LocalDate birthDay;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10-11 digits")
    private String phone;

    private String address;
}
