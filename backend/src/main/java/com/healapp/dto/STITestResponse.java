package com.healapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class STITestResponse {

    private Long testId;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long serviceId;
    private Long packageId;
    private String serviceName;
    private String serviceDescription;
    private BigDecimal totalPrice;
    private Long staffId;
    private String staffName;

    private Long consultantId;
    private String consultantName;

    private LocalDateTime appointmentDate;
    private String status;

    private Long paymentId;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime paidAt;
    private String paymentTransactionId;

    private String stripePaymentIntentId;
    private String stripeReceiptUrl;
    private List<TestServiceConsultantNoteDTO> testServiceConsultantNotes;

    private String qrPaymentReference;
    private LocalDateTime qrExpiresAt;
    private String qrCodeUrl;

    // Payment failure and retry information
    private String paymentFailureReason;
    private Boolean canRetryPayment;

    private String customerNotes;
    private String consultantNotes;
    private LocalDateTime resultDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Lý do hủy xét nghiệm (nếu có)
    private String cancelReason;

    public boolean isPaymentCompleted() {
        return "COMPLETED".equals(this.paymentStatus);
    }

    public boolean isCODPayment() {
        return "COD".equals(this.paymentMethod);
    }

    public boolean isStripePayment() {
        return "VISA".equals(this.paymentMethod);
    }

    public boolean isQRPayment() {
        return "QR_CODE".equals(this.paymentMethod);
    }

    public boolean isQRExpired() {
        return isQRPayment() && qrExpiresAt != null && qrExpiresAt.isBefore(LocalDateTime.now());
    }

    public boolean canBeCancelled() {
        return "PENDING".equals(this.status) || "CONFIRMED".equals(this.status);
    }

    public String getPaymentDisplayText() {
        if (paymentMethod == null)
            return "Unknown";

        switch (paymentMethod) {
            case "COD":
                return "Cash on Delivery";
            case "VISA":
                return "Credit Card";
            case "QR_CODE":
                return "QR Code Transfer";
            default:
                return paymentMethod;
        }
    }

    public String getStatusDisplayText() {
        if (status == null)
            return "Unknown";

        switch (status) {
            case "PENDING":
                return "Pending Confirmation";
            case "CONFIRMED":
                return "Confirmed";
            case "SAMPLED":
                return "Sample Collected";
            case "RESULTED":
                return "Results Available";
            case "COMPLETED":
                return "Completed";
            case "CANCELED":
                return "Cancelled";
            default:
                return status;
        }
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class TestServiceConsultantNoteDTO {
        private Long id;
        private Long serviceId;
        private String serviceName;
        private String note;
        private Long consultantId;
        private String consultantName;
    }
}