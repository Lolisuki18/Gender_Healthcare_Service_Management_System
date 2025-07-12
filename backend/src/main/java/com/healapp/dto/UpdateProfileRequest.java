package com.healapp.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Pattern(regexp = "^(Nam|Nữ|Khác)$", message = "Giới tính phải là: Nam, Nữ, hoặc Khác")
    private String gender;

    private LocalDate birthDay;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;
}