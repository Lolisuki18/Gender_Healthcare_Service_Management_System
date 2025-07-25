package com.healapp.controller;

import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healapp.dto.ApiResponse;
import com.healapp.model.NotificationPreference;
import com.healapp.service.NotificationPreferenceService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/notification-preferences")
public class NotificationPreferenceController {
    @Autowired
    private NotificationPreferenceService notificationPreferenceService;
    
    // description: Lấy cài đặt thông báo của user hiện tại
    // method: GET
    @GetMapping
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<List<NotificationPreference>>> getUserNotificationPreferences() {
        ApiResponse<List<NotificationPreference>> response = notificationPreferenceService.getUserNotificationPreferences();
        return ResponseEntity.ok(response);
    }
    
    // description: Cập nhật thông báo
    // method: PUT
    @PutMapping("/{type}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<Void>> updateNotificationPreferences(@PathVariable String type, @RequestParam boolean enabled) {
        ApiResponse<Void> response = notificationPreferenceService.updateNotificationPreferences(type, enabled);
        return ResponseEntity.ok(response);
    }

    // description: Cập nhật thời gian gửi thông báo
    // method: PUT
    @PutMapping("/{type}/time")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<Void>> updateNotificationTime(@PathVariable String type, @RequestParam LocalTime time) {
        ApiResponse<Void> response = notificationPreferenceService.updateNotificationTime(type, time);
        return ResponseEntity.ok(response);
    }

}
