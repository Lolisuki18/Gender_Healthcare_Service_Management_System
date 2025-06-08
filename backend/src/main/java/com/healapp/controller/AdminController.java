package com.healapp.controller;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ConsultantProfileRequest;
import com.healapp.dto.ConsultantProfileResponse;
import com.healapp.dto.CreateConsultantAccRequest;
import com.healapp.dto.STIServiceRequest;
import com.healapp.dto.STIServiceResponse;
import com.healapp.dto.UserResponse;
import com.healapp.dto.UserUpdateRequest;
import com.healapp.model.UserDtls;
// import com.healapp.service.AppConfigService;
import com.healapp.service.ConsultantService;
import com.healapp.service.STIServiceService;
import com.healapp.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private ConsultantService consultantService;

    @Autowired
    private UserService userService;

    // @Autowired
    // private AppConfigService appConfigService;

    @Autowired
    private STIServiceService stiServiceService;

    // =========================================== CONSULTANT
    // MANAGEMENT========================================

    // Admin xem danh sách tất cả consultant
    @GetMapping("/consultants")
    public ResponseEntity<ApiResponse<List<ConsultantProfileResponse>>> getAllConsultantProfiles(
            @RequestParam(name = "q", required = false) String query) {
        if (query != null && !query.isEmpty()) {
            ApiResponse<List<ConsultantProfileResponse>> response = consultantService
                    .getAllConsultantProfilesByFilters(query);
            return getResponseEntity(response);
        }
        ApiResponse<List<ConsultantProfileResponse>> response = consultantService.getAllConsultantProfiles();
        return getResponseEntity(response);
    }
    // public ResponseEntity<ApiResponse<List<ConsultantProfileResponse>>>
    // getAllActiveConsultant() {
    // ApiResponse<List<ConsultantProfileResponse>> response =
    // consultantService.getAllActiveConsultant();
    // return getResponseEntity(response);
    // }

    // Admin xem chi tiết consultant theo userId
    @GetMapping("/consultants/{userId}")
    public ResponseEntity<ApiResponse<ConsultantProfileResponse>> getConsultantProfileById(@PathVariable Long userId) {
        ApiResponse<ConsultantProfileResponse> response = consultantService.getConsultantProfileById(userId);
        return getResponseEntity(response);
    }

    @DeleteMapping("/consultants/{userId}")
    // public ResponseEntity<ApiResponse<String>> removeConsultantRole(@PathVariable
    // Long userId) {
    // ApiResponse<String> response =
    // consultantService.removeConsultantRole(userId);
    // return getResponseEntity(response);
    // @DeleteMapping("/consultants/{userId}")
    // public ResponseEntity<ApiResponse<String>> removeConsultantRole(@PathVariable
    // Long userId) {
    // ApiResponse<String> response =
    // consultantService.removeConsultantRole(userId);
    // return getResponseEntity(response);
    // }
    public ResponseEntity<ApiResponse<String>> changeAccountStatus(@PathVariable Long userId) {
        ApiResponse<String> response = consultantService.changeAccountStatus(userId);
        return getResponseEntity(response);
    }

    @PostMapping("/consultants")
    public ResponseEntity<ApiResponse<UserDtls>> createNewConsultantAccount(
            @RequestBody @Valid CreateConsultantAccRequest request) {
        ApiResponse<UserDtls> response = consultantService.createConsultant(request);
        return getResponseEntity(response);
    }

    // ===================================USER
    // MANAGEMENT============================================

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
            @RequestParam(value = "role", required = false) String role) {
        ApiResponse<List<UserResponse>> response;
        // @GetMapping("/users")
        // public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
        // @RequestParam(value = "role", required = false) String role) {
        // ApiResponse<List<UserResponse>> response;

        if (role != null && !role.trim().isEmpty()) {
            response = userService.getUsersByRole(role.trim().toUpperCase());
        } else {
            response = userService.getAllUsers();
        }
        // if (role != null && !role.trim().isEmpty()) {
        // response = userService.getUsersByRole(role.trim().toUpperCase());
        // } else {
        // response = userService.getAllUsers();
        // }

        return getResponseEntity(response);
    }
    // return getResponseEntity(response);
    // }

    @GetMapping("/users/roles")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableRoles() {
        ApiResponse<List<String>> response = userService.getAvailableRoles();
        return getResponseEntity(response);
    }
    // @GetMapping("/users/roles")
    // public ResponseEntity<ApiResponse<List<String>>> getAvailableRoles() {
    // ApiResponse<List<String>> response = userService.getAvailableRoles();
    // return getResponseEntity(response);
    // }

    // @GetMapping("/users/count")
    // public ResponseEntity<ApiResponse<Map<String, Long>>> getUserCountByRole() {
    // ApiResponse<Map<String, Long>> response = userService.getUserCountByRole();
    // return getResponseEntity(response);
    // }

    // @GetMapping("/users/{userId}")
    // public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable
    // Long userId) {
    // ApiResponse<UserResponse> response = userService.getUserById(userId);
    // return getResponseEntity(response);
    // }

    // @PutMapping("/users/{userId}")
    // public ResponseEntity<ApiResponse<UserResponse>> updateUserRoleAndStatus(
    // @PathVariable Long userId,
    // @Valid @RequestBody UserUpdateRequest request) {
    // ApiResponse<UserResponse> response =
    // userService.updateUserRoleAndStatus(userId, request);
    // return getResponseEntity(response);
    // }

    // =================== STI SERVICES WITH COMPONENTS MANAGEMENT
    // ============================

    // @PostMapping("/sti-services")
    // public ResponseEntity<ApiResponse<STIServiceResponse>>
    // createSTIServiceWithComponents(
    // @Valid @RequestBody STIServiceRequest request) {

    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // Long adminUserId = userService.getUserIdFromUsername(username);

    // ApiResponse<STIServiceResponse> response =
    // stiServiceService.createServiceWithComponents(request, adminUserId);
    // return getResponseEntity(response);
    // }

    // @PutMapping("/sti-services/{serviceId}")
    // public ResponseEntity<ApiResponse<STIServiceResponse>>
    // updateSTIServiceWithComponents(
    // @PathVariable Long serviceId,
    // @Valid @RequestBody STIServiceRequest request) {

    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // Long adminUserId = userService.getUserIdFromUsername(username);

    // ApiResponse<STIServiceResponse> response =
    // stiServiceService.updateServiceWithComponents(serviceId, request,
    // adminUserId);
    // return getResponseEntity(response);
    // }

    // @GetMapping("/sti-services/{serviceId}")
    // public ResponseEntity<ApiResponse<STIServiceResponse>>
    // getSTIServiceWithComponents(@PathVariable Long serviceId) {
    // ApiResponse<STIServiceResponse> response =
    // stiServiceService.getServiceWithComponents(serviceId);
    // return getResponseEntity(response);
    // }

    // ========= APP CONFIG MANAGEMENT =========

    // @GetMapping("/config")
    // public ResponseEntity<ApiResponse<Map<String, String>>> getAllConfigs() {
    // ApiResponse<Map<String, String>> response =
    // appConfigService.getCurrentConfig();
    // return getResponseEntity(response);
    // }

    // @PutMapping("/config/{key}")
    // public ResponseEntity<ApiResponse<String>> updateSingleConfig(
    // @PathVariable String key,
    // @RequestBody Map<String, String> request) {

    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // Long adminUserId = userService.getUserIdFromUsername(username);

    // String value = request.get("value");

    // if (value == null) {
    // return ResponseEntity.badRequest().body(
    // ApiResponse.error("Value cannot be null"));
    // }

    // ApiResponse<String> response = appConfigService.updateSingleConfig(key,
    // value.trim(), adminUserId);
    // return getResponseEntity(response);
    // }

    // @PutMapping("/config/{key}/inactive")
    // public ResponseEntity<ApiResponse<String>> setConfigInactive(@PathVariable
    // String key) {
    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // Long adminUserId = userService.getUserIdFromUsername(username);

    // ApiResponse<String> response = appConfigService.toggleConfigStatus(key,
    // false, adminUserId);
    // return getResponseEntity(response);
    // }

    // @PutMapping("/config/{key}/active")
    // public ResponseEntity<ApiResponse<String>> setConfigActive(@PathVariable
    // String key) {
    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // Long adminUserId = userService.getUserIdFromUsername(username);

    // ApiResponse<String> response = appConfigService.toggleConfigStatus(key, true,
    // adminUserId);
    // return getResponseEntity(response);
    // }

    // @PutMapping("/config")
    // public ResponseEntity<ApiResponse<Map<String, String>>> updateAllConfigs(
    // @RequestBody Map<String, String> configData) {

    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // Long adminUserId = userService.getUserIdFromUsername(username);

    // // Validate dữ liệu đầu vào
    // if (configData == null || configData.isEmpty()) {
    // return ResponseEntity.badRequest().body(
    // ApiResponse.error("Config data cannot be empty"));
    // }

    // ApiResponse<Map<String, String>> response =
    // appConfigService.updateMultipleConfigs(configData, adminUserId);
    // return getResponseEntity(response);
    // }

    // @PostMapping("/config")
    // public ResponseEntity<ApiResponse<String>> addNewConfig(
    // @RequestBody Map<String, String> request) {

    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // Long adminUserId = userService.getUserIdFromUsername(username);

    // String key = request.get("key");
    // String value = request.get("value");

    // // Validation
    // if (key == null || key.trim().isEmpty()) {
    // return ResponseEntity.badRequest().body(
    // ApiResponse.error("Config key cannot be empty"));
    // }

    // if (value == null || value.trim().isEmpty()) {
    // return ResponseEntity.badRequest().body(
    // ApiResponse.error("Config value cannot be empty"));
    // }

    // ApiResponse<String> response = appConfigService.addNewConfig(key.trim(),
    // value.trim(), adminUserId);
    // return getResponseEntity(response);
    // }

    // @DeleteMapping("/config/{key}")
    // public ResponseEntity<ApiResponse<String>> deleteConfig(@PathVariable String
    // key) {
    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // Long adminUserId = userService.getUserIdFromUsername(username);

    // ApiResponse<String> response = appConfigService.deleteConfig(key,
    // adminUserId);
    // return getResponseEntity(response);
    // }

    // @PostMapping("/config/{key}/upload")
    // public ResponseEntity<ApiResponse<String>> uploadConfigFile(
    // @PathVariable String key,
    // @RequestParam("file") MultipartFile file) {

    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // Long adminUserId = userService.getUserIdFromUsername(username);

    // ApiResponse<String> response = appConfigService.uploadConfigFile(key, file,
    // adminUserId);
    // return getResponseEntity(response);
    // }

    private <T> ResponseEntity<ApiResponse<T>> getResponseEntity(ApiResponse<T> response) {
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}