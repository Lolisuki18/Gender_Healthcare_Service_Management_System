package com.healapp.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.healapp.service.NotificationService;

@Component
public class ReminderScheduler {

    @Autowired
    private NotificationService notificationService;

    // Lịch trình gửi thông báo nhắc nhở ngày rụng trứng
    // @Scheduled(cron = "0 0 7 * * ?") // Chạy lúc 7:00 AM mỗi ngày
    @Scheduled(cron = "0 */1 * * * *") // For testing: every 5 minute
    public void sendOvulationReminder() {
        notificationService.sendOvulationNotification();
    }

    // @Scheduled(cron = "0 30 7 * * ?") // Chạy lúc 7:30 AM mỗi ngày
    @Scheduled(cron = "0 */1 * * * *") // For testing: every 5 minute
    public void sendPregnancyReminder() {
        notificationService.sendPregnancyProbNotification();
    }
}
