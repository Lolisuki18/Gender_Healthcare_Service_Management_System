package com.healapp.controller;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ConsultantProfileRequest;
import com.healapp.dto.ConsultantProfileResponse;
import com.healapp.service.ConsultantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultants")
public class ConsultantController {

    @Autowired
    private ConsultantService consultantService;

    //customer, consultant, staff xem danh sách consultant có isActive = true
    @GetMapping
    public ResponseEntity<ApiResponse<List<ConsultantProfileResponse>>> getAllConsultants(@RequestParam(name = "name", required = false) String name) {
        ApiResponse<List<ConsultantProfileResponse>> response = consultantService.getAllActiveConsultants();
        if(name == null || name.isEmpty()) {
            return ResponseEntity.ok(response);
        } else {
            response = consultantService.getAllActiveConsultantByFullNameContaining(name);
            return ResponseEntity.ok(response);
        }
    }

    //customer, consultant, staff xem details của consultant có isActive = true
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<ConsultantProfileResponse>> getActiveConsultantProfileById(@PathVariable Long userId) {
        ApiResponse<ConsultantProfileResponse> response = consultantService.getActiveConsultantProfileById(userId);
        return ResponseEntity.ok(response);
    }

    // consultant tự update profile
    @PutMapping("/profile/{userId}")
    @PreAuthorize("hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<ConsultantProfileResponse>> updateOwnProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ConsultantProfileRequest request) {

        ApiResponse<ConsultantProfileResponse> response = consultantService.updateConsultantProfile(userId,
                request);
        return ResponseEntity.ok(response);
    }
}
