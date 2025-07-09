package com.healapp.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfoResponse {

    private Long paymentInfoId;
    private Long userId;
    private String cardNumber; // Số thẻ đã ẩn
    private String cardHolderName;
    private String expiryMonth;
    private String expiryYear;
    private String cvv; // Chỉ trả về khi cần thiết
    private String cardType;
    private Boolean isDefault;
    private Boolean isActive;
    private String nickname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Các field tính toán
    private String maskedCardNumber;
    private String displayName;
    private Boolean isExpired;
    private String expiryDisplay; // Format: MM/YY

    // Helper method để tạo response an toàn (không trả về CVV)
    public static PaymentInfoResponse fromEntity(com.healapp.model.PaymentInfo entity) {
        return PaymentInfoResponse.builder()
                .paymentInfoId(entity.getPaymentInfoId())
                .userId(entity.getUserId())
                .cardNumber(entity.getCardNumber())
                .cardHolderName(entity.getCardHolderName())
                .expiryMonth(entity.getExpiryMonth())
                .expiryYear(entity.getExpiryYear())
                .cardType(entity.getCardType())
                .isDefault(entity.getIsDefault())
                .isActive(entity.getIsActive())
                .nickname(entity.getNickname())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .maskedCardNumber(entity.getMaskedCardNumber())
                .displayName(entity.getDisplayName())
                .isExpired(entity.isExpired())
                .expiryDisplay(entity.getExpiryMonth() + "/" + entity.getExpiryYear())
                .build();
    }

    // Helper method để tạo response với CVV (chỉ dùng khi cần thiết)
    public static PaymentInfoResponse fromEntityWithCvv(com.healapp.model.PaymentInfo entity) {
        PaymentInfoResponse response = fromEntity(entity);
        response.setCvv(entity.getCvv());
        return response;
    }
} 