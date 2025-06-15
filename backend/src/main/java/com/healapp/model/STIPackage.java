package com.healapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sti_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class STIPackage {

    // Lưu thông tin các gói dịch vụ xét nghiệm
    @Id
    @Column(name = "package_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "package_name", columnDefinition = "NVARCHAR(100)", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "NVARCHAR(4000)")
    private String description;

    @Column(name = "package_price", nullable = false)
    private double price;

    @Column(name = "recommended_for", columnDefinition = "NVARCHAR(200)")
    private String recommendedFor;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

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
