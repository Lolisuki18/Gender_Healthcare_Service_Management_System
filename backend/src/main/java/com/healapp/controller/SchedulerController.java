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

    @GetMapping("/ovulation-remind")
    public ResponseEntity<String> sendOvulationRemind() {
        notificationService.sendOvulationNotification();
        return ResponseEntity.ok("Ovulation reminder sent successfully");
    }

    @GetMapping("/pregnancy-remind")
    public ResponseEntity<String> sendPregnancyRemind() {
        notificationService.sendPregnancyProbNotification();
        return ResponseEntity.ok("Pregnancy probability reminder sent successfully");
    }
    
    @GetMapping("/pill-remind")
    public ResponseEntity<String> sendPillRemind() {
        notificationService.sendPillReminder();
        return ResponseEntity.ok("Pill reminder sent successfully");
    }

}
