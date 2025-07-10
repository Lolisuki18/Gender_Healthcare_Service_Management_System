package com.healapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhoneVerificationRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+]{10,15}$", message = "Invalid phone number format")
    private String phone;
}
