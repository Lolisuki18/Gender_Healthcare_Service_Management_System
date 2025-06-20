package com.healapp.controller;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.AvailableTimeSlot;
import com.healapp.dto.ConsultantProfileResponse;
import com.healapp.dto.ConsultationRequest;
import com.healapp.dto.ConsultationResponse;
import com.healapp.dto.ConsultationStatusRequest;
import com.healapp.model.ConsultationStatus;
import com.healapp.model.UserDtls;
import com.healapp.service.ConsultantService;
import com.healapp.service.ConsultationService;
import com.healapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @Autowired
    private UserService userService;

    @Autowired
    private ConsultantService consultantService;

    @GetMapping("/consultants")
    public ResponseEntity<ApiResponse<List<UserDtls>>> getAllConsultantMembers() {
        ApiResponse<List<UserDtls>> response = consultationService.getAllConsultantMembers();
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/available-slots")
    public ResponseEntity<ApiResponse<List<AvailableTimeSlot>>> getAvailableTimeSlots(
            @RequestParam Long consultantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        ApiResponse<List<AvailableTimeSlot>> response = consultationService.getAvailableTimeSlots(consultantId, date);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ConsultationResponse>> createConsultation(
            @Valid @RequestBody ConsultationRequest request) {

        // Lấy ID của người dùng
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long userId = userService.getUserIdFromUsername(username);

        ApiResponse<ConsultationResponse> response = consultationService.createConsultation(request, userId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{consultationId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ConsultationResponse>> updateConsultationStatus(
            @PathVariable Long consultationId,
            @Valid @RequestBody ConsultationStatusRequest request) {

        // Lấy ID của người dùng hiện tại
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long userId = userService.getUserIdFromUsername(username);

        ApiResponse<ConsultationResponse> response = consultationService.updateConsultationStatus(
                consultationId, request.getStatus(), userId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/my-consultations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ConsultationResponse>>> getUserConsultations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long userId = userService.getUserIdFromUsername(username);

        ApiResponse<List<ConsultationResponse>> response = consultationService.getConsultationsForUser(userId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ConsultationResponse>>> getConsultationsByStatus(
            @PathVariable ConsultationStatus status) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long userId = userService.getUserIdFromUsername(username);

        ApiResponse<List<ConsultationResponse>> response = consultationService.getConsultationsByStatus(status, userId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<ApiResponse<List<ConsultationResponse>>> getAssignedConsultations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long consultantId = userService.getUserIdFromUsername(username);

        ApiResponse<List<ConsultationResponse>> response = consultationService
                .getConsultationsForConsultant(consultantId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/consultant/{consultantId}/profile")
    public ResponseEntity<ApiResponse<ConsultantProfileResponse>> getConsultantProfileForConsultation(
            @PathVariable Long consultantId) {
        ApiResponse<ConsultantProfileResponse> response = consultantService.getConsultantProfileById(consultantId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<ConsultationResponse>>> getAllConsultations() {
        ApiResponse<List<ConsultationResponse>> response = consultationService.getAllConsultations();

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{consultationId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @consultationService.isUserAuthorized(#consultationId, authentication.name)")
    public ResponseEntity<ApiResponse<ConsultationResponse>> getConsultationById(
            @PathVariable Long consultationId) {

        ApiResponse<ConsultationResponse> response = consultationService.getConsultationById(consultationId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}