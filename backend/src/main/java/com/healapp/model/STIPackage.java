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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sti_packages")
public class STIPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Long packageId;

    @Column(name = "package_name", nullable = false, length = 200,columnDefinition = "NVARCHAR(200)")
    private String packageName;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "package_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal packagePrice;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // // Quan hệ Many-to-Many với STIService
    // @ManyToMany(fetch = FetchType.LAZY)
    // @JoinTable(name = "package_services", joinColumns = @JoinColumn(name = "package_id"), inverseJoinColumns = @JoinColumn(name = "service_id"))
    // private List<STIService> services = new ArrayList<>();
    @OneToMany(mappedBy = "stiPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PackageService> packageServices = new ArrayList<>();

    // Quan hệ One-to-Many với STITest
    @OneToMany(mappedBy = "stiPackage", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<STITest> stiTests;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isActive == null) {
            this.isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
