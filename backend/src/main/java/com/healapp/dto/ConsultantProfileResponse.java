package com.healapp.dto;

import lombok.Data;
import java.time.LocalDateTime;

import com.healapp.model.Gender;

@Data
public class ConsultantProfileResponse {
    private Long profileId;
    private Long userId;
    private String fullName;
    // chỉ hiện khi admin xem profile consultant
    private String username;
    private String email;
    private String address;

    private boolean isActive;
    private String phone;
    private String avatar;
    private String qualifications;
    private String experience;
    private String bio;
    private LocalDateTime updatedAt;
    private Gender gender;
}