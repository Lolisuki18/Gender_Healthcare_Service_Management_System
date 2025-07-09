package com.healapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.PaymentInfoRequest;
import com.healapp.dto.PaymentInfoResponse;
import com.healapp.service.PaymentInfoService;
import com.healapp.service.UserService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;   

@Slf4j
@RestController
@RequestMapping("/payment-info")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class PaymentInfoController {

    @Autowired
    private PaymentInfoService paymentInfoService;

    @Autowired
    private UserService userService;

    // Lấy tất cả thẻ của user hiện tại
    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentInfoResponse>>> getUserPaymentInfos() {
        try {
            Long userId = getCurrentUserId();
            ApiResponse<List<PaymentInfoResponse>> response = paymentInfoService.getUserPaymentInfos(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in getUserPaymentInfos: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Error retrieving payment methods"));
        }
    }

    // Lấy thẻ mặc định của user hiện tại
    @GetMapping("/default")
    public ResponseEntity<ApiResponse<PaymentInfoResponse>> getDefaultPaymentInfo() {
        try {
            Long userId = getCurrentUserId();
            ApiResponse<PaymentInfoResponse> response = paymentInfoService.getDefaultPaymentInfo(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in getDefaultPaymentInfo: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Error retrieving default payment method"));
        }
    }

    // Lấy thẻ theo ID (với CVV để thanh toán)
    @GetMapping("/{paymentInfoId}/for-payment")
    public ResponseEntity<ApiResponse<PaymentInfoResponse>> getPaymentInfoForPayment(@PathVariable Long paymentInfoId) {
        try {
            Long userId = getCurrentUserId();
            ApiResponse<PaymentInfoResponse> response = paymentInfoService.getPaymentInfoForPayment(paymentInfoId, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in getPaymentInfoForPayment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Error retrieving payment method"));
        }
    }

    // Tạo thẻ mới
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentInfoResponse>> createPaymentInfo(@Valid @RequestBody PaymentInfoRequest request) {
        try {
            Long userId = getCurrentUserId();
            ApiResponse<PaymentInfoResponse> response = paymentInfoService.createPaymentInfo(request, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in createPaymentInfo: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Error adding payment method"));
        }
    }

    // Cập nhật thẻ
    @PutMapping("/{paymentInfoId}")
    public ResponseEntity<ApiResponse<PaymentInfoResponse>> updatePaymentInfo(
            @PathVariable Long paymentInfoId,
            @Valid @RequestBody PaymentInfoRequest request) {
        try {
            Long userId = getCurrentUserId();
            ApiResponse<PaymentInfoResponse> response = paymentInfoService.updatePaymentInfo(paymentInfoId, request, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in updatePaymentInfo: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Error updating payment method"));
        }
    }

    // Xóa thẻ
    @DeleteMapping("/{paymentInfoId}")
    public ResponseEntity<ApiResponse<String>> deletePaymentInfo(@PathVariable Long paymentInfoId) {
        try {
            Long userId = getCurrentUserId();
            ApiResponse<String> response = paymentInfoService.deletePaymentInfo(paymentInfoId, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in deletePaymentInfo: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Error deleting payment method"));
        }
    }

    // Đặt thẻ làm mặc định
    @PutMapping("/{paymentInfoId}/set-default")
    public ResponseEntity<ApiResponse<PaymentInfoResponse>> setDefaultPaymentInfo(@PathVariable Long paymentInfoId) {
        try {
            Long userId = getCurrentUserId();
            ApiResponse<PaymentInfoResponse> response = paymentInfoService.setDefaultPaymentInfo(paymentInfoId, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in setDefaultPaymentInfo: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Error setting default payment method"));
        }
    }

    // Helper method để lấy user ID hiện tại
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }
} 