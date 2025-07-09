package com.healapp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.healapp.model.MenstrualCycle;
import com.healapp.model.Notification;
import com.healapp.model.NotificationPreference;
import com.healapp.model.NotificationStatus;
import com.healapp.model.NotificationType;
import com.healapp.model.PregnancyProbLog;
import com.healapp.model.UserDtls;
import com.healapp.repository.NotificationPreferenceRepository;
import com.healapp.repository.NotificationRepository;
import com.healapp.repository.PregnancyProbLogRepository;
import com.healapp.repository.UserRepository;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationPreferenceRepository notificationPreferenceRepository;

    @Autowired
    private PregnancyProbLogRepository pregnancyProbLogRepository;

    @Autowired
    private MenstrualCycleService menstrualCycleService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    public void sendOvulationNotification() {
        logger.info("Starting scheduled ovulation notification task");
        
        // For scheduled tasks - send to all users with enabled ovulation notifications
        List<NotificationPreference> ovulationPreferences = notificationPreferenceRepository.findAll()
            .stream()
            .filter(pref -> pref.getType() == NotificationType.OVULATION && pref.getEnabled())
            .toList();
        
        logger.info("Found {} users with enabled ovulation notifications", ovulationPreferences.size());
        
        for (NotificationPreference preference : ovulationPreferences) {
            try {
                sendOvulationNotificationToUser(preference.getUser().getId());
            } catch (Exception e) {
                logger.error("Error sending ovulation notification to user ID {}: {}", 
                           preference.getUser().getId(), e.getMessage(), e);
            }
        }
        
        logger.info("Completed scheduled ovulation notification task");
    }

    public void sendOvulationNotificationToUser(Long userId) {
        if (userId == null) {
            logger.warn("Cannot send ovulation notification: User ID is null");
            throw new IllegalArgumentException("User ID cannot be null");
        }

        logger.info("Attempting to send ovulation notification to user ID: {}", userId);

        // Kiểm tra người dùng có cài đặt nhận thông báo này không
        Optional<NotificationPreference> preference = notificationPreferenceRepository.findByUserIdAndType(userId, NotificationType.OVULATION);
        if (preference.isEmpty() || !preference.get().getEnabled()) {
            logger.info("Skipping ovulation notification for user ID {}: No preference found or notification disabled", userId);
            return; // Người dùng không có cài đặt hoặc đã tắt thông báo này
        }

        UserDtls user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            logger.warn("Cannot send ovulation notification: User not found for ID: {}", userId);
            return;
        }

        // Lấy chu kỳ kinh nguyệt gần nhất của người dùng
        MenstrualCycle latestCycle = menstrualCycleService.getLatestCycleBeforeToday(userId, LocalDate.now())
            .orElse(null);
        if (latestCycle == null) {
            // Không có chu kỳ kinh nguyệt nào, bỏ qua thông báo
            logger.info("Skipping ovulation notification for user ID {}: No menstrual cycle data found", userId);
            return;
        }

        // Lấy ngày kinh nguyệt gần nhất
        LocalDate ovulationDate = latestCycle.getOvulationDate();
        if (ovulationDate == null) {
            // Nếu không có ngày rụng trứng, bỏ qua thông báo
            logger.info("Skipping ovulation notification for user ID {}: No ovulation date found in cycle", userId);
            return;
        }

        logger.info("Preparing to send ovulation notification to user {} ({}) for ovulation date: {}", 
                   user.getFullName(), user.getEmail(), ovulationDate);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle("Nhắc nhở ngày rụng trứng sắp tới");
        notification.setContent("Đây là thời điểm có khả năng thụ thai cao nhất.");
        notification.setType(NotificationType.OVULATION);
        notification.setScheduledAt(LocalDateTime.now());

        try {
            emailService.sendOvulationReminderAsync(user.getEmail(), user.getFullName(), ovulationDate);
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            logger.info("Successfully sent ovulation notification email to user {} ({})", 
                       user.getFullName(), user.getEmail());
        } catch (Exception ex) {
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage(ex.getMessage());
            logger.error("Failed to send ovulation notification email to user {} ({}). Reason: {}", 
                        user.getFullName(), user.getEmail(), ex.getMessage(), ex);
        }

        notificationRepository.save(notification);
        logger.info("Ovulation notification record saved for user ID: {} with status: {}", 
                   userId, notification.getStatus());
    }

    public void sendPregnancyProbNotification() {
        logger.info("Starting scheduled pregnancy probability notification task");
        
        // For scheduled tasks - send to all users with enabled pregnancy probability notifications
        List<NotificationPreference> pregnancyPreferences = notificationPreferenceRepository.findAll()
            .stream()
            .filter(pref -> pref.getType() == NotificationType.PREGNANCY_PROBABILITY && pref.getEnabled())
            .toList();
        
        logger.info("Found {} users with enabled pregnancy probability notifications", pregnancyPreferences.size());
        
        for (NotificationPreference preference : pregnancyPreferences) {
            try {
                sendPregnancyProbNotificationToUser(preference.getUser().getId());
            } catch (Exception e) {
                logger.error("Error sending pregnancy probability notification to user ID {}: {}", 
                           preference.getUser().getId(), e.getMessage(), e);
            }
        }
        
        logger.info("Completed scheduled pregnancy probability notification task");
    }

    public void sendPregnancyProbNotificationToUser(Long userId) {
        if (userId == null) {
            logger.warn("Cannot send pregnancy probability notification: User ID is null");
            throw new IllegalArgumentException("User ID cannot be null");
        }
        
        logger.info("Attempting to send pregnancy probability notification to user ID: {}", userId);
        
        UserDtls user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            logger.warn("Cannot send pregnancy probability notification: User not found for ID: {}", userId);
            return;
        }

        // Kiểm tra người dùng có cài đặt nhận thông báo này không
        Optional<NotificationPreference> preference = notificationPreferenceRepository.findByUserIdAndType(user.getId(), NotificationType.PREGNANCY_PROBABILITY);
        if (preference.isEmpty() || !preference.get().getEnabled()) {
            logger.info("Skipping pregnancy probability notification for user ID {}: No preference found or notification disabled", userId);
            return;
        }

        // Lấy chu kỳ kinh nguyệt gần nhất của người dùng
        MenstrualCycle latestCycle = menstrualCycleService.getLatestCycleBeforeToday(userId, LocalDate.now())
            .orElse(null);
        if (latestCycle == null) {
            // Không có chu kỳ kinh nguyệt nào, bỏ qua thông báo
            logger.info("Skipping pregnancy probability notification for user ID {}: No menstrual cycle data found", userId);
            return;
        }

        logger.info("Preparing to send pregnancy probability notification to user {} ({})", 
                   user.getFullName(), user.getEmail());

        Notification noti = new Notification();
        noti.setUser(user);
        noti.setType(preference.get().getType());
        noti.setScheduledAt(LocalDateTime.now());

        try {
            List<PregnancyProbLog> logs = pregnancyProbLogRepository.findAllByMenstrualCycleId(latestCycle.getId())
                    .orElse(Collections.emptyList());

            if (logs.isEmpty()) {
                noti.setStatus(NotificationStatus.SKIPPED);
                notificationRepository.save(noti);
                logger.info("Skipping pregnancy probability notification for user ID {}: No pregnancy probability logs found", userId);
                return;
            }

            // Tính toán
            LocalDate today = LocalDate.now();
            if (today == null) {
                throw new IllegalStateException("Current date is not available");
            }
            double probToday = 0.0;
            LocalDate ovulationDate = latestCycle.getOvulationDate();
            LocalDate start = today, end = today;

            for (PregnancyProbLog log : logs) {
                if (log.getDate().isBefore(start)) start = log.getDate();
                if (log.getDate().isAfter(end)) end = log.getDate();
                if (log.getDate().isEqual(today)) probToday = log.getProbability().doubleValue();
            }

            if (today.isAfter(start) && today.isBefore(end)) {
                int daysBeforeOvulation = (int) ChronoUnit.DAYS.between(ovulationDate, today);

                logger.info("Sending pregnancy probability email to user {} ({}): probability={}%, daysBeforeOvulation={}, ovulationDate={}", 
                           user.getFullName(), user.getEmail(), probToday, daysBeforeOvulation, ovulationDate);

                // Gửi email
                emailService.sendOvulationWithPregnancyProbReminderAsync(
                    user.getEmail(),
                    user.getFullName(),
                    daysBeforeOvulation,
                    probToday,
                    ovulationDate
                );

                noti.setStatus(NotificationStatus.SENT);
                noti.setSentAt(LocalDateTime.now());
                logger.info("Successfully sent pregnancy probability notification email to user {} ({})", 
                           user.getFullName(), user.getEmail());
            } else {
                noti.setStatus(NotificationStatus.SKIPPED);
                logger.info("Skipping pregnancy probability notification for user ID {}: Today ({}) is not within probability range ({} to {})", 
                           userId, today, start, end);
            }

        } catch (Exception e) {
            noti.setStatus(NotificationStatus.FAILED);
            noti.setErrorMessage(e.getMessage());
            logger.error("Failed to send pregnancy probability notification email to user {} ({}). Reason: {}", 
                        user.getFullName(), user.getEmail(), e.getMessage(), e);
        }
        notificationRepository.save(noti);
        logger.info("Pregnancy probability notification record saved for user ID: {} with status: {}", 
                   userId, noti.getStatus());
    }

    // Phương thức bỏ qua thông báo
    // public void skipNotification(UserDtls user, NotificationType type) {
    //     Notification skipped = new Notification();
    //     skipped.setUser(user);
    //     skipped.setType(type);
    //     skipped.setStatus(NotificationStatus.SKIPPED);
    //     skipped.setScheduledAt(LocalDateTime.now());
    //     notificationRepository.save(skipped);
    // }

    protected Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }
}

