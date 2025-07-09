package com.healapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healapp.dto.ApiResponse;
import com.healapp.service.NotificationPreferenceService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/notification-preferences")
public class NotificationPreferenceController {
    @Autowired
    private NotificationPreferenceService notificationPreferenceService;
    
    // description: Cập nhật thông báo
    // method: PUT
    @PutMapping("/{type}")
    public ResponseEntity<ApiResponse<Void>> updateNotificationPreferences(@PathVariable String type, @RequestBody boolean enabled) {
        ApiResponse<Void> response = notificationPreferenceService.updateNotificationPreferences(type, enabled);
        return ResponseEntity.ok(response);
    }
}
