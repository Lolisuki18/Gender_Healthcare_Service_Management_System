package com.healapp.service;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ChangePasswordRequest;
import com.healapp.dto.CreateAccountRequest;
import com.healapp.dto.DeleteAccountRequest;
import com.healapp.dto.ForgotPasswordRequest;
import com.healapp.dto.LoginRequest;
import com.healapp.dto.LoginResponse;
import com.healapp.dto.PhoneVerificationRequest;
import com.healapp.dto.RegisterRequest;
import com.healapp.dto.ResetPasswordRequest;
import com.healapp.dto.UpdateEmailRequest;
import com.healapp.dto.UpdatePhoneRequest;
import com.healapp.dto.UpdateProfileRequest;
import com.healapp.dto.UserResponse;
import com.healapp.dto.UserUpdateRequest;
import com.healapp.dto.VerificationCodeRequest;
import com.healapp.model.ConsultantProfile;
import com.healapp.model.Gender;
import com.healapp.model.NotificationPreference;
import com.healapp.model.NotificationType;
import com.healapp.model.Role;
import com.healapp.model.UserDtls;
import com.healapp.repository.ConsultantProfileRepository;
import com.healapp.repository.NotificationPreferenceRepository;
import com.healapp.repository.RoleRepository;
import com.healapp.repository.UserRepository;
import com.healapp.utils.TimezoneUtils;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @Autowired
    private ConsultantProfileRepository consultantProfileRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private NotificationPreferenceRepository notificationPreferenceRepo;

    @Autowired
    private PhoneVerificationService phoneVerificationService;

    @Value("${app.avatar.url.pattern}default.jpg")
    private String defaultAvatarPath;

    public boolean isEmailExists(String email) {
        // Kiểm tra email có tồn tại trong user active và chưa bị xóa
        // Repository method đã filter isActive=true và isDeleted=false
        // Email đã bị xóa sẽ có suffix _D nên không trùng với email gốc
        return userRepository.existsByEmailAndIsActiveTrueAndIsDeletedFalse(email);
    }

    public boolean isUsernameExists(String username) {
        // Kiểm tra username có tồn tại trong user active và chưa bị xóa
        // Repository method đã filter isActive=true và isDeleted=false  
        // Username đã bị xóa sẽ có suffix _D nên không trùng với username gốc
        return userRepository.existsByUsernameAndIsActiveTrueAndIsDeletedFalse(username);
    }

    public ApiResponse<String> sendEmailVerificationCode(VerificationCodeRequest request) {
        try {
            if (isEmailExists(request.getEmail())) {
                return ApiResponse.error("Email has been registered");
            }

            // Tạo mã xác thực
            String verificationCode = emailVerificationService.generateVerificationCode(request.getEmail());

            // Gửi email xác thực
            emailService.sendEmailVerificationCodeAsync(request.getEmail(), verificationCode);

            return ApiResponse.success("A verification code has been sent to your email.", request.getEmail());
        } catch (Exception e) {
            return ApiResponse.error("Unable to send verification code: " + e.getMessage());
        }
    }

    public ApiResponse<UserResponse> registerUser(RegisterRequest request, MultipartFile avatarFile) {
        try {
            // Kiểm tra mã xác thực email
            boolean isVerified = emailVerificationService.verifyCode(request.getEmail(), request.getVerificationCode());
            if (!isVerified) {
                return ApiResponse.error("Mã xác thực không đúng hoặc đã hết hạn");
            }

            // Kiểm tra username và email đã tồn tại
            if (isUsernameExistsAndActive(request.getUsername())) {
                return ApiResponse.error("Username đã tồn tại");
            }

            if (isEmailExistsAndActive(request.getEmail())) {
                return ApiResponse.error("Email đã tồn tại");
            } // Tạo user mới
            UserDtls user = new UserDtls();
            user.setFullName(request.getFullName());
            user.setBirthDay(request.getBirthDay());
            try {
                user.setGender(Gender.fromDisplayName(request.getGender()));
            } catch (IllegalArgumentException e) {
                return ApiResponse.error("Giới tính không hợp lệ");
            }
            user.setPhone(request.getPhone());
            user.setEmail(request.getEmail());
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setAvatar(defaultAvatarPath);
            user.setIsActive(true);
            user.setAddress(request.getAddress());

            // Set role mặc định là customer
            Role userRole = roleService.getDefaultUserRole();
            user.setRole(userRole);

            UserDtls savedUser = userRepository.save(user);

            // Thêm notification cho người dùng mới
            NotificationPreference ovulationNoti = new NotificationPreference();
            ovulationNoti.setUser(savedUser);
            ovulationNoti.setType(NotificationType.OVULATION);
            ovulationNoti.setRemindTime(LocalTime.of(7, 0)); // Mặc định nhắc nhở lúc 7 giờ sáng
            ovulationNoti.setEnabled(true);
            notificationPreferenceRepo.save(ovulationNoti);

            NotificationPreference pregnancyNoti = new NotificationPreference();
            pregnancyNoti.setUser(savedUser);
            pregnancyNoti.setType(NotificationType.PREGNANCY_PROBABILITY);
            pregnancyNoti.setRemindTime(LocalTime.of(7, 0)); // Mặc định nhắc nhở lúc 7 giờ sáng
            pregnancyNoti.setEnabled(true);
            notificationPreferenceRepo.save(pregnancyNoti);

            NotificationPreference pillNoti = new NotificationPreference();
            pillNoti.setUser(savedUser);
            pillNoti.setType(NotificationType.PILL_REMINDER);
            pillNoti.setRemindTime(LocalTime.of(7, 0)); // Mặc định nhắc nhở lúc 7 giờ sáng
            pillNoti.setEnabled(true);
            notificationPreferenceRepo.save(pillNoti);

            UserResponse userResponse = mapUserToResponse(savedUser);

            return ApiResponse.success("Đăng ký thành công", userResponse);

        } catch (Exception e) {
            return ApiResponse.error("Lỗi đăng ký: " + e.getMessage());
        }
    }

    public ApiResponse<LoginResponse> login(LoginRequest loginRequest) {
        try {
            String usernameOrEmail = loginRequest.getUsername();

            UserDtls user = null;

            // Tìm user theo email hoặc username
            if (usernameOrEmail.contains("@")) {
                // Nếu có ký tự @, coi như email
                user = findActiveUserByEmail(usernameOrEmail);
            } else {
                // Nếu không có @, coi như username
                user = findActiveUserByUsername(usernameOrEmail);
            }

            // Nếu không tìm thấy, thử tìm theo cả 2 cách (fallback)
            if (user == null && usernameOrEmail.contains("@")) {
                // Thử tìm theo username nếu email không tìm thấy
                user = findActiveUserByUsername(usernameOrEmail);
            } else if (user == null && !usernameOrEmail.contains("@")) {
                // Thử tìm theo email nếu username không tìm thấy
                user = findActiveUserByEmail(usernameOrEmail);
            }

            if (user == null) {
                return ApiResponse.error("Invalid username/email or password");
            }

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ApiResponse.error("Invalid username/email or password");
            }

            if (!user.getIsActive()) {
                return ApiResponse.error("Account is disabled");
            }

            // Kiểm tra nếu tài khoản đã bị xóa
            if (user.getIsDeleted() != null && user.getIsDeleted()) {
                return ApiResponse.error("Account has been deleted");
            }

            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setUserId(user.getId());
            loginResponse.setUsername(user.getUsername());
            loginResponse.setFullName(user.getFullName());
            loginResponse.setEmail(user.getEmail());
            loginResponse.setAvatar(user.getAvatar());
            loginResponse.setRole(user.getRoleName());
            loginResponse.setBirthDay(user.getBirthDay());
            // Trả về phone số sạch (bỏ suffix _V)
            loginResponse.setPhone(getCleanPhoneNumber(user.getPhone()));
            // Thêm provider để frontend biết user đăng nhập qua Google hay Local
            loginResponse.setProvider(user.getProvider() != null ? user.getProvider().name() : "LOCAL");

            return ApiResponse.success("Login successful", loginResponse);

        } catch (Exception e) {
            return ApiResponse.error("Login failed: " + e.getMessage());
        }
    }

    public UserDtls findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public ApiResponse<String> sendPasswordResetCode(ForgotPasswordRequest request) {
        try {
            Optional<UserDtls> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isEmpty()) {
                return ApiResponse.error("No account found with this email");
            }

            String verificationCode = passwordResetService.generateVerificationCode(request.getEmail());

            try {
                emailService.sendPasswordResetCode(request.getEmail(), verificationCode);
            } catch (MessagingException e) {
                return ApiResponse.error("Failed to send email: " + e.getMessage());
            }

            return ApiResponse.success("Verification code has been sent to your email", "reset_code_sent");

        } catch (PasswordResetService.RateLimitException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Error processing request: " + e.getMessage());
        }
    }

    public ApiResponse<String> sendPasswordResetCodeAsync(ForgotPasswordRequest request) {
        try {
            Optional<UserDtls> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isEmpty()) {
                return ApiResponse.error("No account found with this email");
            }

            String verificationCode = passwordResetService.generateVerificationCode(request.getEmail());

            emailService.sendPasswordResetCodeAsync(request.getEmail(), verificationCode);

            return ApiResponse.success("Verification code has been sent to your email", "reset_code_sent");

        } catch (PasswordResetService.RateLimitException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Error processing request: " + e.getMessage());
        }
    }

    public ApiResponse<String> resetPassword(ResetPasswordRequest request) {
        try {
            Optional<UserDtls> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isEmpty()) {
                return ApiResponse.error("No account found with this email");
            }

            UserDtls user = userOpt.get();

            boolean isValidCode = passwordResetService.verifyCode(request.getEmail(), request.getCode());
            if (!isValidCode) {
                return ApiResponse.error("Invalid or expired verification code");
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            passwordResetService.removeCode(request.getEmail());

            return ApiResponse.success("Password has been reset successfully", "password_reset");

        } catch (Exception e) {
            return ApiResponse.error("Failed to reset password: " + e.getMessage());
        }
    }

    public Long getUserIdFromUsername(String username) {
        UserDtls user = userRepository.findByUsername(username).orElse(null);
        return user != null ? user.getId() : null;
    }

    public UserDtls getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    // For Admin
    public ApiResponse<UserResponse> updateUserInfomation(Long userId, @Valid UserUpdateRequest request) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();

            // Kiểm tra email đã tồn tại (khác user hiện tại)
            if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
                boolean emailExists = userRepository.existsByEmail(request.getEmail());
                if (emailExists) {
                    return ApiResponse.error("Email already exists");
                }
            }

            String oldRoleName = user.getRoleName();
            String newRoleName = request.getRole().toUpperCase().trim();

            // Kiểm tra role hợp lệ
            if (!roleService.isValidRole(newRoleName)) {
                return ApiResponse.error("Invalid role. Role must be CUSTOMER, CONSULTANT, STAFF, or ADMIN");
            }

            // Cập nhật thông tin
            Role newRole = roleRepository.findByRoleName(newRoleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + newRoleName));
            user.setRole(newRole);
            user.setIsActive(request.getIsActive());
            user.setAddress(request.getAddress());
            user.setBirthDay(request.getBirthDay());
            user.setEmail(request.getEmail());
            user.setFullName(request.getFullName());
            try {
                user.setGender(Gender.fromDisplayName(request.getGender()));
            } catch (IllegalArgumentException e) {
                // Try as enum constant if display name fails
                try {
                    user.setGender(Gender.valueOf(request.getGender()));
                } catch (IllegalArgumentException ex) {
                    throw new IllegalArgumentException("Invalid gender: " + request.getGender());
                }
            }
            if (StringUtils.hasText(request.getPassword())) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            user.setPhone(request.getPhone());

            // Xử lý CONSULTANT chuyển đổi
            if ("CONSULTANT".equals(oldRoleName) && !"CONSULTANT".equals(newRoleName)) {
                consultantProfileRepository.findByUser(user)
                        .ifPresent(consultantProfileRepository::delete);
            }

            if (!"CONSULTANT".equals(oldRoleName) && "CONSULTANT".equals(newRoleName)) {
                ConsultantProfile profile = new ConsultantProfile();
                profile.setUser(user);
                profile.setQualifications("");
                profile.setExperience("");
                profile.setBio("");
                consultantProfileRepository.save(profile);
            }

            // Lưu user
            UserDtls updatedUser = userRepository.save(user);
            UserResponse response = mapUserToResponse(updatedUser);
            return ApiResponse.success("User updated successfully", response);
        } catch (Exception e) {
            return ApiResponse.error("Error updating user: " + e.getMessage());
        }
    }

    public ApiResponse<List<UserResponse>> getAllUsers() {
        try {
            List<UserDtls> users = userRepository.findAll();
            List<UserResponse> response = users.stream()
                    .map(this::mapUserToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Get list of users successfully", response);
        } catch (Exception e) {
            return ApiResponse.error("Error getting list of users: " + e.getMessage());
        }
    }

    public ApiResponse<UserResponse> getUserById(Long userId) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserResponse response = mapUserToResponse(userOpt.get());
            return ApiResponse.success("Get user information successfully", response);
        } catch (Exception e) {
            return ApiResponse.error("Error getting user information: " + e.getMessage());
        }
    }

    public ApiResponse<List<UserResponse>> getUsersByRole(String roleName) {
        try { // Validate role
            if (!roleService.isValidRole(roleName)) {
                return ApiResponse.error("Invalid role. Valid roles are: CUSTOMER, CONSULTANT, STAFF, ADMIN");
            }

            List<UserDtls> users = userRepository.findByRoleName(roleName);
            List<UserResponse> userResponses = users.stream()
                    .map(this::mapUserToResponse)
                    .collect(Collectors.toList());

            String message = String.format("Found %d user(s) with role %s", userResponses.size(), roleName);
            return ApiResponse.success(message, userResponses);

        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve users by role: " + e.getMessage());
        }
    }

    public ApiResponse<List<String>> getAvailableRoles() {
        try {
            List<Role> roles = roleRepository.findAll();
            List<String> roleNames = roles.stream()
                    .map(Role::getRoleName)
                    .collect(Collectors.toList());

            return ApiResponse.success("Available roles retrieved successfully", roleNames);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve available roles: " + e.getMessage());
        }
    }

    public ApiResponse<Map<String, Long>> getUserCountByRole() {
        try {
            Map<String, Long> roleCount = new HashMap<>();

            List<Role> roles = roleRepository.findAll();
            for (Role role : roles) {
                long count = userRepository.countByRole(role);
                roleCount.put(role.getRoleName(), count);
            }

            roleCount.put("TOTAL", userRepository.count());

            return ApiResponse.success("User count by role retrieved successfully", roleCount);

        } catch (Exception e) {
            return ApiResponse.error("Failed to count users by role: " + e.getMessage());
        }
    }

    public ApiResponse<UserResponse> updateBasicProfile(Long userId, UpdateProfileRequest request) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();

            // Cập nhật thông tin cơ bản (không bao gồm phone)
            user.setFullName(request.getFullName());
            user.setBirthDay(request.getBirthDay());
            user.setAddress(request.getAddress());

            if (request.getGender() != null && !request.getGender().trim().isEmpty()) {
                try {
                    user.setGender(Gender.fromDisplayName(request.getGender()));
                } catch (IllegalArgumentException e) {
                    return ApiResponse.error("Giới tính không hợp lệ");
                }
            }

            UserDtls updatedUser = userRepository.save(user);
            UserResponse response = mapUserToResponse(updatedUser);

            return ApiResponse.success("Basic profile updated successfully", response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to update basic profile: " + e.getMessage());
        }
    }

    public ApiResponse<String> sendEmailVerificationForUpdate(Long userId, VerificationCodeRequest request) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();

            // Kiểm tra nếu user đăng nhập bằng Google - không cho phép thay đổi email
            if (user.getProvider() == com.healapp.model.AuthProvider.GOOGLE) {
                return ApiResponse.error("Google accounts cannot change email address");
            }

            // Kiểm tra email mới có trùng với email hiện tại
            if (user.getEmail().equals(request.getEmail())) {
                return ApiResponse.error("New email cannot be the same as current email");
            }

            // Kiểm tra email mới có được sử dụng bởi user khác
            if (userRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.error("Email already exists");
            }

            // Tạo mã xác thực cho email mới
            String verificationCode = emailVerificationService.generateVerificationCode(request.getEmail());

            // Gửi email xác thực
            emailService.sendEmailUpdateVerificationAsync(request.getEmail(), verificationCode, user.getFullName());

            return ApiResponse.success("Verification code has been sent to your new email address",
                    request.getEmail());

        } catch (EmailVerificationService.RateLimitException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("Failed to send verification code: " + e.getMessage());
        }
    }

    public ApiResponse<UserResponse> updateEmail(Long userId, UpdateEmailRequest request) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();

            // Kiểm tra nếu user đăng nhập bằng Google - không cho phép thay đổi email
            if (user.getProvider() == com.healapp.model.AuthProvider.GOOGLE) {
                return ApiResponse.error("Google accounts cannot change email address");
            }

            // Kiểm tra email mới có trùng với email hiện tại không
            if (user.getEmail().equals(request.getNewEmail())) {
                return ApiResponse.error("New email cannot be the same as current email");
            }

            // Kiểm tra email mới có được sử dụng bởi user khác không
            if (userRepository.existsByEmail(request.getNewEmail())) {
                return ApiResponse.error("Email already exists");
            }

            // Xác thực mã verification code
            boolean isVerified = emailVerificationService.verifyCode(request.getNewEmail(),
                    request.getVerificationCode());
            if (!isVerified) {
                return ApiResponse.error("Invalid or expired verification code");
            }

            // Cập nhật email mới
            String oldEmail = user.getEmail();
            user.setEmail(request.getNewEmail());

            UserDtls updatedUser = userRepository.save(user);

            // Gửi email thông báo về việc thay đổi email
            try {
                emailService.sendEmailChangeNotificationAsync(oldEmail, request.getNewEmail(), user.getFullName());
                emailService.sendEmailChangeConfirmationAsync(request.getNewEmail(), user.getFullName());
            } catch (Exception e) {
            }

            UserResponse response = mapUserToResponse(updatedUser);
            return ApiResponse.success("Email updated successfully", response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to update email: " + e.getMessage());
        }
    }

    public ApiResponse<String> changePassword(Long userId, ChangePasswordRequest request) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();

            // Kiểm tra mật khẩu hiện tại
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ApiResponse.error("Current password is incorrect");
            }

            // Kiểm tra mật khẩu mới và xác nhận mật khẩu
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ApiResponse.error("New password and confirm password do not match");
            }

            // Kiểm tra mật khẩu mới không giống mật khẩu cũ
            if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                return ApiResponse.error("New password must be different from current password");
            }

            // Cập nhật mật khẩu mới
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            // Gửi email thông báo thay đổi mật khẩu
            try {
                emailService.sendPasswordChangeNotificationAsync(user.getEmail(), user.getFullName());
            } catch (Exception e) {
            }

            return ApiResponse.success("Password changed successfully", "password_changed");

        } catch (Exception e) {
            return ApiResponse.error("Failed to change password: " + e.getMessage());
        }
    }

    public ApiResponse<String> updateUserAvatar(Long userId, MultipartFile file) {
        try {
            // Kiểm tra user tồn tại
            Optional<UserDtls> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            // Kiểm tra file null hoặc empty TRƯỚC khi gọi isEmpty()
            if (file == null || file.isEmpty()) {
                return ApiResponse.error("Please select a file");
            }

            // Kiểm tra file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ApiResponse.error("Only image files are allowed");
            }

            // Kiểm tra file size (5MB = 5 * 1024 * 1024 bytes)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ApiResponse.error("File size must be less than 5MB");
            }

            UserDtls user = userOptional.get();

            // Lưu file avatar
            String avatarPath = fileStorageService.saveAvatarFile(file, userId);

            // Cập nhật avatar path trong database
            user.setAvatar(avatarPath);
            userRepository.save(user);

            return ApiResponse.success("Avatar updated successfully", avatarPath);

        } catch (Exception e) {
            return ApiResponse.error("Failed to save avatar file: " + e.getMessage());
        }
    }

    public Long getUserIdByUsername(String username) {
        Optional<UserDtls> userOpt = userRepository.findByUsername(username);
        return userOpt.map(UserDtls::getId).orElse(null);
    }

    private UserResponse mapUserToResponse(UserDtls user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setBirthDay(user.getBirthDay());
        response.setGender(user.getGenderDisplayName());
        // Hiển thị phone number gốc (bỏ suffix _V)
        response.setPhone(getCleanPhoneNumber(user.getPhone()));
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername());
        // Sửa avatar trả về đúng URL mặc định nếu cần
        String avatar = user.getAvatar();
        if (avatar == null || avatar.isEmpty() || "/img/avatar/default.jpg".equals(avatar)) {
            avatar = fileStorageService.buildAvatarUrl("default.jpg");
        }
        response.setAvatar(avatar);
        response.setIsActive(user.getIsActive());
        response.setRole(user.getRoleName());
        response.setAddress(user.getAddress());
        response.setCreatedDate(TimezoneUtils.convertUtcToVietnam(user.getCreatedDate()));
        response.setIsDeleted(user.getIsDeleted());
        response.setDeletedAt(TimezoneUtils.convertUtcToVietnam(user.getDeletedAt()));
        // Thêm provider để frontend biết user đăng nhập qua Google hay Local
        response.setProvider(user.getProvider() != null ? user.getProvider().name() : "LOCAL");
        return response;
    }

    public ApiResponse<UserDtls> createNewAccount(CreateAccountRequest request) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            // Check username already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already exists");
            }

            // Check role
            Optional<Role> roleOpt = roleRepository.findByRoleName(request.getRole().toUpperCase());
            if (!roleRepository.existsByRoleName(request.getRole().toUpperCase())) {
                throw new RuntimeException("Role not found: " + roleOpt.get());
            }

            // Create new user
            UserDtls nAccount = new UserDtls();
            nAccount.setFullName(request.getFullName());
            nAccount.setEmail(request.getEmail());
            if (StringUtils.hasText(request.getUsername())) {
                if (userRepository.existsByUsername(request.getUsername())) {
                    return ApiResponse.error("Username already exists");
                }
                nAccount.setUsername(request.getUsername());
            } else {
                nAccount.setUsername(request.getEmail()); // fallback: dùng email làm username nếu không có
            }
            if (StringUtils.hasText(request.getPassword())) {
                nAccount.setPassword(passwordEncoder.encode(request.getPassword()));
            } else {
                nAccount.setPassword(passwordEncoder.encode("Aa@123456"));
            }
            nAccount.setRole(roleOpt.get());
            nAccount.setIsActive(true);
            nAccount.setAddress(request.getAddress());
            nAccount.setBirthDay(request.getBirthDay());
            try {
                nAccount.setGender(Gender.fromDisplayName(request.getGender()));
            } catch (IllegalArgumentException e) {
                // Try as enum constant if display name fails
                try {
                    nAccount.setGender(Gender.valueOf(request.getGender()));
                } catch (IllegalArgumentException ex) {
                    throw new IllegalArgumentException("Invalid gender: " + request.getGender());
                }
            }
            nAccount.setPhone(request.getPhone());

            // Save user
            UserDtls savedAccount = userRepository.save(nAccount);

            // Thêm notification cho người dùng mới
            NotificationPreference ovulationNoti = new NotificationPreference();
            ovulationNoti.setUser(nAccount);
            ovulationNoti.setType(NotificationType.OVULATION);
            ovulationNoti.setEnabled(true);
            notificationPreferenceRepo.save(ovulationNoti);

            NotificationPreference pregnancyNoti = new NotificationPreference();
            pregnancyNoti.setUser(nAccount);
            pregnancyNoti.setType(NotificationType.PREGNANCY_PROBABILITY);
            pregnancyNoti.setEnabled(true);
            notificationPreferenceRepo.save(pregnancyNoti);

            NotificationPreference pillNoti = new NotificationPreference();
            pillNoti.setUser(nAccount);
            pillNoti.setType(NotificationType.PILL_REMINDER);
            pillNoti.setEnabled(true);
            notificationPreferenceRepo.save(pillNoti);

            // Create empty ConsultantProfile
            if (request.getRole().toUpperCase().equals("CONSULTANT")) {
                ConsultantProfile consultantProfile = new ConsultantProfile();
                consultantProfile.setUser(nAccount);
                consultantProfile.setQualifications("");
                consultantProfile.setExperience("");
                consultantProfile.setBio("");
                consultantProfileRepository.save(consultantProfile);
            }
            return ApiResponse.success("Consultant created successfully", savedAccount);
        } catch (Exception e) {
            return ApiResponse.error("Failed to create consultant: " + e.getMessage());
        }
    }

    public Map<String, Long> getAdminDashboardUserStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeDoctors", userRepository.findByRoleNameAndIsActive("CONSULTANT", true).stream().count());
        stats.put("activeStaffs", userRepository.findByRoleNameAndIsActive("STAFF", true).stream().count());
        stats.put("activePatients", userRepository.findByRoleNameAndIsActive("CUSTOMER", true).stream().count());
        return stats;
    }

    /**
     * Gửi mã xác thực SMS tới số điện thoại mới
     */
    public ApiResponse<String> sendPhoneVerificationCode(PhoneVerificationRequest request) {
        try {
            boolean sent = phoneVerificationService.sendPhoneVerificationCode(request.getPhone());

            if (sent) {
                return ApiResponse.success("Verification code has been sent to your phone", request.getPhone());
            } else {
                return ApiResponse.error("Failed to send verification code. Please try again.");
            }

        } catch (IllegalArgumentException e) {
            return ApiResponse.error("Invalid phone number format");
        } catch (Exception e) {
            return ApiResponse.error("Failed to send verification code: " + e.getMessage());
        }
    }

    /**
     * Xác thực mã OTP và cập nhật số điện thoại mới
     */
    public ApiResponse<UserResponse> updatePhoneNumber(Long userId, UpdatePhoneRequest request) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();

            // Kiểm tra phone mới có trùng với phone hiện tại không
            String currentPhone = user.getPhone();
            String newPhone = request.getPhone();

            if (currentPhone != null && currentPhone.equals(newPhone)) {
                return ApiResponse.error("New phone number cannot be the same as current phone number");
            }

            // Kiểm tra phone mới có được sử dụng bởi user khác không
            if (isPhoneExists(newPhone)) {
                return ApiResponse.error("Phone number already exists");
            }

            // Xác thực mã OTP
            boolean isVerified = phoneVerificationService.verifyPhoneCode(newPhone, request.getVerificationCode());
            if (!isVerified) {
                return ApiResponse.error("Invalid or expired verification code");
            }

            // Cập nhật phone number với suffix _V để đánh dấu đã verified
            user.setPhone(newPhone + "_V");

            UserDtls updatedUser = userRepository.save(user);

            // Clear phone verification data
            phoneVerificationService.clearPhoneVerification(newPhone);

            UserResponse response = mapUserToResponse(updatedUser);
            return ApiResponse.success("Phone number updated successfully", response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to update phone number: " + e.getMessage());
        }
    }

    /**
     * Kiểm tra phone number đã tồn tại chưa (không tính suffix _V và _D)
     */
    public boolean isPhoneExists(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }

        // Chỉ kiểm tra trong user active và chưa bị xóa
        return userRepository.findAll().stream()
                .filter(user -> user.getIsActive() && !user.getIsDeleted()) // Chỉ check user active
                .anyMatch(user -> {
                    String userPhone = user.getPhone();
                    if (userPhone == null) return false;

                    // Loại bỏ suffix _V (verified) và _D (deleted) nếu có
                    String cleanUserPhone = userPhone;
                    if (userPhone.endsWith("_V")) {
                        cleanUserPhone = userPhone.substring(0, userPhone.length() - 2);
                    } else if (userPhone.contains("_D")) {
                        // Phone đã bị xóa sẽ có suffix _D{digits}, bỏ qua
                        return false;
                    }

                    return cleanUserPhone.equals(phone);
                });
    }

    /**
     * Lấy phone number gốc (bỏ suffix _V và _D)
     */
    public String getCleanPhoneNumber(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return phone;
        }

        // Loại bỏ suffix _V (verified)
        if (phone.endsWith("_V")) {
            return phone.substring(0, phone.length() - 2);
        }
        
        // Loại bỏ suffix _D{digits} (deleted) - pattern: _D + 5 digits
        if (phone.contains("_D")) {
            int deleteSuffixIndex = phone.indexOf("_D");
            return phone.substring(0, deleteSuffixIndex);
        }

        return phone;
    }

    /**
     * Kiểm tra phone number đã được verified chưa
     */
    public boolean isPhoneVerified(String phone) {
        return phone != null && phone.endsWith("_V");
    }

    // OAuth-related methods
    public UserDtls findByEmailAndProvider(String email, com.healapp.model.AuthProvider provider) {
        return userRepository.findByEmailAndProvider(email, provider).orElse(null);
    }

    public UserDtls saveUser(UserDtls user) {
        return userRepository.save(user);
    }

    // ================= ACCOUNT DELETION METHODS =================

    /**
     * Gửi mã xác thực để xóa tài khoản
     */
    public ApiResponse<String> sendDeleteVerificationCode(Long userId, String password) {
        try {
            // Lấy thông tin user
            UserDtls user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ApiResponse.error("Không tìm thấy người dùng");
            }

            // Kiểm tra role - chỉ cho phép CUSTOMER xóa tài khoản
            String userRole = user.getRoleName();
            if (!"CUSTOMER".equals(userRole)) {
                return ApiResponse.error("Chỉ tài khoản CUSTOMER mới được phép xóa.");
            }

            // Kiểm tra mật khẩu
            if (!passwordEncoder.matches(password, user.getPassword())) {
                return ApiResponse.error("Mật khẩu không đúng");
            }

            // Kiểm tra nếu user đăng nhập bằng OAuth (Google)
            if (user.getProvider() != com.healapp.model.AuthProvider.LOCAL) {
                return ApiResponse.error("Tài khoản đăng nhập bằng Google không thể xóa qua API này");
            }

            // Tạo mã xác thực
            String verificationCode = emailVerificationService.generateVerificationCode(user.getEmail());

            // Gửi email xác thực
            emailService.sendDeleteAccountVerificationCodeAsync(user.getEmail(), verificationCode);

            return ApiResponse.success("Mã xác thực đã được gửi đến email của bạn", user.getEmail());

        } catch (Exception e) {
            return ApiResponse.error("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    /**
     * Xóa tài khoản (soft delete) - đánh dấu isDeleted = true
     */
    @org.springframework.transaction.annotation.Transactional
    public ApiResponse<String> deleteAccount(Long userId, DeleteAccountRequest request) {
        try {
            // Lấy thông tin user
            UserDtls user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ApiResponse.error("Không tìm thấy người dùng");
            }

            // Kiểm tra role - chỉ cho phép CUSTOMER xóa tài khoản
            String userRole = user.getRoleName();
            if (!"CUSTOMER".equals(userRole)) {
                return ApiResponse.error("Chỉ tài khoản CUSTOMER mới được phép xóa.");
            }

            // Kiểm tra mật khẩu
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ApiResponse.error("Mật khẩu không đúng");
            }

            // Kiểm tra mã xác thực
            boolean isVerified = emailVerificationService.verifyCode(user.getEmail(), request.getVerificationCode());
            if (!isVerified) {
                return ApiResponse.error("Mã xác thực không đúng hoặc đã hết hạn");
            }

            // Kiểm tra nếu user đăng nhập bằng OAuth (Google)
            if (user.getProvider() != com.healapp.model.AuthProvider.LOCAL) {
                return ApiResponse.error("Tài khoản đăng nhập bằng Google không thể xóa qua API này");
            }

            // Tạo suffix ngắn để đảm bảo unique và không vượt quá độ dài cột
            // Dùng random + timestamp cuối để tránh trùng lặp
            String timestampSuffix = String.valueOf(System.currentTimeMillis()).substring(8); // Lấy 5 chữ số cuối
            String deletionSuffix = "_D" + timestampSuffix; // Ví dụ: _D12345 (7 ký tự)
            
            // Soft delete - thêm suffix để "vô hiệu hóa" và giải phóng email, username, phone gốc
            if (user.getEmail() != null) {
                user.setEmail(user.getEmail() + deletionSuffix);
            }
            if (user.getUsername() != null) {
                user.setUsername(user.getUsername() + deletionSuffix);
            }
            if (user.getPhone() != null) {
                // Kiểm tra độ dài phone để tránh vượt quá giới hạn cột (15 ký tự)
                String originalPhone = user.getPhone();
                if (originalPhone.length() + deletionSuffix.length() <= 15) {
                    user.setPhone(originalPhone + deletionSuffix);
                } else {
                    // Nếu quá dài, cắt bớt phone gốc để vừa với suffix
                    int maxOriginalLength = 15 - deletionSuffix.length();
                    String truncatedPhone = originalPhone.substring(0, Math.min(originalPhone.length(), maxOriginalLength));
                    user.setPhone(truncatedPhone + deletionSuffix);
                }
            }
            
            // Xóa thông tin cá nhân khác
            user.setFullName("Tài khoản đã xóa");
            user.setAvatar(null);
            user.setBirthDay(null);
            user.setAddress(null);
            
            // Đánh dấu tài khoản đã bị xóa
            user.setIsActive(false);
            user.setIsDeleted(true);
            user.setDeletedAt(java.time.LocalDateTime.now());
            
            // Vô hiệu hóa password bằng cách thêm suffix (không được set null do constraint)
            user.setPassword("DELETED_ACCOUNT" + deletionSuffix);
            
            userRepository.save(user);

            // Gửi email xác nhận xóa tài khoản đến email gốc
            try {
                // TODO: Implement sendAccountDeletionConfirmationAsync method in EmailService
                // emailService.sendAccountDeletionConfirmationAsync(originalEmail, originalFullName);
            } catch (Exception e) {
                // Log warning nhưng không throw exception
            }

            return ApiResponse.success("Tài khoản đã được xóa vĩnh viễn. Email, username và số điện thoại có thể được sử dụng để đăng ký tài khoản mới.");

        } catch (Exception e) {
            return ApiResponse.error("Có lỗi xảy ra khi xóa tài khoản: " + e.getMessage());
        }
    }

    // ================= ADMIN ACCOUNT MANAGEMENT =================

    /**
     * Admin vô hiệu hóa tài khoản (có thể khôi phục)
     */
    @org.springframework.transaction.annotation.Transactional
    public ApiResponse<String> disableAccountByAdmin(Long userId, String reason) {
        try {
            UserDtls user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ApiResponse.error("Không tìm thấy người dùng");
            }

            // Admin disable - không xóa thông tin cá nhân
            user.setIsActive(false);
            // Không set isDeleted = true vì đây là admin disable, không phải user delete
            
            userRepository.save(user);

            return ApiResponse.success("Tài khoản đã được vô hiệu hóa bởi admin");

        } catch (Exception e) {
            return ApiResponse.error("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    /**
     * Admin khôi phục tài khoản đã bị vô hiệu hóa
     */
    @org.springframework.transaction.annotation.Transactional
    public ApiResponse<String> restoreAccountByAdmin(Long userId) {
        try {
            UserDtls user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ApiResponse.error("Không tìm thấy người dùng");
            }

            // Chỉ có thể khôi phục tài khoản bị admin disable, không thể khôi phục tài khoản đã bị user xóa
            if (user.getIsDeleted() != null && user.getIsDeleted()) {
                return ApiResponse.error("Không thể khôi phục tài khoản đã bị xóa bởi người dùng");
            }

            user.setIsActive(true);
            userRepository.save(user);

            return ApiResponse.success("Tài khoản đã được khôi phục thành công");

        } catch (Exception e) {
            return ApiResponse.error("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    // ================= UPDATED METHODS FOR SOFT DELETE =================

    /**
     * Cập nhật method đăng ký để kiểm tra email/username đã bị sử dụng bởi user active
     */
    public boolean isEmailExistsAndActive(String email) {
        return userRepository.existsByEmailAndIsActiveTrueAndIsDeletedFalse(email);
    }

    public boolean isUsernameExistsAndActive(String username) {
        return userRepository.existsByUsernameAndIsActiveTrueAndIsDeletedFalse(username);
    }

    /**
     * Tìm user active để login
     */
    public UserDtls findActiveUserByEmail(String email) {
        return userRepository.findByEmailAndIsActiveTrueAndIsDeletedFalse(email).orElse(null);
    }

    public UserDtls findActiveUserByUsername(String username) {
        return userRepository.findByUsernameAndIsActiveTrueAndIsDeletedFalse(username).orElse(null);
    }
}