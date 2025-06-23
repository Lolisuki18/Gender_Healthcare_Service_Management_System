package com.healapp.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sti_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class STIService {

    // Lưu thông tin các dịch vụ xét nghiệm: HIV, HPV, STIs,...
    @Id
    @Column(name = "service_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", columnDefinition = "NVARCHAR(100)", nullable = false, unique = true)
    private String name;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "stiService", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ServiceTestComponent> testComponents = new ArrayList<>();
     
    @OneToMany(mappedBy = "stiService", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PackageService> packageServices = new ArrayList<>();

    @OneToMany(mappedBy = "stiService", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<STITest> stiTests;

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
