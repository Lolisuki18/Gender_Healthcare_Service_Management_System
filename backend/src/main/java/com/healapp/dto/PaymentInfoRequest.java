package com.healapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfoRequest {

    @NotBlank(message = "Số thẻ không được để trống")
    @Pattern(regexp = "^[0-9]{16}$", message = "Số thẻ phải có 16 chữ số")
    private String cardNumber;

    @NotBlank(message = "Tên chủ thẻ không được để trống")
    @Size(max = 100, message = "Tên chủ thẻ không được quá 100 ký tự")
    private String cardHolderName;

    @NotBlank(message = "Tháng hết hạn không được để trống")
    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "Tháng hết hạn phải từ 01-12")
    private String expiryMonth;

    @NotBlank(message = "Năm hết hạn không được để trống")
    @Pattern(regexp = "^[0-9]{4}$", message = "Năm hết hạn phải có 4 chữ số")
    private String expiryYear;

    @NotBlank(message = "CVV không được để trống")
    @Pattern(regexp = "^[0-9]{3,4}$", message = "CVV phải có 3-4 chữ số")
    private String cvv;

    @Size(max = 20, message = "Loại thẻ không được quá 20 ký tự")
    private String cardType;

    @Size(max = 50, message = "Tên gợi nhớ không được quá 50 ký tự")
    private String nickname;

    private Boolean isDefault = false;

    // Helper method để validate năm hết hạn
    public boolean isExpired() {
        try {
            int year = Integer.parseInt(expiryYear);
            int month = Integer.parseInt(expiryMonth);
            
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            int currentYear = now.getYear();
            int currentMonth = now.getMonthValue();
            
            return year < currentYear || (year == currentYear && month < currentMonth);
        } catch (NumberFormatException e) {
            return true;
        }
    }

    // Helper method để validate request
    public boolean isValid() {
        return cardNumber != null && cardNumber.length() == 16 &&
               cardHolderName != null && !cardHolderName.trim().isEmpty() &&
               expiryMonth != null && expiryMonth.matches("^(0[1-9]|1[0-2])$") &&
               expiryYear != null && expiryYear.matches("^[0-9]{4}$") &&
               cvv != null && cvv.matches("^[0-9]{3,4}$") &&
               !isExpired();
    }
} 