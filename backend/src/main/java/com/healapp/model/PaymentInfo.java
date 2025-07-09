package com.healapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_info")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_info_id")
    private Long paymentInfoId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "card_number", nullable = false, length = 16)
    private String cardNumber;

    @Column(name = "card_holder_name", nullable = false, length = 100)
    private String cardHolderName;

    @Column(name = "expiry_month", nullable = false, length = 2)
    private String expiryMonth;

    @Column(name = "expiry_year", nullable = false, length = 4)
    private String expiryYear;

    @Column(name = "cvv", nullable = false, length = 4)
    private String cvv;

    @Column(name = "card_type", length = 20)
    private String cardType; // VISA, MASTERCARD, etc.

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "nickname", length = 50)
    private String nickname; // Tên gợi nhớ cho thẻ (ví dụ: "Thẻ chính", "Thẻ phụ")

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper method để hiển thị số thẻ đã ẩn
    public String getMaskedCardNumber() {
        if (cardNumber == null || cardNumber.length() < 4) {
            return "****";
        }
        return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
    }

    // Helper method để hiển thị thông tin thẻ an toàn
    public String getDisplayName() {
        if (nickname != null && !nickname.trim().isEmpty()) {
            return nickname + " (" + getMaskedCardNumber() + ")";
        }
        return cardHolderName + " (" + getMaskedCardNumber() + ")";
    }

    // Helper method để kiểm tra thẻ có hết hạn chưa
    public boolean isExpired() {
        try {
            int month = Integer.parseInt(expiryMonth);
            int year = Integer.parseInt(expiryYear);
            
            LocalDateTime now = LocalDateTime.now();
            int currentYear = now.getYear();
            int currentMonth = now.getMonthValue();
            
            return year < currentYear || (year == currentYear && month < currentMonth);
        } catch (NumberFormatException e) {
            return true; // Nếu không parse được thì coi như hết hạn
        }
    }
} 