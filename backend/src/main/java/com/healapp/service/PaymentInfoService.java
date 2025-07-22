package com.healapp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.PaymentInfoRequest;
import com.healapp.dto.PaymentInfoResponse;
import com.healapp.model.PaymentInfo;
import com.healapp.repository.PaymentInfoRepository;
import com.healapp.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PaymentInfoService {

    @Autowired
    private PaymentInfoRepository paymentInfoRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy tất cả thẻ của user
    public ApiResponse<List<PaymentInfoResponse>> getUserPaymentInfos(Long userId) {
        try {
            // Kiểm tra user có tồn tại không
            if (!userRepository.existsById(userId)) {
                return ApiResponse.error("User not found");
            }

            List<PaymentInfo> paymentInfos = paymentInfoRepository.findByUserIdAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(userId);
            List<PaymentInfoResponse> responses = paymentInfos.stream()
                    .map(PaymentInfoResponse::fromEntity)
                    .collect(Collectors.toList());

            return ApiResponse.success("Retrieved " + responses.size() + " payment methods", responses);
        } catch (Exception e) {
            log.error("Error retrieving payment infos for user {}: {}", userId, e.getMessage(), e);
            return ApiResponse.error("Error retrieving payment methods: " + e.getMessage());
        }
    }

    // Lấy thẻ mặc định của user
    public ApiResponse<PaymentInfoResponse> getDefaultPaymentInfo(Long userId) {
        try {
            Optional<PaymentInfo> defaultCard = paymentInfoRepository.findByUserIdAndIsDefaultTrueAndIsActiveTrue(userId);
            
            if (defaultCard.isPresent()) {
                return ApiResponse.success("Default payment method found", 
                    PaymentInfoResponse.fromEntity(defaultCard.get()));
            } else {
                return ApiResponse.error("No default payment method found");
            }
        } catch (Exception e) {
            log.error("Error retrieving default payment info for user {}: {}", userId, e.getMessage(), e);
            return ApiResponse.error("Error retrieving default payment method: " + e.getMessage());
        }
    }

    // Lấy thẻ theo ID (với CVV để thanh toán)
    public ApiResponse<PaymentInfoResponse> getPaymentInfoForPayment(Long paymentInfoId, Long userId) {
        try {
            Optional<PaymentInfo> paymentInfo = paymentInfoRepository.findByPaymentInfoIdAndUserIdAndIsActiveTrue(paymentInfoId, userId);
            
            if (paymentInfo.isPresent()) {
                PaymentInfo card = paymentInfo.get();
                
                // Kiểm tra thẻ có hết hạn không
                if (card.isExpired()) {
                    return ApiResponse.error("Card has expired");
                }
                
                return ApiResponse.success("Payment method found", 
                    PaymentInfoResponse.fromEntityWithCvv(card));
            } else {
                return ApiResponse.error("Payment method not found");
            }
        } catch (Exception e) {
            log.error("Error retrieving payment info for payment: {}", e.getMessage(), e);
            return ApiResponse.error("Error retrieving payment method: " + e.getMessage());
        }
    }

    // Tạo thẻ mới
    @Transactional
    public ApiResponse<PaymentInfoResponse> createPaymentInfo(PaymentInfoRequest request, Long userId) {
        try {
            // Validate request
            if (!request.isValid()) {
                return ApiResponse.error("Invalid payment information");
            }

            // Kiểm tra thẻ có hết hạn không
            if (request.isExpired()) {
                return ApiResponse.error("Card has expired");
            }

            // Kiểm tra số thẻ đã tồn tại chưa
            if (paymentInfoRepository.existsByUserIdAndCardNumberAndIsActiveTrue(userId, request.getCardNumber())) {
                return ApiResponse.error("Card number already exists");
            }

            // Kiểm tra giới hạn số thẻ (tối đa 5 thẻ)
            long cardCount = paymentInfoRepository.countByUserIdAndIsActiveTrue(userId);
            if (cardCount >= 5) {
                return ApiResponse.error("Maximum 5 payment methods allowed");
            }

            // Xử lý thẻ mặc định
            if (Boolean.TRUE.equals(request.getIsDefault())) {
                paymentInfoRepository.resetDefaultCards(userId);
            }

            // Tạo thẻ mới
            PaymentInfo paymentInfo = PaymentInfo.builder()
                    .user(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")))
                    .cardNumber(request.getCardNumber())
                    .cardHolderName(request.getCardHolderName().toUpperCase())
                    .expiryMonth(request.getExpiryMonth())
                    .expiryYear(request.getExpiryYear())
                    .cvv(request.getCvv())
                    .cardType(request.getCardType())
                    .nickname(request.getNickname())
                    .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                    .isActive(true)
                    .build();

            PaymentInfo savedPaymentInfo = paymentInfoRepository.save(paymentInfo);
            log.info("Created payment info ID: {} for user: {}", savedPaymentInfo.getPaymentInfoId(), userId);

            return ApiResponse.success("Payment method added successfully", 
                PaymentInfoResponse.fromEntity(savedPaymentInfo));
        } catch (Exception e) {
            log.error("Error creating payment info for user {}: {}", userId, e.getMessage(), e);
            return ApiResponse.error("Error adding payment method: " + e.getMessage());
        }
    }

    // Cập nhật thẻ
    @Transactional
    public ApiResponse<PaymentInfoResponse> updatePaymentInfo(Long paymentInfoId, PaymentInfoRequest request, Long userId) {
        try {
            // Kiểm tra thẻ có tồn tại và thuộc về user không
            Optional<PaymentInfo> existingCard = paymentInfoRepository.findByPaymentInfoIdAndUserIdAndIsActiveTrue(paymentInfoId, userId);
            if (existingCard.isEmpty()) {
                return ApiResponse.error("Payment method not found");
            }

            PaymentInfo paymentInfo = existingCard.get();

            // Validate request
            if (!request.isValid()) {
                return ApiResponse.error("Invalid payment information");
            }

            // Kiểm tra thẻ có hết hạn không
            if (request.isExpired()) {
                return ApiResponse.error("Card has expired");
            }

            // Kiểm tra số thẻ đã tồn tại chưa (trừ thẻ hiện tại)
            if (!request.getCardNumber().equals(paymentInfo.getCardNumber()) &&
                paymentInfoRepository.existsByUserIdAndCardNumberAndIsActiveTrue(userId, request.getCardNumber())) {
                return ApiResponse.error("Card number already exists");
            }

            // Xử lý thẻ mặc định
            if (Boolean.TRUE.equals(request.getIsDefault()) && !Boolean.TRUE.equals(paymentInfo.getIsDefault())) {
                paymentInfoRepository.resetDefaultCards(userId);
            }

            // Cập nhật thông tin
            paymentInfo.setCardNumber(request.getCardNumber());
            paymentInfo.setCardHolderName(request.getCardHolderName().toUpperCase());
            paymentInfo.setExpiryMonth(request.getExpiryMonth());
            paymentInfo.setExpiryYear(request.getExpiryYear());
            paymentInfo.setCvv(request.getCvv());
            paymentInfo.setCardType(request.getCardType());
            paymentInfo.setNickname(request.getNickname());
            paymentInfo.setIsDefault(Boolean.TRUE.equals(request.getIsDefault()));

            PaymentInfo updatedPaymentInfo = paymentInfoRepository.save(paymentInfo);
            log.info("Updated payment info ID: {} for user: {}", paymentInfoId, userId);

            return ApiResponse.success("Payment method updated successfully", 
                PaymentInfoResponse.fromEntity(updatedPaymentInfo));
        } catch (Exception e) {
            log.error("Error updating payment info {} for user {}: {}", paymentInfoId, userId, e.getMessage(), e);
            return ApiResponse.error("Error updating payment method: " + e.getMessage());
        }
    }

    // Xóa thẻ (soft delete)
    @Transactional
    public ApiResponse<String> deletePaymentInfo(Long paymentInfoId, Long userId) {
        try {
            // Kiểm tra thẻ có tồn tại và thuộc về user không
            Optional<PaymentInfo> paymentInfo = paymentInfoRepository.findByPaymentInfoIdAndUserIdAndIsActiveTrue(paymentInfoId, userId);
            if (paymentInfo.isEmpty()) {
                return ApiResponse.error("Payment method not found");
            }

            PaymentInfo card = paymentInfo.get();

            // Không cho phép xóa thẻ mặc định nếu chỉ có 1 thẻ
            if (Boolean.TRUE.equals(card.getIsDefault())) {
                long cardCount = paymentInfoRepository.countByUserIdAndIsActiveTrue(userId);
                if (cardCount <= 1) {
                    return ApiResponse.error("Cannot delete the only payment method");
                }
            }

            // Soft delete
            card.setIsActive(false);
            paymentInfoRepository.save(card);

            log.info("Deleted payment info ID: {} for user: {}", paymentInfoId, userId);
            return ApiResponse.success("Payment method deleted successfully", null);
        } catch (Exception e) {
            log.error("Error deleting payment info {} for user {}: {}", paymentInfoId, userId, e.getMessage(), e);
            return ApiResponse.error("Error deleting payment method: " + e.getMessage());
        }
    }

    // Đặt thẻ làm mặc định
    @Transactional
    public ApiResponse<PaymentInfoResponse> setDefaultPaymentInfo(Long paymentInfoId, Long userId) {
        try {
            // Kiểm tra thẻ có tồn tại và thuộc về user không
            Optional<PaymentInfo> paymentInfo = paymentInfoRepository.findByPaymentInfoIdAndUserIdAndIsActiveTrue(paymentInfoId, userId);
            if (paymentInfo.isEmpty()) {
                return ApiResponse.error("Payment method not found");
            }

            PaymentInfo card = paymentInfo.get();

            // Nếu đã là mặc định rồi thì không cần làm gì
            if (Boolean.TRUE.equals(card.getIsDefault())) {
                return ApiResponse.success("Payment method is already default", 
                    PaymentInfoResponse.fromEntity(card));
            }

            // Reset tất cả thẻ về không mặc định
            paymentInfoRepository.resetDefaultCards(userId);

            // Đặt thẻ này làm mặc định
            card.setIsDefault(true);
            PaymentInfo updatedCard = paymentInfoRepository.save(card);

            log.info("Set default payment info ID: {} for user: {}", paymentInfoId, userId);
            return ApiResponse.success("Default payment method updated successfully", 
                PaymentInfoResponse.fromEntity(updatedCard));
        } catch (Exception e) {
            log.error("Error setting default payment info {} for user {}: {}", paymentInfoId, userId, e.getMessage(), e);
            return ApiResponse.error("Error setting default payment method: " + e.getMessage());
        }
    }
} 