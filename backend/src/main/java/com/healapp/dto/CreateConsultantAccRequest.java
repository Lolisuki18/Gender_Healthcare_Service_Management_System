package com.healapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateConsultantAccRequest {
    @NotBlank(message = "Full name not blank!")
    private String fullName;

    @NotBlank(message = "Email not blank!")
    @Email
    private String email;
}
