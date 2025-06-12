package com.healapp.service;

import com.healapp.dto.*;
import com.healapp.model.ConsultantProfile;
import com.healapp.model.Role;
import com.healapp.model.UserDtls;
import com.healapp.model.Gender;
import com.healapp.repository.ConsultantProfileRepository;
import com.healapp.repository.RoleRepository;
import com.healapp.repository.UserRepository;
import com.healapp.service.EmailService;
import com.healapp.service.EmailVerificationService;
import com.healapp.service.FileStorageService;
import com.healapp.service.PasswordResetService;
import com.healapp.service.RoleService;
import com.healapp.service.UserService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Test")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordResetService passwordResetService;

    @Mock
    private EmailService emailService;

    @Mock
    private EmailVerificationService emailVerificationService;

    @Mock
    private ConsultantProfileRepository consultantProfileRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private RoleService roleService;

    @InjectMocks
    private UserService userService;

    private UserDtls sampleUser;
    private Role userRole;
    private Role consultantRole;
    private Role staffRole;
    private Role adminRole;

    @BeforeEach
    void setUp() { // Setup Role entities
        userRole = new Role();
        userRole.setRoleId(1L);
        userRole.setRoleName("CUSTOMER");
        userRole.setDescription("Regular customer role");

        consultantRole = new Role();
        consultantRole.setRoleId(2L);
        consultantRole.setRoleName("CONSULTANT");
        consultantRole.setDescription("Consultant role");

        staffRole = new Role();
        staffRole.setRoleId(3L);
        staffRole.setRoleName("STAFF");
        staffRole.setDescription("Staff role");

        adminRole = new Role();
        adminRole.setRoleId(4L);
        adminRole.setRoleName("ADMIN");
        adminRole.setDescription("Administrator role");

        // Setup sample user với createdDate thay vì createdAt
        sampleUser = new UserDtls();
        sampleUser.setId(1L);
        sampleUser.setFullName("Nguyen Van A");
        sampleUser.setBirthDay(LocalDate.of(1990, 1, 15));
        sampleUser.setPhone("0123456789");
        sampleUser.setEmail("nguyenvana@example.com");
        sampleUser.setUsername("nguyenvana");
        sampleUser.setPassword("encodedPassword");
        sampleUser.setAvatar("/img/avatar/default.jpg");
        sampleUser.setIsActive(true);
        sampleUser.setGender(Gender.MALE);
        sampleUser.setRole(userRole);
        sampleUser.setCreatedDate(LocalDateTime.now().minusDays(30));

        // Set default avatar path
        ReflectionTestUtils.setField(userService, "defaultAvatarPath", "/img/avatar/default.jpg");
    }

    // Email and Username existence tests
    @Test
    @DisplayName("Kiểm tra email đã tồn tại - trả về true")
    void isEmailExists_EmailExists_ShouldReturnTrue() {
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        boolean result = userService.isEmailExists("existing@example.com");

        assertTrue(result);
        verify(userRepository).existsByEmail("existing@example.com");
    }

    @Test
    @DisplayName("Kiểm tra email chưa tồn tại - trả về false")
    void isEmailExists_EmailNotExists_ShouldReturnFalse() {
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);

        boolean result = userService.isEmailExists("new@example.com");

        assertFalse(result);
        verify(userRepository).existsByEmail("new@example.com");
    }

    @Test
    @DisplayName("Kiểm tra username đã tồn tại - trả về true")
    void isUsernameExists_UsernameExists_ShouldReturnTrue() {
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        boolean result = userService.isUsernameExists("existinguser");

        assertTrue(result);
        verify(userRepository).existsByUsername("existinguser");
    }

    @Test
    @DisplayName("Kiểm tra username chưa tồn tại - trả về false")
    void isUsernameExists_UsernameNotExists_ShouldReturnFalse() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);

        boolean result = userService.isUsernameExists("newuser");

        assertFalse(result);
        verify(userRepository).existsByUsername("newuser");
    }

    // Email verification tests
    @Test
    @DisplayName("Gửi mã xác thực email thành công")
    void sendEmailVerificationCode_Success() throws Exception {
        VerificationCodeRequest request = new VerificationCodeRequest();
        request.setEmail("new@example.com");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(emailVerificationService.generateVerificationCode("new@example.com")).thenReturn("123456");
        doNothing().when(emailService).sendEmailVerificationCodeAsync("new@example.com", "123456");

        ApiResponse<String> response = userService.sendEmailVerificationCode(request);

        assertTrue(response.isSuccess());
        assertEquals("A verification code has been sent to your email.", response.getMessage());
        assertEquals("new@example.com", response.getData());

        verify(userRepository).existsByEmail("new@example.com");
        verify(emailVerificationService).generateVerificationCode("new@example.com");
        verify(emailService).sendEmailVerificationCodeAsync("new@example.com", "123456");
    }

    @Test
    @DisplayName("Gửi mã xác thực email thất bại - email đã tồn tại")
    void sendEmailVerificationCode_EmailExists_ShouldFail() {
        VerificationCodeRequest request = new VerificationCodeRequest();
        request.setEmail("existing@example.com");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        ApiResponse<String> response = userService.sendEmailVerificationCode(request);

        assertFalse(response.isSuccess());
        assertEquals("Email has been registered", response.getMessage());

        verify(userRepository).existsByEmail("existing@example.com");
        verifyNoInteractions(emailVerificationService);
        verifyNoInteractions(emailService);
    }

    // User registration tests
    @Test
    @DisplayName("Đăng ký người dùng thành công")
    void registerUser_Success() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test User");
        request.setBirthDay(LocalDate.of(1995, 5, 15));
        request.setPhone("0987654321");
        request.setEmail("test@example.com");
        request.setUsername("testuser");
        request.setPassword("password123");
        request.setGender(Gender.FEMALE);
        request.setVerificationCode("123456");

        MultipartFile avatarFile = new MockMultipartFile("avatar", "avatar.jpg", "image/jpeg", "test".getBytes());

        when(emailVerificationService.verifyCode("test@example.com", "123456")).thenReturn(true);
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword123");
        when(roleService.getDefaultUserRole()).thenReturn(userRole);
        when(userRepository.save(any(UserDtls.class))).thenReturn(sampleUser);

        ApiResponse<UserResponse> response = userService.registerUser(request, avatarFile);

        assertTrue(response.isSuccess());
        assertEquals("Đăng ký thành công", response.getMessage());
        assertNotNull(response.getData());
        assertEquals("Nguyen Van A", response.getData().getFullName());
        assertEquals("CUSTOMER", response.getData().getRole());

        verify(emailVerificationService).verifyCode("test@example.com", "123456");
        verify(userRepository).existsByUsername("testuser");
        verify(userRepository).existsByEmail("test@example.com");
        verify(passwordEncoder).encode("password123");
        verify(roleService).getDefaultUserRole();
        verify(userRepository).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Đăng ký thất bại - mã xác thực không đúng")
    void registerUser_InvalidVerificationCode_ShouldFail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setVerificationCode("wrong_code");

        when(emailVerificationService.verifyCode("test@example.com", "wrong_code")).thenReturn(false);

        ApiResponse<UserResponse> response = userService.registerUser(request, null);

        assertFalse(response.isSuccess());
        assertEquals("Mã xác thực không đúng hoặc đã hết hạn", response.getMessage());

        verify(emailVerificationService).verifyCode("test@example.com", "wrong_code");
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Đăng ký thất bại - username đã tồn tại")
    void registerUser_UsernameExists_ShouldFail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setUsername("existinguser");
        request.setVerificationCode("123456");

        when(emailVerificationService.verifyCode("test@example.com", "123456")).thenReturn(true);
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        ApiResponse<UserResponse> response = userService.registerUser(request, null);

        assertFalse(response.isSuccess());
        assertEquals("Username đã tồn tại", response.getMessage());

        verify(userRepository).existsByUsername("existinguser");
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Đăng ký thất bại - email đã tồn tại")
    void registerUser_EmailExists_ShouldFail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setUsername("newuser");
        request.setVerificationCode("123456");

        when(emailVerificationService.verifyCode("existing@example.com", "123456")).thenReturn(true);
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        ApiResponse<UserResponse> response = userService.registerUser(request, null);

        assertFalse(response.isSuccess());
        assertEquals("Email đã tồn tại", response.getMessage());

        verify(userRepository).existsByEmail("existing@example.com");
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Đăng ký với gender null - set default OTHER")
    void registerUser_WithNullGender_ShouldSetDefault() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test User");
        request.setEmail("test@example.com");
        request.setUsername("testuser");
        request.setPassword("password123");
        request.setGender(null); // Gender null
        request.setVerificationCode("123456");

        when(emailVerificationService.verifyCode("test@example.com", "123456")).thenReturn(true);
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(roleService.getDefaultUserRole()).thenReturn(userRole);
        when(userRepository.save(any(UserDtls.class))).thenReturn(sampleUser);

        ApiResponse<UserResponse> response = userService.registerUser(request, null);

        assertTrue(response.isSuccess());

        // Verify gender được set default là OTHER
        ArgumentCaptor<UserDtls> userCaptor = ArgumentCaptor.forClass(UserDtls.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals(Gender.OTHER, userCaptor.getValue().getGender());
    }

    // Login tests
    @Test
    @DisplayName("Đăng nhập thành công với username")
    void login_WithUsername_Success() {
        LoginRequest request = new LoginRequest();
        request.setUsername("nguyenvana");
        request.setPassword("password123");

        when(userRepository.findByUsername("nguyenvana")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);

        ApiResponse<LoginResponse> response = userService.login(request);
        assertTrue(response.isSuccess());
        assertEquals("Login successful", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(1L, response.getData().getUserId());
        assertEquals("nguyenvana", response.getData().getUsername());
        assertEquals("CUSTOMER", response.getData().getRole());

        verify(userRepository).findByUsername("nguyenvana");
        verify(passwordEncoder).matches("password123", "encodedPassword");
    }

    @Test
    @DisplayName("Đăng nhập thành công với email")
    void login_WithEmail_Success() {
        LoginRequest request = new LoginRequest();
        request.setUsername("nguyenvana@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("nguyenvana@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);

        ApiResponse<LoginResponse> response = userService.login(request);

        assertTrue(response.isSuccess());
        assertEquals("Login successful", response.getMessage());
        assertNotNull(response.getData());

        verify(userRepository).findByEmail("nguyenvana@example.com");
        verify(passwordEncoder).matches("password123", "encodedPassword");
    }

    @Test
    @DisplayName("Đăng nhập thất bại - username/email không tồn tại")
    void login_UserNotFound_ShouldFail() {
        LoginRequest request = new LoginRequest();
        request.setUsername("nonexistent");
        request.setPassword("password123");

        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        ApiResponse<LoginResponse> response = userService.login(request);

        assertFalse(response.isSuccess());
        assertEquals("Invalid username/email or password", response.getMessage());

        verify(userRepository).findByUsername("nonexistent");
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    @DisplayName("Đăng nhập thất bại - mật khẩu sai")
    void login_WrongPassword_ShouldFail() {
        LoginRequest request = new LoginRequest();
        request.setUsername("nguyenvana");
        request.setPassword("wrongpassword");

        when(userRepository.findByUsername("nguyenvana")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        ApiResponse<LoginResponse> response = userService.login(request);

        assertFalse(response.isSuccess());
        assertEquals("Invalid username/email or password", response.getMessage());

        verify(passwordEncoder).matches("wrongpassword", "encodedPassword");
    }

    @Test
    @DisplayName("Đăng nhập thất bại - tài khoản bị vô hiệu hóa")
    void login_InactiveAccount_ShouldFail() {
        sampleUser.setIsActive(false);
        LoginRequest request = new LoginRequest();
        request.setUsername("nguyenvana");
        request.setPassword("password123");

        when(userRepository.findByUsername("nguyenvana")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);

        ApiResponse<LoginResponse> response = userService.login(request);

        assertFalse(response.isSuccess());
        assertEquals("Account is disabled", response.getMessage());

        verify(passwordEncoder).matches("password123", "encodedPassword");
    }

    // Password reset tests
    @Test
    @DisplayName("Gửi mã đặt lại mật khẩu thành công (sync)")
    void sendPasswordResetCode_Success() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("nguyenvana@example.com");

        when(userRepository.findByEmail("nguyenvana@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordResetService.generateVerificationCode("nguyenvana@example.com")).thenReturn("123456");
        doNothing().when(emailService).sendPasswordResetCode("nguyenvana@example.com", "123456");

        ApiResponse<String> response = userService.sendPasswordResetCode(request);

        assertTrue(response.isSuccess());
        assertEquals("Verification code has been sent to your email", response.getMessage());
        assertEquals("reset_code_sent", response.getData());

        verify(userRepository).findByEmail("nguyenvana@example.com");
        verify(passwordResetService).generateVerificationCode("nguyenvana@example.com");
        verify(emailService).sendPasswordResetCode("nguyenvana@example.com", "123456");
    }

    @Test
    @DisplayName("Gửi mã đặt lại mật khẩu thành công (async)")
    void sendPasswordResetCodeAsync_Success() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("nguyenvana@example.com");

        when(userRepository.findByEmail("nguyenvana@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordResetService.generateVerificationCode("nguyenvana@example.com")).thenReturn("123456");
        doNothing().when(emailService).sendPasswordResetCodeAsync("nguyenvana@example.com", "123456");

        ApiResponse<String> response = userService.sendPasswordResetCodeAsync(request);

        assertTrue(response.isSuccess());
        assertEquals("Verification code has been sent to your email", response.getMessage());
        assertEquals("reset_code_sent", response.getData());

        verify(userRepository).findByEmail("nguyenvana@example.com");
        verify(passwordResetService).generateVerificationCode("nguyenvana@example.com");
        verify(emailService).sendPasswordResetCodeAsync("nguyenvana@example.com", "123456");
    }

    @Test
    @DisplayName("Gửi mã đặt lại mật khẩu thất bại - email không tồn tại")
    void sendPasswordResetCodeAsync_EmailNotFound_ShouldFail() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("nonexistent@example.com");

        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        ApiResponse<String> response = userService.sendPasswordResetCodeAsync(request);

        assertFalse(response.isSuccess());
        assertEquals("No account found with this email", response.getMessage());

        verify(userRepository).findByEmail("nonexistent@example.com");
        verifyNoInteractions(passwordResetService);
        verifyNoInteractions(emailService);
    }

    @Test
    @DisplayName("Đặt lại mật khẩu thành công")
    void resetPassword_Success() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("nguyenvana@example.com");
        request.setCode("123456");
        request.setNewPassword("newpassword123");

        when(userRepository.findByEmail("nguyenvana@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordResetService.verifyCode("nguyenvana@example.com", "123456")).thenReturn(true);
        when(passwordEncoder.encode("newpassword123")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(UserDtls.class))).thenReturn(sampleUser);
        doNothing().when(passwordResetService).removeCode("nguyenvana@example.com");

        ApiResponse<String> response = userService.resetPassword(request);

        assertTrue(response.isSuccess());
        assertEquals("Password has been reset successfully", response.getMessage());
        assertEquals("password_reset", response.getData());

        verify(passwordResetService).verifyCode("nguyenvana@example.com", "123456");
        verify(passwordEncoder).encode("newpassword123");
        verify(passwordResetService).removeCode("nguyenvana@example.com");

        ArgumentCaptor<UserDtls> userCaptor = ArgumentCaptor.forClass(UserDtls.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("newEncodedPassword", userCaptor.getValue().getPassword());
    }

    @Test
    @DisplayName("Đặt lại mật khẩu thất bại - mã xác thực không đúng")
    void resetPassword_InvalidCode_ShouldFail() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("nguyenvana@example.com");
        request.setCode("wrong_code");
        request.setNewPassword("newpassword123");

        when(userRepository.findByEmail("nguyenvana@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordResetService.verifyCode("nguyenvana@example.com", "wrong_code")).thenReturn(false);

        ApiResponse<String> response = userService.resetPassword(request);

        assertFalse(response.isSuccess());
        assertEquals("Invalid or expired verification code", response.getMessage());

        verify(passwordResetService).verifyCode("nguyenvana@example.com", "wrong_code");
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    // User management tests
    @Test
    @DisplayName("Cập nhật role và trạng thái người dùng thành công")
    void updateUserRoleAndStatus_Success() {
        UserUpdateRequest request = new UserUpdateRequest();
        request.setRole("STAFF");
        request.setIsActive(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(roleService.isValidRole("STAFF")).thenReturn(true);
        when(roleRepository.findByRoleName("STAFF")).thenReturn(Optional.of(staffRole));
        when(userRepository.save(any(UserDtls.class))).thenReturn(sampleUser);

        ApiResponse<UserResponse> response = userService.updateUserInfomation(1L, request);

        assertTrue(response.isSuccess());
        assertEquals("User update successful", response.getMessage());
        assertNotNull(response.getData());

        verify(userRepository).findById(1L);
        verify(roleService).isValidRole("STAFF");
        verify(roleRepository).findByRoleName("STAFF");

        ArgumentCaptor<UserDtls> userCaptor = ArgumentCaptor.forClass(UserDtls.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals(staffRole, userCaptor.getValue().getRole());
    }

    @Test
    @DisplayName("Cập nhật role thất bại - role không hợp lệ")
    void updateUserRoleAndStatus_InvalidRole_ShouldFail() {
        UserUpdateRequest request = new UserUpdateRequest();
        request.setRole("INVALID_ROLE");
        request.setIsActive(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(roleService.isValidRole("INVALID_ROLE")).thenReturn(false);

        ApiResponse<UserResponse> response = userService.updateUserInfomation(1L, request);
        assertFalse(response.isSuccess());
        assertEquals("Invalid role. Role must be CUSTOMER, CONSULTANT, STAFF or ADMIN", response.getMessage());

        verify(roleService).isValidRole("INVALID_ROLE");
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Cập nhật role từ CONSULTANT sang USER - xóa profile consultant")
    void updateUserRoleAndStatus_FromConsultantToUser_ShouldDeleteProfile() {
        // Setup user as consultant
        sampleUser.setRole(consultantRole);
        ConsultantProfile profile = new ConsultantProfile();
        profile.setUser(sampleUser);

        UserUpdateRequest request = new UserUpdateRequest();
        request.setRole("USER");
        request.setIsActive(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(roleService.isValidRole("USER")).thenReturn(true);
        when(roleRepository.findByRoleName("USER")).thenReturn(Optional.of(userRole));
        when(consultantProfileRepository.findByUser(sampleUser)).thenReturn(Optional.of(profile));
        when(userRepository.save(any(UserDtls.class))).thenReturn(sampleUser);

        ApiResponse<UserResponse> response = userService.updateUserInfomation(1L, request);

        assertTrue(response.isSuccess());

        verify(consultantProfileRepository).findByUser(sampleUser);
        verify(consultantProfileRepository).delete(profile);
    }

    @Test
    @DisplayName("Cập nhật role từ USER sang CONSULTANT - tạo profile consultant")
    void updateUserRoleAndStatus_FromUserToConsultant_ShouldCreateProfile() {
        UserUpdateRequest request = new UserUpdateRequest();
        request.setRole("CONSULTANT");
        request.setIsActive(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(roleService.isValidRole("CONSULTANT")).thenReturn(true);
        when(roleRepository.findByRoleName("CONSULTANT")).thenReturn(Optional.of(consultantRole));
        when(userRepository.save(any(UserDtls.class))).thenReturn(sampleUser);
        when(consultantProfileRepository.save(any(ConsultantProfile.class))).thenReturn(new ConsultantProfile());

        ApiResponse<UserResponse> response = userService.updateUserInfomation(1L, request);

        assertTrue(response.isSuccess());

        ArgumentCaptor<ConsultantProfile> profileCaptor = ArgumentCaptor.forClass(ConsultantProfile.class);
        verify(consultantProfileRepository).save(profileCaptor.capture());

        ConsultantProfile savedProfile = profileCaptor.getValue();
        assertEquals(sampleUser, savedProfile.getUser());
        assertEquals("Not updated yet", savedProfile.getQualifications());
        assertEquals("0 years experience", savedProfile.getExperience());
        assertEquals("No details updated yet", savedProfile.getBio());
    }

    @Test
    @DisplayName("Lấy danh sách tất cả người dùng thành công")
    void getAllUsers_Success() {
        UserDtls staffUser = new UserDtls();
        staffUser.setId(2L);
        staffUser.setUsername("staff");
        staffUser.setFullName("Staff User");
        staffUser.setRole(staffRole);

        List<UserDtls> users = Arrays.asList(sampleUser, staffUser);

        when(userRepository.findAll()).thenReturn(users);

        ApiResponse<List<UserResponse>> response = userService.getAllUsers();
        assertTrue(response.isSuccess());
        assertEquals("Get list of users successfully", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(2, response.getData().size());
        assertEquals("CUSTOMER", response.getData().get(0).getRole());
        assertEquals("STAFF", response.getData().get(1).getRole());

        verify(userRepository).findAll();
    }

    @Test
    @DisplayName("Lấy thông tin người dùng theo ID thành công")
    void getUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        ApiResponse<UserResponse> response = userService.getUserById(1L);
        assertTrue(response.isSuccess());
        assertEquals("Get user information successfully", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(1L, response.getData().getId());
        assertEquals("CUSTOMER", response.getData().getRole());

        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("Lấy thông tin người dùng theo ID thất bại - không tìm thấy")
    void getUserById_NotFound_ShouldFail() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<UserResponse> response = userService.getUserById(999L);

        assertFalse(response.isSuccess());
        assertEquals("User not found", response.getMessage());

        verify(userRepository).findById(999L);
    }

    @Test
    @DisplayName("Lấy người dùng theo role thành công")
    void getUsersByRole_Success() {
        List<UserDtls> staffUsers = Arrays.asList(sampleUser);

        when(roleService.isValidRole("STAFF")).thenReturn(true);
        when(userRepository.findByRoleName("STAFF")).thenReturn(staffUsers);

        ApiResponse<List<UserResponse>> response = userService.getUsersByRole("STAFF");

        assertTrue(response.isSuccess());
        assertTrue(response.getMessage().contains("Found 1 user(s) with role STAFF"));
        assertEquals(1, response.getData().size());

        verify(roleService).isValidRole("STAFF");
        verify(userRepository).findByRoleName("STAFF");
    }

    @Test
    @DisplayName("Lấy người dùng theo role thất bại - role không hợp lệ")
    void getUsersByRole_InvalidRole_ShouldFail() {
        when(roleService.isValidRole("INVALID")).thenReturn(false);

        ApiResponse<List<UserResponse>> response = userService.getUsersByRole("INVALID");
        assertFalse(response.isSuccess());
        assertEquals("Invalid role. Valid roles are: CUSTOMER, CONSULTANT, STAFF, ADMIN", response.getMessage());

        verify(roleService).isValidRole("INVALID");
        verifyNoInteractions(userRepository);
    }

    @Test
    @DisplayName("Lấy danh sách role có sẵn thành công")
    void getAvailableRoles_Success() {
        List<Role> roles = Arrays.asList(userRole, consultantRole, staffRole, adminRole);

        when(roleRepository.findAll()).thenReturn(roles);

        ApiResponse<List<String>> response = userService.getAvailableRoles();
        assertTrue(response.isSuccess());
        assertEquals("Available roles retrieved successfully", response.getMessage());
        assertEquals(4, response.getData().size());
        assertTrue(response.getData().contains("CUSTOMER"));
        assertTrue(response.getData().contains("CONSULTANT"));
        assertTrue(response.getData().contains("STAFF"));
        assertTrue(response.getData().contains("ADMIN"));

        verify(roleRepository).findAll();
    }

    @Test
    @DisplayName("Đếm số người dùng theo role thành công")
    void getUserCountByRole_Success() {
        List<Role> roles = Arrays.asList(userRole, consultantRole, staffRole, adminRole);

        when(roleRepository.findAll()).thenReturn(roles);
        when(userRepository.countByRole(userRole)).thenReturn(10L);
        when(userRepository.countByRole(consultantRole)).thenReturn(5L);
        when(userRepository.countByRole(staffRole)).thenReturn(3L);
        when(userRepository.countByRole(adminRole)).thenReturn(1L);
        when(userRepository.count()).thenReturn(19L);

        ApiResponse<Map<String, Long>> response = userService.getUserCountByRole();
        assertTrue(response.isSuccess());
        assertEquals("User count by role retrieved successfully", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(10L, response.getData().get("CUSTOMER"));
        assertEquals(5L, response.getData().get("CONSULTANT"));
        assertEquals(3L, response.getData().get("STAFF"));
        assertEquals(1L, response.getData().get("ADMIN"));
        assertEquals(19L, response.getData().get("TOTAL"));

        verify(roleRepository).findAll();
        verify(userRepository).count();
    }

    // Profile update tests
    @Test
    @DisplayName("Cập nhật thông tin cơ bản thành công")
    void updateBasicProfile_Success() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFullName("Updated Name");
        request.setPhone("0987654321");
        request.setBirthDay(LocalDate.of(1991, 2, 20));
        request.setGender(Gender.FEMALE);

        UserDtls updatedUser = new UserDtls();
        updatedUser.setId(1L);
        updatedUser.setFullName("Updated Name");
        updatedUser.setPhone("0987654321");
        updatedUser.setBirthDay(LocalDate.of(1991, 2, 20));
        updatedUser.setGender(Gender.FEMALE);
        updatedUser.setRole(userRole);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(UserDtls.class))).thenReturn(updatedUser);

        ApiResponse<UserResponse> response = userService.updateBasicProfile(1L, request);

        assertTrue(response.isSuccess());
        assertEquals("Basic profile updated successfully", response.getMessage());
        assertNotNull(response.getData());
        assertEquals("Updated Name", response.getData().getFullName());
        assertEquals("0987654321", response.getData().getPhone());

        verify(userRepository).findById(1L);
        ArgumentCaptor<UserDtls> userCaptor = ArgumentCaptor.forClass(UserDtls.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("Updated Name", userCaptor.getValue().getFullName());
    }

    @Test
    @DisplayName("Cập nhật thông tin cơ bản thất bại - user không tồn tại")
    void updateBasicProfile_UserNotFound_ShouldFail() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFullName("Updated Name");

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<UserResponse> response = userService.updateBasicProfile(999L, request);

        assertFalse(response.isSuccess());
        assertEquals("User not found", response.getMessage());

        verify(userRepository).findById(999L);
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    // Email update tests
    @Test
    @DisplayName("Gửi mã xác thực cho email mới thành công")
    void sendEmailVerificationForUpdate_Success() throws Exception {
        VerificationCodeRequest request = new VerificationCodeRequest();
        request.setEmail("newemail@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.existsByEmail("newemail@example.com")).thenReturn(false);
        when(emailVerificationService.generateVerificationCode("newemail@example.com")).thenReturn("123456");
        doNothing().when(emailService).sendEmailUpdateVerificationAsync("newemail@example.com", "123456",
                "Nguyen Van A");

        ApiResponse<String> response = userService.sendEmailVerificationForUpdate(1L, request);

        assertTrue(response.isSuccess());
        assertEquals("Verification code has been sent to your new email address", response.getMessage());
        assertEquals("newemail@example.com", response.getData());

        verify(emailVerificationService).generateVerificationCode("newemail@example.com");
        verify(emailService).sendEmailUpdateVerificationAsync("newemail@example.com", "123456", "Nguyen Van A");
    }

    @Test
    @DisplayName("Gửi mã xác thực thất bại - email mới trùng với email hiện tại")
    void sendEmailVerificationForUpdate_SameEmail_ShouldFail() {
        VerificationCodeRequest request = new VerificationCodeRequest();
        request.setEmail("nguyenvana@example.com"); // Same as current email

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        ApiResponse<String> response = userService.sendEmailVerificationForUpdate(1L, request);

        assertFalse(response.isSuccess());
        assertEquals("New email cannot be the same as current email", response.getMessage());

        verify(userRepository).findById(1L);
        verifyNoInteractions(emailVerificationService);
    }

    @Test
    @DisplayName("Gửi mã xác thực thất bại - email đã tồn tại")
    void sendEmailVerificationForUpdate_EmailExists_ShouldFail() throws Exception {
        VerificationCodeRequest request = new VerificationCodeRequest();
        request.setEmail("existing@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        ApiResponse<String> response = userService.sendEmailVerificationForUpdate(1L, request);

        assertFalse(response.isSuccess());
        assertEquals("Email already exists", response.getMessage());

        verify(userRepository).existsByEmail("existing@example.com");
        verifyNoInteractions(emailVerificationService);
    }

    @Test
    @DisplayName("Cập nhật email mới thành công")
    void updateEmail_Success() throws Exception {
        UpdateEmailRequest request = new UpdateEmailRequest();
        request.setNewEmail("newemail@example.com");
        request.setVerificationCode("123456");

        UserDtls updatedUser = new UserDtls();
        updatedUser.setId(1L);
        updatedUser.setEmail("newemail@example.com");
        updatedUser.setFullName("Nguyen Van A");
        updatedUser.setRole(userRole);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.existsByEmail("newemail@example.com")).thenReturn(false);
        when(emailVerificationService.verifyCode("newemail@example.com", "123456")).thenReturn(true);
        when(userRepository.save(any(UserDtls.class))).thenReturn(updatedUser);
        doNothing().when(emailService).sendEmailChangeNotificationAsync(anyString(), anyString(), anyString());
        doNothing().when(emailService).sendEmailChangeConfirmationAsync(anyString(), anyString());

        ApiResponse<UserResponse> response = userService.updateEmail(1L, request);

        assertTrue(response.isSuccess());
        assertEquals("Email updated successfully", response.getMessage());
        assertEquals("newemail@example.com", response.getData().getEmail());

        verify(emailVerificationService).verifyCode("newemail@example.com", "123456");
        verify(emailService).sendEmailChangeNotificationAsync("nguyenvana@example.com", "newemail@example.com",
                "Nguyen Van A");
        verify(emailService).sendEmailChangeConfirmationAsync("newemail@example.com", "Nguyen Van A");
    }

    @Test
    @DisplayName("Cập nhật email thất bại - mã xác thực không đúng")
    void updateEmail_InvalidCode_ShouldFail() {
        UpdateEmailRequest request = new UpdateEmailRequest();
        request.setNewEmail("newemail@example.com");
        request.setVerificationCode("wrong_code");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.existsByEmail("newemail@example.com")).thenReturn(false);
        when(emailVerificationService.verifyCode("newemail@example.com", "wrong_code")).thenReturn(false);

        ApiResponse<UserResponse> response = userService.updateEmail(1L, request);

        assertFalse(response.isSuccess());
        assertEquals("Invalid or expired verification code", response.getMessage());

        verify(emailVerificationService).verifyCode("newemail@example.com", "wrong_code");
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    // Password change tests
    @Test
    @DisplayName("Đổi mật khẩu thành công")
    void changePassword_Success() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldpassword");
        request.setNewPassword("newpassword123");
        request.setConfirmPassword("newpassword123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("oldpassword", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.matches("newpassword123", "encodedPassword")).thenReturn(false);
        when(passwordEncoder.encode("newpassword123")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(UserDtls.class))).thenReturn(sampleUser);
        doNothing().when(emailService).sendPasswordChangeNotificationAsync(anyString(), anyString());

        ApiResponse<String> response = userService.changePassword(1L, request);

        assertTrue(response.isSuccess());
        assertEquals("Password changed successfully", response.getMessage());

        verify(passwordEncoder).matches("oldpassword", "encodedPassword");
        verify(passwordEncoder).encode("newpassword123");
        verify(emailService).sendPasswordChangeNotificationAsync("nguyenvana@example.com", "Nguyen Van A");
    }

    @Test
    @DisplayName("Đổi mật khẩu thất bại - mật khẩu hiện tại sai")
    void changePassword_WrongCurrentPassword_ShouldFail() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("wrongpassword");
        request.setNewPassword("newpassword123");
        request.setConfirmPassword("newpassword123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        ApiResponse<String> response = userService.changePassword(1L, request);

        assertFalse(response.isSuccess());
        assertEquals("Current password is incorrect", response.getMessage());

        verify(passwordEncoder).matches("wrongpassword", "encodedPassword");
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Đổi mật khẩu thất bại - mật khẩu xác nhận không khớp")
    void changePassword_ConfirmPasswordMismatch_ShouldFail() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldpassword");
        request.setNewPassword("newpassword123");
        request.setConfirmPassword("differentpassword");

        // Mock user tồn tại và current password đúng
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("oldpassword", "encodedPassword")).thenReturn(true);

        ApiResponse<String> response = userService.changePassword(1L, request);

        assertFalse(response.isSuccess());
        assertEquals("New password and confirm password do not match", response.getMessage());

        verify(userRepository).findById(1L);
        verify(passwordEncoder).matches("oldpassword", "encodedPassword");
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Đổi mật khẩu thất bại - mật khẩu mới giống mật khẩu cũ")
    void changePassword_SamePassword_ShouldFail() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldpassword");
        request.setNewPassword("oldpassword");
        request.setConfirmPassword("oldpassword");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("oldpassword", "encodedPassword")).thenReturn(true);

        ApiResponse<String> response = userService.changePassword(1L, request);

        assertFalse(response.isSuccess());
        assertEquals("New password must be different from current password", response.getMessage());

        verify(userRepository).findById(1L);
        // Verify cả 2 lần gọi với cùng parameters
        verify(passwordEncoder, times(2)).matches("oldpassword", "encodedPassword");

        verify(userRepository, never()).save(any(UserDtls.class));
    }

    // Avatar update tests
    @Test
    @DisplayName("Cập nhật avatar thành công")
    void updateUserAvatar_Success() throws Exception {
        MultipartFile file = new MockMultipartFile("avatar", "avatar.jpg", "image/jpeg", "test image".getBytes());

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(fileStorageService.saveAvatarFile(file, 1L)).thenReturn("/img/avatar/new_avatar.jpg");
        when(userRepository.save(any(UserDtls.class))).thenReturn(sampleUser);

        ApiResponse<String> response = userService.updateUserAvatar(1L, file);

        assertTrue(response.isSuccess());
        assertEquals("Avatar updated successfully", response.getMessage());
        assertEquals("/img/avatar/new_avatar.jpg", response.getData());

        verify(fileStorageService).saveAvatarFile(file, 1L);
        ArgumentCaptor<UserDtls> userCaptor = ArgumentCaptor.forClass(UserDtls.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("/img/avatar/new_avatar.jpg", userCaptor.getValue().getAvatar());
    }

    @Test
    @DisplayName("Cập nhật avatar thất bại - file trống")
    void updateUserAvatar_EmptyFile_ShouldFail() {
        MultipartFile file = new MockMultipartFile("avatar", "", "image/jpeg", new byte[0]);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        ApiResponse<String> response = userService.updateUserAvatar(1L, file);

        assertFalse(response.isSuccess());
        assertEquals("Please select a file", response.getMessage());

        verify(userRepository).findById(1L);
        verifyNoInteractions(fileStorageService);
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Cập nhật avatar thất bại - không phải file ảnh")
    void updateUserAvatar_InvalidFileType_ShouldFail() {
        MultipartFile file = new MockMultipartFile("avatar", "document.txt", "text/plain", "content".getBytes());

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        ApiResponse<String> response = userService.updateUserAvatar(1L, file);

        assertFalse(response.isSuccess());
        assertEquals("Only image files are allowed", response.getMessage());

        verifyNoInteractions(fileStorageService);
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Cập nhật avatar thất bại - file quá lớn")
    void updateUserAvatar_FileTooLarge_ShouldFail() {
        // Create a file larger than 5MB
        byte[] largeContent = new byte[6 * 1024 * 1024]; // 6MB
        MultipartFile file = new MockMultipartFile("avatar", "large.jpg", "image/jpeg", largeContent);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        ApiResponse<String> response = userService.updateUserAvatar(1L, file);

        assertFalse(response.isSuccess());
        assertEquals("File size must be less than 5MB", response.getMessage());

        verifyNoInteractions(fileStorageService);
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Cập nhật avatar thất bại - file null")
    void updateUserAvatar_NullFile_ShouldFail() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        ApiResponse<String> response = userService.updateUserAvatar(1L, null);

        assertFalse(response.isSuccess());
        assertEquals("Please select a file", response.getMessage());

        verify(userRepository).findById(1L);
        verifyNoInteractions(fileStorageService);
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Cập nhật avatar thất bại - user không tồn tại")
    void updateUserAvatar_UserNotFound_ShouldFail() {
        MultipartFile file = new MockMultipartFile("avatar", "avatar.jpg", "image/jpeg", "test".getBytes());

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<String> response = userService.updateUserAvatar(999L, file);

        assertFalse(response.isSuccess());
        assertEquals("User not found", response.getMessage());

        verify(userRepository).findById(999L);
        verifyNoInteractions(fileStorageService);
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    @Test
    @DisplayName("Cập nhật avatar thất bại - lỗi lưu file")
    void updateUserAvatar_FileStorageError_ShouldFail() throws Exception {
        MultipartFile file = new MockMultipartFile("avatar", "avatar.jpg", "image/jpeg", "test".getBytes());

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(fileStorageService.saveAvatarFile(file, 1L)).thenThrow(new IOException("Failed to save file"));

        ApiResponse<String> response = userService.updateUserAvatar(1L, file);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Failed to save avatar file"));

        verify(fileStorageService).saveAvatarFile(file, 1L);
        verify(userRepository, never()).save(any(UserDtls.class));
    }

    // Utility tests
    @Test
    @DisplayName("Lấy ID người dùng từ username thành công")
    void getUserIdFromUsername_Success() {
        when(userRepository.findByUsername("nguyenvana")).thenReturn(Optional.of(sampleUser));

        Long userId = userService.getUserIdFromUsername("nguyenvana");

        assertNotNull(userId);
        assertEquals(1L, userId);

        verify(userRepository).findByUsername("nguyenvana");
    }

    @Test
    @DisplayName("Lấy ID người dùng từ username không tồn tại")
    void getUserIdFromUsername_NotFound_ShouldReturnNull() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        Long userId = userService.getUserIdFromUsername("nonexistent");

        assertNull(userId);

        verify(userRepository).findByUsername("nonexistent");
    }

    @Test
    @DisplayName("Tìm người dùng theo email thành công")
    void findByEmail_Success() {
        when(userRepository.findByEmail("nguyenvana@example.com")).thenReturn(Optional.of(sampleUser));

        UserDtls user = userService.findByEmail("nguyenvana@example.com");

        assertNotNull(user);
        assertEquals("nguyenvana@example.com", user.getEmail());

        verify(userRepository).findByEmail("nguyenvana@example.com");
    }

    @Test
    @DisplayName("Tìm người dùng theo email không tồn tại")
    void findByEmail_NotFound_ShouldReturnNull() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        UserDtls user = userService.findByEmail("nonexistent@example.com");

        assertNull(user);

        verify(userRepository).findByEmail("nonexistent@example.com");
    }

    // Additional helper method to create UserDtls for testing
    private UserDtls createTestUser(String username, String email, Role role) {
        UserDtls user = new UserDtls();
        user.setUsername(username);
        user.setEmail(email);
        user.setRole(role);
        user.setIsActive(true);
        user.setGender(Gender.OTHER);
        user.setCreatedDate(LocalDateTime.now());
        return user;
    }

    // Additional helper method for UserResponse mapping
    private UserResponse createUserResponse(UserDtls user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setBirthDay(user.getBirthDay());
        response.setAvatar(user.getAvatar());
        response.setIsActive(user.getIsActive());
        response.setGender(user.getGender());
        response.setRole(user.getRole() != null ? user.getRole().getRoleName() : null);
        response.setCreatedDate(user.getCreatedDate());
        return response;
    }
}