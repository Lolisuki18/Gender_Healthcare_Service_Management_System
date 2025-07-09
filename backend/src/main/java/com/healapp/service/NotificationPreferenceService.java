package com.healapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.model.NotificationType;
import com.healapp.repository.NotificationPreferenceRepository;

@Service
public class NotificationPreferenceService {

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationPreferenceRepository notificationPreferenceRepo;

    public ApiResponse<Void> updateNotificationPreferences(String type, boolean enabled) {
        try {
            // Kiểm tra người dùng đã đăng nhập
            Long userId = getCurrentUserId();
            if (userId == null) {
                return ApiResponse.error("User not authenticated");
            }
            
            // Convert String to NotificationType enum
            NotificationType notificationType;
            try {
                notificationType = NotificationType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ApiResponse.error("Invalid notification type: " + type);
            }
            
            notificationPreferenceRepo.updateNotificationPreference(userId, notificationType, enabled);
            return ApiResponse.success("Notification preference updated successfully");
        } catch (Exception e) {
            return ApiResponse.error("Failed to update notification preference: " + e.getMessage());
        }
    }

    protected Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }
}
