package com.healapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestResult {

    // Lưu kết quả xét nghiệm của từng thành phần trong dịch vụ STI
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private STITest stiTest;

    @ManyToOne
    @JoinColumn(name = "component_id", nullable = false)
    private ServiceTestComponent testComponent;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private STIService stiService;

    @Column(name = "result_value", columnDefinition = "NVARCHAR(200)")
    private String resultValue;

    @Column(name = "unit", columnDefinition = "NVARCHAR(100)")
    private String unit;

    @Column(name = "normal_range", columnDefinition = "NVARCHAR(100)")
    private String normalRange;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

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
