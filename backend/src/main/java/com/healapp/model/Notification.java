package com.healapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserDtls user;

    private String title;
    private String content;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private LocalDateTime scheduledAt; // thời gian định gửi
    private LocalDateTime sentAt;      // đã gửi khi nào

    @Enumerated(EnumType.STRING)
    private NotificationStatus status; // SCHEDULED, SENT, FAILED, SKIPPED

    private String errorMessage;       // nếu FAILED thì ghi log lỗi

}
