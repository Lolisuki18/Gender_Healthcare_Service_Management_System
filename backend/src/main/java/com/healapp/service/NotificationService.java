package com.healapp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
import com.healapp.model.ControlPills;
import com.healapp.model.PillLogs;
import com.healapp.repository.NotificationPreferenceRepository;
import com.healapp.repository.NotificationRepository;
import com.healapp.repository.PregnancyProbLogRepository;
import com.healapp.repository.UserRepository;
import com.healapp.repository.ControlPillsRepository;
import com.healapp.repository.PillLogsRepository;

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

    @Autowired
    private ControlPillsRepository controlPillsRepository;

    @Autowired
    private PillLogsRepository pillLogsRepository;

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
                if(preference.getRemindTime().equals(LocalTime.of(LocalTime.now().getHour(), LocalTime.now().getMinute()))) {
                    sendOvulationNotificationToUser(preference.getUser().getId());
                    logger.info("Sending ovulation notification to user ID: {}", preference.getUser().getId());
                } else {
                    logger.info("Skipping ovulation notification for user ID {}: Not the right time", 
                               preference.getUser().getId());
                    continue;
                }
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

        UserDtls user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            logger.warn("Cannot send ovulation notification: User not found for ID: {}", userId);
            return;
        }

        // Lấy chu kỳ kinh nguyệt gần nhất của người dùng
        MenstrualCycle latestCycle = menstrualCycleService.getLatestCycleBeforeToday(userId)
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

        if(ovulationDate.minusDays(1).isEqual(LocalDate.now())) {
            // Nếu ngày rụng trứng là ngày mai, gửi thông báo
            logger.info("Sending ovulation notification to user ID {}: Ovulation date is tomorrow ({})", 
                       userId, ovulationDate);

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
        } else {
            // Nếu không phải ngày rụng trứng, bỏ qua thông báo
            logger.info("Skipping ovulation notification for user ID {}: Ovulation date is not tomorrow ({})", 
                       userId, ovulationDate);
            return;
        }
        
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
                if(preference.getRemindTime().equals(LocalTime.of(LocalTime.now().getHour(), LocalTime.now().getMinute()))) {
                    logger.info("Sending pregnancy probability notification to user ID: {}", preference.getUser().getId());
                    sendPregnancyProbNotificationToUser(preference.getUser().getId());
                } else {
                    logger.info("Skipping pregnancy probability notification for user ID {}: Not the right time", 
                               preference.getUser().getId());
                    continue;
                }
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

        logger.info("Preparing to send pregnancy probability notification to user {} ({})", 
                   user.getFullName(), user.getEmail());

        Notification noti = new Notification();
        noti.setUser(user);
        noti.setTitle("Xác suất mang thai");
        noti.setContent("Thông báo xác suất mang thai");
        noti.setType(NotificationType.PREGNANCY_PROBABILITY);
        noti.setScheduledAt(LocalDateTime.now());

        // Lấy chu kỳ kinh nguyệt gần nhất của người dùng
        MenstrualCycle latestCycle = menstrualCycleService.getLatestCycleBeforeToday(userId)
            .orElse(null);
        if (latestCycle == null) {
            // Không có chu kỳ kinh nguyệt nào, bỏ qua thông báo
            noti.setStatus(NotificationStatus.SKIPPED);
            noti.setErrorMessage("No menstrual cycle data found");
            notificationRepository.save(noti);
            logger.info("Skipping pregnancy probability notification for user ID {}: No menstrual cycle data found", userId);
            return;
        }

        try {
            List<PregnancyProbLog> logs = pregnancyProbLogRepository.findAllByMenstrualCycleId(latestCycle.getId())
                    .orElse(Collections.emptyList());

            if (logs.isEmpty()) {
                noti.setStatus(NotificationStatus.SKIPPED);
                noti.setErrorMessage("No pregnancy probability logs found");
                notificationRepository.save(noti);
                logger.info("Skipping pregnancy probability notification for user ID {}: No pregnancy probability logs found", userId);
                return;
            }

            // Tính toán
            LocalDate today = LocalDate.now();
            if (today == null) {
                throw new IllegalStateException("Current date is not available");
            }
            double probToday = 1;
            LocalDate ovulationDate = latestCycle.getOvulationDate();
            LocalDate start = today, end = today;

            for (PregnancyProbLog log : logs) {
                if (log.getDate().isBefore(start)) start = log.getDate();
                if (log.getDate().isAfter(end)) end = log.getDate();
                if (log.getDate().isEqual(today)) probToday = log.getProbability().doubleValue();
            }

            if (!today.isBefore(start) && !today.isAfter(end)) {
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
                noti.setErrorMessage("Today is not within the pregnancy probability range");
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
    //Gửi mail cho cái nhắc uống thuốc
    public void sendPillReminder() {
        logger.info("Starting scheduled pill reminder task");
        List<NotificationPreference> pillReminderPreferences = notificationPreferenceRepository.findAll()
            .stream()
            .filter(pref -> pref.getType() == NotificationType.PILL_REMINDER && pref.getEnabled())
            .toList();
        logger.info("Found {} users with enabled pill reminder notifications", pillReminderPreferences.size());
        for (NotificationPreference preference : pillReminderPreferences) {
            try {
                sendPillReminderToUser(preference.getUser().getId());
            } catch (Exception e) {
                logger.error("Error sending pill reminder notification to user ID {}: {}", 
                           preference.getUser().getId(), e.getMessage(), e);
            }
        }
        logger.info("Completed scheduled pill reminder task");
    }

    //Nhắc nhở uống thuốc
    public void sendPillReminderToUser(Long userId){
         if (userId == null) {
            logger.warn("Cannot send pill reminder notification: User ID is null");
            throw new IllegalArgumentException("User ID cannot be null");
         }

        logger.info("Attempting to send pill reminder notification to user ID: {}", userId);

        UserDtls user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            logger.warn("Cannot send pill reminder notification: User not found for ID: {}", userId);
            return;
        }

        // Kiểm tra người dùng có cài đặt nhận thông báo này không
        Optional<NotificationPreference> preference = notificationPreferenceRepository.findByUserIdAndType(userId, NotificationType.PILL_REMINDER);
        if (preference.isEmpty() || !preference.get().getEnabled()) {
            logger.info("Skipping pill reminder notification for user ID {}: No preference found or notification disabled", userId);
            return; 
        }

        // Lấy lịch uống thuốc đang hoạt động của người dùng
        List<ControlPills> activePillSchedules = controlPillsRepository.findByUserIdAndIsActive(user, true)
            .orElse(Collections.emptyList());

        if (activePillSchedules.isEmpty()) {
            logger.info("Skipping pill reminder notification for user ID {}: No active pill schedules found", userId);
            return;
        }

        LocalDate today = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        for (ControlPills schedule : activePillSchedules) {
            //1. Chỉ gửi đúng vào thời điểm giờ và phút trùng với remindTime
            if (currentTime.getHour() == schedule.getRemindTime().getHour()
                && currentTime.getMinute() == schedule.getRemindTime().getMinute()) {
                // 2. Kiểm tra tất cả các nhật ký uống thuốc đã tồn tại cho hôm nay đối với lịch trình cụ thể này
                Optional<PillLogs> todayPillLogOptional = pillLogsRepository.findByControlPillsAndLogDate(schedule, today);

                boolean alreadyCheckedIn = todayPillLogOptional.isPresent() && todayPillLogOptional.get().getStatus();
                boolean logExistsForToday = todayPillLogOptional.isPresent();

                if (alreadyCheckedIn) {
                    // Nếu đã có log đã check-in cho hôm nay, bỏ qua việc gửi nhắc nhở
                    logger.info("Bỏ qua lời nhắc nhở uống thuốc cho lịch trình ID {} (người dùng ID {}): Đã check-in cho hôm nay.",
                               schedule.getPillsId(), userId);
                } else if (!logExistsForToday) {
                    // Nếu chưa có log nào cho hôm nay, tạo log mới (ban đầu là bỏ lỡ) và gửi nhắc nhở
                    PillLogs newPillLog = new PillLogs();
                    newPillLog.setControlPills(schedule);
                    newPillLog.setLogDate(today);
                    newPillLog.setStatus(false); // Mặc định là bỏ lỡ, người dùng có thể check-in sau
                    newPillLog.setCreatedAt(LocalDateTime.now()); // Đặt thời gian tạo
                    newPillLog.setUpdatedAt(LocalDateTime.now()); // Đặt thời gian cập nhật
                    pillLogsRepository.save(newPillLog); // Lưu nhật ký trước

                    // Bây giờ, gửi thông báo
                    Notification notification = new Notification();
                    notification.setUser(user);
                    notification.setTitle("Nhắc nhở uống thuốc");
                    notification.setContent("Đã đến giờ uống thuốc của bạn.");
                    notification.setType(NotificationType.PILL_REMINDER);
                    notification.setScheduledAt(LocalDateTime.now());

                    try {
                        emailService.sendPillReminderAsync(user.getEmail(), user.getFullName(), schedule.getRemindTime());
                        notification.setStatus(NotificationStatus.SENT);
                        notification.setSentAt(LocalDateTime.now());
                        logger.info("Đã gửi email nhắc nhở uống thuốc thành công cho người dùng {} ({}) cho lịch trình ID {}", 
                                   user.getFullName(), user.getEmail(), schedule.getPillsId());
                    } catch (Exception ex) {
                        notification.setStatus(NotificationStatus.FAILED);
                        notification.setErrorMessage(ex.getMessage());
                        logger.error("Không thể gửi email nhắc nhở uống thuốc cho người dùng {} ({}) cho lịch trình ID {}. Lý do: {}", 
                                    user.getFullName(), user.getEmail(), schedule.getPillsId(), ex.getMessage(), ex);
                    }
                    notificationRepository.save(notification);
                    logger.info("Đã lưu bản ghi thông báo nhắc nhở uống thuốc cho người dùng ID: {} với trạng thái: {}", 
                               userId, notification.getStatus());
                } else {
                    // Log tồn tại nhưng chưa check-in, vẫn gửi lại nhắc nhở
                    Notification notification = new Notification();
                    notification.setUser(user);
                    notification.setTitle("Nhắc nhở uống thuốc");
                    notification.setContent("Đã đến giờ uống thuốc của bạn.");
                    notification.setType(NotificationType.PILL_REMINDER);
                    notification.setScheduledAt(LocalDateTime.now());

                    try {
                        emailService.sendPillReminderAsync(user.getEmail(), user.getFullName(), schedule.getRemindTime());
                        notification.setStatus(NotificationStatus.SENT);
                        notification.setSentAt(LocalDateTime.now());
                        logger.info("Đã gửi lại email nhắc nhở uống thuốc cho người dùng {} ({}) cho lịch trình ID {} (log tồn tại nhưng chưa check-in)", 
                                   user.getFullName(), user.getEmail(), schedule.getPillsId());
                    } catch (Exception ex) {
                        notification.setStatus(NotificationStatus.FAILED);
                        notification.setErrorMessage(ex.getMessage());
                        logger.error("Không thể gửi lại email nhắc nhở uống thuốc cho người dùng {} ({}) cho lịch trình ID {}. Lý do: {}", 
                                    user.getFullName(), user.getEmail(), schedule.getPillsId(), ex.getMessage(), ex);
                    }
                    notificationRepository.save(notification);
                    logger.info("Đã lưu bản ghi thông báo nhắc nhở uống thuốc (gửi lại) cho người dùng ID: {} với trạng thái: {}", 
                               userId, notification.getStatus());
                }
            } else {
                logger.info("Bỏ qua lời nhắc nhở uống thuốc cho lịch trình ID {} (người dùng ID {}): Thời gian nhắc nhở chưa đến.", 
                           schedule.getPillsId(), userId);
            }
        }
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

