package com.healapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healapp.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/scheduler")
public class SchedulerController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/send-remind")
    public ResponseEntity<String> sendReminders() {
        notificationService.sendOvulationNotification();
        notificationService.sendPregnancyProbNotification();
        notificationService.sendPillReminder();
        return ResponseEntity.ok("All reminders sent successfully");
    }

}
