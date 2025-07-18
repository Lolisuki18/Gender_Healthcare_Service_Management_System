package com.healapp.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "control_pills")
public class ControlPills {
  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pills_id")
    private Long pillsId;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "remind_time", nullable = false)
    private LocalTime remindTime;

    @Column(name = "number_days_drinking",nullable = false)
    private int numberDaysDrinking;
   
    @Column(name = "number_days_off", nullable = false)
    private int numberDaysOff;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "pill_type", nullable = false)
    private PillType pillType;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserDtls userId;
    
    @OneToMany(mappedBy = "controlPills", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PillLogs> pillLogs = new ArrayList<>();

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
