package com.healapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pill_logs")
public class PillLogs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne
    @JoinColumn(name ="pills_id", nullable = false)
    private ControlPills pillsId;

    @Column(name = "check_in")
    private LocalDateTime checkIn;

    @Column(name ="created_at")
    private LocalDateTime createdAt;

    @Column(name ="status", nullable = false)
    private Boolean status;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}


// Table pill_logs {
//     log_id BIGINT [pk, increment]
//     pills_id BIGINT
//     check_in TIMESTAMP
//     created_at TIMESTAMP
//     status BOOLEAN
//   }
