package com.healapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sti_tests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class STITest { // Lưu thông tin các đơn xét nghiệm STIs của khách hàng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private UserDtls customer;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private STIService stiService;

    @ManyToOne
    @JoinColumn(name = "package_id")
    private STIPackage stiPackage;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private UserDtls staff;

    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private UserDtls consultant;

    @Column(name = "appointment_date")
    private LocalDateTime appointmentDate;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "customer_notes", columnDefinition = "NVARCHAR(4000)")
    private String customerNotes;

    @Column(name = "consultant_notes", columnDefinition = "NVARCHAR(4000)")
    private String consultantNotes;

    @Column(name = "result_date")
    private LocalDateTime resultDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private STITestStatus status;

    @Column(name = "cancel_reason", columnDefinition = "NVARCHAR(255)") // Lý do hủy xét nghiệm (nếu có)
    private String cancelReason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
