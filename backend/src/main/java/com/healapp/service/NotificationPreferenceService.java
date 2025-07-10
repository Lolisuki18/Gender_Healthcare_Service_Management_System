package com.healapp.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.model.NotificationPreference;
import com.healapp.model.NotificationType;
import com.healapp.model.UserDtls;
import com.healapp.repository.NotificationPreferenceRepository;
import com.healapp.repository.UserRepository;

@Service
public class NotificationPreferenceService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationPreferenceService.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationPreferenceRepository notificationPreferenceRepo;

    public ApiResponse<List<NotificationPreference>> getUserNotificationPreferences() {
        try {
            // Kiểm tra người dùng đã đăng nhập
            Long userId = getCurrentUserId();
            if (userId == null) {
                return ApiResponse.error("User not authenticated");
            }

            List<NotificationPreference> preferences = notificationPreferenceRepo.findByUserId(userId);
            
            // Nếu user chưa có preferences nào, tạo default preferences
            if (preferences.isEmpty()) {
                createDefaultNotificationPreferences(userId);
                preferences = notificationPreferenceRepo.findByUserId(userId);
            }
            
            return ApiResponse.success("Notification preferences retrieved successfully", preferences);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve notification preferences: " + e.getMessage());
        }
    }

    public ApiResponse<Void> updateNotificationPreferences(String type, boolean enabled) {
        try {
            logger.info("Updating notification preference: type={}, enabled={}", type, enabled);
            
            // Kiểm tra người dùng đã đăng nhập
            Long userId = getCurrentUserId();
            if (userId == null) {
                logger.warn("User not authenticated when trying to update notification preference");
                return ApiResponse.error("User not authenticated");
            }
            
            logger.info("User ID: {}", userId);
            
            // Convert String to NotificationType enum
            NotificationType notificationType;
            try {
                notificationType = NotificationType.valueOf(type.toUpperCase());
                logger.info("Converted to notification type: {}", notificationType);
            } catch (IllegalArgumentException e) {
                logger.error("Invalid notification type: {}", type, e);
                return ApiResponse.error("Invalid notification type: " + type);
            }
            
            // Kiểm tra xem preference đã tồn tại chưa
            Optional<NotificationPreference> existingPreference = 
                notificationPreferenceRepo.findByUserIdAndType(userId, notificationType);
            
            if (existingPreference.isPresent()) {
                // Update existing preference
                logger.info("Updating existing preference for user {} and type {}", userId, notificationType);
                int updatedRows = notificationPreferenceRepo.updateNotificationPreference(userId, notificationType, enabled);
                logger.info("Successfully updated {} rows for existing preference", updatedRows);
                
                if (updatedRows == 0) {
                    logger.warn("No rows were updated. This might indicate a problem with the update query");
                }
            } else {
                // Tạo mới preference nếu chưa có
                logger.info("Creating new preference for user {} and type {}", userId, notificationType);
                Optional<UserDtls> userOpt = userRepository.findById(userId);
                if (!userOpt.isPresent()) {
                    logger.error("User not found with ID: {}", userId);
                    return ApiResponse.error("User not found");
                }
                
                NotificationPreference newPreference = new NotificationPreference();
                newPreference.setUser(userOpt.get());
                newPreference.setType(notificationType);
                newPreference.setEnabled(enabled);
                
                NotificationPreference saved = notificationPreferenceRepo.save(newPreference);
                logger.info("Successfully created new preference with ID: {}", saved.getId());
            }
            
            return ApiResponse.success("Notification preference updated successfully");
        } catch (Exception e) {
            logger.error("Failed to update notification preference", e);
            return ApiResponse.error("Failed to update notification preference: " + e.getMessage());
        }
    }

    /**
     * Tạo default notification preferences cho user mới
     * Default: tất cả notifications đều enabled = true
     */
    private void createDefaultNotificationPreferences(Long userId) {
        Optional<UserDtls> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        
        UserDtls user = userOpt.get();
        
        // Tạo preference cho tất cả các NotificationType
        for (NotificationType type : NotificationType.values()) {
            NotificationPreference preference = new NotificationPreference();
            preference.setUser(user);
            preference.setType(type);
            preference.setEnabled(true); // Default enabled
            
            notificationPreferenceRepo.save(preference);
        }
    }

    protected Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }
}
