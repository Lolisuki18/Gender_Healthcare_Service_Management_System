package com.healapp.controller;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ChangePasswordRequest;
import com.healapp.dto.RegisterRequest;
import com.healapp.service.EmailService;
import com.healapp.service.EmailVerificationService;
import com.healapp.service.UserService;
import com.healapp.dto.ForgotPasswordRequest;
import com.healapp.dto.ResetPasswordRequest;
import com.healapp.dto.UpdateEmailRequest;
import com.healapp.dto.UpdateProfileRequest;
import com.healapp.dto.UserResponse;
import com.healapp.dto.VerificationCodeRequest;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            ApiResponse<UserResponse> response = userService.registerUser(request, null);

            if (response.isSuccess()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(response);
            } else {
                return ResponseEntity.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();

            ApiResponse<UserResponse> errorResponse = ApiResponse.error("Lỗi server: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(errorResponse);
        }
    }

    @PostMapping("/send-verification")
    public ResponseEntity<ApiResponse<String>> sendVerificationCode(
            @Valid @RequestBody VerificationCodeRequest request) {

        ApiResponse<String> response = userService.sendEmailVerificationCode(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        ApiResponse<String> response = userService.sendPasswordResetCodeAsync(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        ApiResponse<String> response = userService.resetPassword(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }

            String username = authentication.getName();
            Long userId = userService.getUserIdFromUsername(username);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            ApiResponse<UserResponse> response = userService.getUserById(userId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error retrieving profile: " + e.getMessage()));
        }
    }

    // cập nhật thông tin
    @PutMapping("/profile/basic")
    public ResponseEntity<ApiResponse<UserResponse>> updateBasicProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }

            String username = authentication.getName();
            Long userId = userService.getUserIdFromUsername(username);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            ApiResponse<UserResponse> response = userService.updateBasicProfile(userId, request);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error updating basic profile: " + e.getMessage()));
        }
    }

    // gửi mã email mới khi cập nhật
    @PostMapping("/profile/email/send-verification")
    public ResponseEntity<ApiResponse<String>> sendEmailVerificationForUpdate(
            @Valid @RequestBody VerificationCodeRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }

            String username = authentication.getName();
            Long userId = userService.getUserIdFromUsername(username);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            ApiResponse<String> response = userService.sendEmailVerificationForUpdate(userId, request);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error sending verification code: " + e.getMessage()));
        }
    }

    // câp nhật email của người dùng đã đăng nhập
    @PutMapping("/profile/email")
    public ResponseEntity<ApiResponse<UserResponse>> updateEmail(
            @Valid @RequestBody UpdateEmailRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }

            String username = authentication.getName();
            Long userId = userService.getUserIdFromUsername(username);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            ApiResponse<UserResponse> response = userService.updateEmail(userId, request);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error updating email: " + e.getMessage()));
        }
    }

    // API thay đổi mật khẩu
    @PutMapping("/profile/password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }

            String username = authentication.getName();
            Long userId = userService.getUserIdFromUsername(username);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            ApiResponse<String> response = userService.changePassword(userId, request);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error changing password: " + e.getMessage()));
        }
    }

    // API thay đổi ava
    @PostMapping(value = "/profile/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> updateAvatar(
            @RequestParam("file") MultipartFile file) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }

            String username = authentication.getName();
            Long userId = userService.getUserIdFromUsername(username);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            ApiResponse<String> response = userService.updateUserAvatar(userId, file);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error updating avatar: " + e.getMessage()));
        }
    }

    // Lấy thông tin user theo id (dùng cho FE hiển thị chi tiết customer)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('CONSULTANT')")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        ApiResponse<UserResponse> response = userService.getUserById(id);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Kiểm tra username đã tồn tại (API cho frontend realtime validation)
    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsernameExists(@RequestParam("username") String username) {
        boolean exists = userService.isUsernameExists(username);
        return ResponseEntity.ok().body(java.util.Collections.singletonMap("exists", exists));
    }

    // cập nhật số điện thoại trực tiếp, không cần mã xác thực
    @PutMapping("/profile/phone")
    public ResponseEntity<ApiResponse<UserResponse>> updatePhone(@RequestParam String phone) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }
            String username = authentication.getName();
            Long userId = userService.getUserIdFromUsername(username);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }
            // Cập nhật trực tiếp không cần mã xác thực
            ApiResponse<UserResponse> response = userService.updatePhone(userId, phone);
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error updating phone: " + e.getMessage()));
        }
    }
}