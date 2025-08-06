package com.healapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healapp.model.Notification;
import com.healapp.model.NotificationStatus;
import com.healapp.model.NotificationType;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByScheduledAtDesc(Long userId);

    List<Notification> findByUserIdAndTypeAndStatus(Long userId, NotificationType ovulation, NotificationStatus sent);
}
