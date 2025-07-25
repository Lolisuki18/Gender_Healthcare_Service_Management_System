package com.healapp.repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.healapp.model.NotificationPreference;
import com.healapp.model.NotificationType;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {

    List<NotificationPreference> findByUserId(Long userId);

    Optional<NotificationPreference> findByUserIdAndType(Long userId, NotificationType type);

    @Modifying
    @Transactional
    @Query("UPDATE NotificationPreference np SET np.enabled = :enabled WHERE np.user.id = :userId AND np.type = :type")
    int updateNotificationPreference(@Param("userId") Long userId, @Param("type") NotificationType type, @Param("enabled") boolean enabled);

    @Modifying
    @Transactional
    @Query("UPDATE NotificationPreference np SET np.remindTime = :time WHERE np.user.id = :userId AND np.type = :type")
    int updateNotificationPreference(@Param("userId") Long userId, @Param("type") NotificationType notificationType, @Param("time") LocalTime time);
}
