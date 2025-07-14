package com.healapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendDeleteVerificationRequest {

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}