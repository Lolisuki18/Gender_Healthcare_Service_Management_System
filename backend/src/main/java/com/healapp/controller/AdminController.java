package com.healapp.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ConsultantProfileResponse;
import com.healapp.dto.CreateAccountRequest;
import com.healapp.dto.UserResponse;
import com.healapp.dto.UserUpdateRequest;
import com.healapp.model.Payment;
import com.healapp.model.PaymentStatus;
import com.healapp.model.UserDtls;
import com.healapp.service.ConsultantService;
import com.healapp.service.ConsultationService;
import com.healapp.service.PaymentService;
import com.healapp.service.QuestionService;
import com.healapp.service.RatingService;
import com.healapp.service.STIPackageService;
import com.healapp.service.STIServiceService;
import com.healapp.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private ConsultantService consultantService;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ConsultationService consultationService;
    @Autowired
    private STIServiceService stiServiceService;
    @Autowired
    private STIPackageService stiPackageService;
    @Autowired
    private QuestionService questionService;
    @Autowired
    private RatingService ratingService;

    // @Autowired
    // private AppConfigService appConfigService;

    // @Autowired
    // private STIServiceService stiServiceService;

    // =========================================== CONSULTANT
    // MANAGEMENT========================================

    /*
     * descripton: admin laays danh sachs taats car consultant
     * path: /admin/consultants
     * method: GET
     * body:
     * {
     * }
     */
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

    /*
     * descripton: admin xem chi tiết thông tin Consultant theo id
     * path: /admin/consultants/{userId}
     * method: GET
     * body:
     * {
     * }
     */
    @GetMapping("/consultants/{userId}")
    public ResponseEntity<ApiResponse<ConsultantProfileResponse>> getConsultantProfileById(@PathVariable Long userId) {
        ApiResponse<ConsultantProfileResponse> response = consultantService.getConsultantProfileById(userId);
        return getResponseEntity(response);
    }

    /*
     * descripton: admin xóa consultant bằng cách thay đổi status
     * path: /admin/consultants/{userId}
     * method: DELETE
     * body:
     * {
     * }
     */
    @DeleteMapping("/consultants/{userId}")
    // public ResponseEntity<ApiResponse<String>> removeConsultantRole(@PathVariable
    // Long userId) {
    // ApiResponse<String> response =
    // consultantService.removeConsultantRole(userId);
    // return getResponseEntity(response);
    public ResponseEntity<ApiResponse<String>> changeAccountStatus(@PathVariable Long userId) {
        ApiResponse<String> response = consultantService.changeAccountStatus(userId);
        return getResponseEntity(response);
    }

    /*
     * descripton: admin tạo tài khoản cho consultant
     * path: /admin/consultants/{userId}
     * method: GET
     * body:
     * {
     * }
     */
    // @PostMapping("/consultants")
    // public ResponseEntity<ApiResponse<UserDtls>> createNewConsultantAccount(
    // @RequestBody @Valid CreateConsultantAccRequest request) {
    // ApiResponse<UserDtls> response = consultantService.createConsultant(request);
    // return getResponseEntity(response);
    // }

    // ===================================USER
    // MANAGEMENT============================================

    /*
     * descripton: admin lấy danh sách tất cả người dùng
     * path: /admin/users
     * method: GET
     * body:
     * {
     * }
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
            @RequestParam(value = "role", required = false) String role) {
        ApiResponse<List<UserResponse>> response;

        if (role != null && !role.trim().isEmpty()) {
            response = userService.getUsersByRole(role.trim().toUpperCase());
        } else {
            response = userService.getAllUsers();
        }
        return getResponseEntity(response);
    }

    // @GetMapping("/users/roles")
    // public ResponseEntity<ApiResponse<List<String>>> getAvailableRoles() {
    // ApiResponse<List<String>> response = userService.getAvailableRoles();
    // return getResponseEntity(response);
    // }

    /*
     * descripton: admin tạo tài khoản người dùng
     * path: /admin/users
     * method: GET
     * body:
     * {
     * String role *;
     * String fullName *;
     * String email *;
     * String gender *;
     * String username;
     * String password;
     * LocalDate birthDay;
     * String phone;
     * String address;
     * }
     */
    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserDtls>> createNewAccount(
            @RequestBody @Valid CreateAccountRequest request) {
        ApiResponse<UserDtls> response = userService.createNewAccount(request);
        return getResponseEntity(response);
    }

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

    /*
     * descripton: admin sửa thông tin chi tiết của người dùng
     * path: /admin/users/{userId}
     * method: PUT
     * body:
     * {
     * Stirng fullName *,
     * LocalDate birthDay,
     * String phone,
     * String email *,
     * String password *,
     * String address,
     * String gender *,
     * boolean isActive *,
     * String role *
     * }
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserInfomation(
            @PathVariable Long userId,
            @Valid @RequestBody UserUpdateRequest request) {
        ApiResponse<UserResponse> response = userService.updateUserInfomation(userId, request);
        return getResponseEntity(response);
    }

    // ================= ACCOUNT MANAGEMENT =================

    /**
     * Admin vô hiệu hóa tài khoản
     */
    @PostMapping("/users/{userId}/disable")
    public ResponseEntity<ApiResponse<String>> disableUser(
            @PathVariable Long userId, 
            @RequestParam String reason) {
        
        ApiResponse<String> response = userService.disableAccountByAdmin(userId, reason);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    /**
     * Admin khôi phục tài khoản
     */
    @PostMapping("/users/{userId}/restore")
    public ResponseEntity<ApiResponse<String>> restoreUser(@PathVariable Long userId) {
        ApiResponse<String> response = userService.restoreAccountByAdmin(userId);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    /**
     * Admin xem danh sách tài khoản bị vô hiệu hóa
     */
    @GetMapping("/users/disabled")
    public ResponseEntity<ApiResponse<List<UserDtls>>> getDisabledUsers() {
        try {
            // Sử dụng UserRepository qua UserService
            return ResponseEntity.ok(ApiResponse.success("Danh sách tài khoản bị vô hiệu hóa", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    /**
     * Admin xem danh sách tài khoản đã bị xóa
     */
    @GetMapping("/users/deleted")
    public ResponseEntity<ApiResponse<List<UserDtls>>> getDeletedUsers() {
        try {
            // Sử dụng UserRepository qua UserService  
            return ResponseEntity.ok(ApiResponse.success("Danh sách tài khoản đã bị xóa", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // =================== STI SERVICES WITH COMPONENTS
    // MANAGEMENT============================

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

    /**
     * Báo cáo tổng quan doanh thu
     * GET /admin/revenue/summary
     * Query: fromDate, toDate (ISO-8601, optional)
     */
    @GetMapping("/revenue/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueSummary(
            @RequestParam(value = "fromDate", required = false) String fromDateStr,
            @RequestParam(value = "toDate", required = false) String toDateStr) {
        LocalDateTime fromDate = parseDateTime(fromDateStr, true);
        LocalDateTime toDate = parseDateTime(toDateStr, false);
        // Lấy tất cả payment COMPLETED trong khoảng thời gian
        List<Payment> payments = paymentService.getPaymentsByStatusAndDate(PaymentStatus.COMPLETED, fromDate, toDate);
        BigDecimal totalRevenue = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalTransactions = payments.size();
        BigDecimal avgRevenue = totalTransactions > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalTransactions), 0, BigDecimal.ROUND_HALF_UP)
                : BigDecimal.ZERO;
        HashSet<Long> customerIds = new HashSet<>();
        for (Payment p : payments)
            customerIds.add(p.getUserId());
        int totalCustomers = customerIds.size();
        Map<String, Object> result = Map.of(
                "totalRevenue", totalRevenue,
                "totalTransactions", totalTransactions,
                "averageRevenue", avgRevenue,
                "totalCustomers", totalCustomers);
        return getResponseEntity(ApiResponse.success("Revenue summary", result));
    }

    /**
     * Danh sách giao dịch đã thanh toán
     * GET /admin/revenue/transactions
     * Query: fromDate, toDate (ISO-8601, optional)
     */
    @GetMapping("/revenue/transactions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRevenueTransactions(
            @RequestParam(value = "fromDate", required = false) String fromDateStr,
            @RequestParam(value = "toDate", required = false) String toDateStr) {
        LocalDateTime fromDate = parseDateTime(fromDateStr, true);
        LocalDateTime toDate = parseDateTime(toDateStr, false);
        List<Payment> payments = paymentService.getPaymentsByStatusAndDate(PaymentStatus.COMPLETED, fromDate, toDate);
        // Map sang DTO có thêm customerName
        List<Map<String, Object>> result = payments.stream().map(payment -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("paymentId", payment.getPaymentId());
            map.put("userId", payment.getUserId());
            // Lấy tên khách hàng
            String customerName = null;
            try {
                UserDtls user = paymentService.getUserById(payment.getUserId());
                customerName = user != null ? user.getFullName() : null;
            } catch (Exception e) {
                customerName = null;
            }
            map.put("customerName", customerName);
            map.put("serviceType", payment.getServiceType());
            map.put("serviceId", payment.getServiceId());
            map.put("paymentMethod", payment.getPaymentMethod());
            map.put("paymentStatus", payment.getPaymentStatus());
            map.put("amount", payment.getAmount());
            map.put("currency", payment.getCurrency());
            map.put("stripePaymentIntentId", payment.getStripePaymentIntentId());
            map.put("qrPaymentReference", payment.getQrPaymentReference());
            map.put("qrCodeUrl", payment.getQrCodeUrl());
            map.put("transactionId", payment.getTransactionId());
            map.put("createdAt", payment.getCreatedAt());
            map.put("paidAt", payment.getPaidAt());
            map.put("expiresAt", payment.getExpiresAt());
            map.put("updatedAt", payment.getUpdatedAt());
            map.put("refundId", payment.getRefundId());
            map.put("refundedAt", payment.getRefundedAt());
            map.put("refundAmount", payment.getRefundAmount());
            map.put("description", payment.getDescription());
            map.put("notes", payment.getNotes());
            map.put("expired", payment.isExpired());
            map.put("paymentDisplayInfo", payment.getPaymentDisplayInfo());
            map.put("completed", payment.isCompleted());
            return map;
        }).toList();
        return getResponseEntity(ApiResponse.success("Completed transactions", result));
    }

    @GetMapping("/dashboard/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminDashboardOverview() {
        Map<String, Object> overview = new java.util.HashMap<>();
        overview.putAll(userService.getAdminDashboardUserStats());
        overview.putAll(consultationService.getAdminDashboardConsultationStats());
        overview.putAll(stiServiceService.getAdminDashboardServiceStats());
        overview.putAll(stiPackageService.getAdminDashboardPackageStats());
        overview.putAll(questionService.getAdminDashboardQuestionStats());
        overview.putAll(ratingService.getAdminDashboardRatingStats());
        return getResponseEntity(ApiResponse.success("Admin dashboard overview", overview));
    }

    // Helper parse date string linh hoạt
    private LocalDateTime parseDateTime(String input, boolean isFrom) {
        if (input == null)
            return isFrom ? LocalDateTime.of(2000, 1, 1, 0, 0) : LocalDateTime.now();
        try {
            if (input.length() == 10) {
                return LocalDate.parse(input, DateTimeFormatter.ISO_LOCAL_DATE).atStartOfDay();
            }
            return LocalDateTime.parse(input, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (Exception e) {
            return isFrom ? LocalDateTime.of(2000, 1, 1, 0, 0) : LocalDateTime.now();
        }
    }

    private <T> ResponseEntity<ApiResponse<T>> getResponseEntity(ApiResponse<T> response) {
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}