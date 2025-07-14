package com.healapp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.DeleteAccountRequest;
import com.healapp.dto.ForgotPasswordRequest;
import com.healapp.dto.LoginRequest;
import com.healapp.dto.LoginResponse;
import com.healapp.dto.RegisterRequest;
import com.healapp.dto.UserResponse;
import com.healapp.dto.VerificationCodeRequest;
import com.healapp.model.AuthProvider;
import com.healapp.model.Gender;
import com.healapp.model.Role;
import com.healapp.model.UserDtls;
import com.healapp.repository.ConsultantProfileRepository;
import com.healapp.repository.NotificationPreferenceRepository;
import com.healapp.repository.RoleRepository;
import com.healapp.repository.UserRepository;

/**
 * Comprehensive Unit Tests for UserService
 * 
 * Test Coverage:
 * - User Registration & Verification
 * - User Authentication (Login/Logout)
 * - Password Management (Reset, Change)
 * - Profile Management (Update, Avatar)
 * - Email & Phone Verification/Update
 * - Account Deletion (Soft Delete with Suffix Logic)
 * - Admin Account Management
 * - User Queries & Validation
 * - Phone Number Utilities
 * - OAuth Integration
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
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

    @Mock
    private NotificationPreferenceRepository notificationPreferenceRepo;

    @Mock
    private PhoneVerificationService phoneVerificationService;

    @InjectMocks
    private UserService userService;

    private UserDtls testUser;
    private Role customerRole;
    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        // Setup test data
        customerRole = new Role();
        customerRole.setRoleId(1L);
        customerRole.setRoleName("CUSTOMER");

        testUser = new UserDtls();
        testUser.setId(1L);
        testUser.setFullName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");
        testUser.setPassword("encodedPassword");
        testUser.setPhone("1234567890");
        testUser.setBirthDay(LocalDate.of(1990, 1, 1));
        testUser.setGender(Gender.MALE);
        testUser.setIsActive(true);
        testUser.setIsDeleted(false);
        testUser.setRole(customerRole);
        testUser.setProvider(AuthProvider.LOCAL);
        testUser.setCreatedDate(LocalDateTime.now());

        registerRequest = new RegisterRequest();
        registerRequest.setFullName("Test User");
        registerRequest.setEmail("test@example.com");
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("password123");
        registerRequest.setPhone("1234567890");
        registerRequest.setBirthDay(LocalDate.of(1990, 1, 1));
        registerRequest.setGender("Nam");
        registerRequest.setAddress("Test Address");
        registerRequest.setVerificationCode("123456");
    }

    @Nested
    @DisplayName("User Existence Checks")
    class UserExistenceTests {

        @Test
        @DisplayName("Should return true when email exists and is active")
        void testIsEmailExists_WhenEmailExistsAndActive_ShouldReturnTrue() {
            // Given
            String email = "test@example.com";
            when(userRepository.existsByEmailAndIsActiveTrueAndIsDeletedFalse(email)).thenReturn(true);

            // When
            boolean result = userService.isEmailExists(email);

            // Then
            assertTrue(result);
            verify(userRepository).existsByEmailAndIsActiveTrueAndIsDeletedFalse(email);
        }

        @Test
        @DisplayName("Should return false when email does not exist")
        void testIsEmailExists_WhenEmailDoesNotExist_ShouldReturnFalse() {
            // Given
            String email = "nonexistent@example.com";
            when(userRepository.existsByEmailAndIsActiveTrueAndIsDeletedFalse(email)).thenReturn(false);

            // When
            boolean result = userService.isEmailExists(email);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should return true when username exists and is active")
        void testIsUsernameExists_WhenUsernameExistsAndActive_ShouldReturnTrue() {
            // Given
            String username = "testuser";
            when(userRepository.existsByUsernameAndIsActiveTrueAndIsDeletedFalse(username)).thenReturn(true);

            // When
            boolean result = userService.isUsernameExists(username);

            // Then
            assertTrue(result);
            verify(userRepository).existsByUsernameAndIsActiveTrueAndIsDeletedFalse(username);
        }

        @Test
        @DisplayName("Should return false when username does not exist")
        void testIsUsernameExists_WhenUsernameDoesNotExist_ShouldReturnFalse() {
            // Given
            String username = "nonexistentuser";
            when(userRepository.existsByUsernameAndIsActiveTrueAndIsDeletedFalse(username)).thenReturn(false);

            // When
            boolean result = userService.isUsernameExists(username);

            // Then
            assertFalse(result);
        }
    }

    @Nested
    @DisplayName("Email Verification")
    class EmailVerificationTests {

        @Test
        @DisplayName("Should send verification code successfully when email is new")
        void testSendEmailVerificationCode_WhenEmailIsNew_ShouldSucceed() throws Exception {
            // Given
            VerificationCodeRequest request = new VerificationCodeRequest();
            request.setEmail("new@example.com");
            
            when(userRepository.existsByEmailAndIsActiveTrueAndIsDeletedFalse(anyString())).thenReturn(false);
            when(emailVerificationService.generateVerificationCode(anyString())).thenReturn("123456");
            doNothing().when(emailService).sendEmailVerificationCodeAsync(anyString(), anyString());

            // When
            ApiResponse<String> result = userService.sendEmailVerificationCode(request);

            // Then
            assertTrue(result.isSuccess());
            assertEquals("A verification code has been sent to your email.", result.getMessage());
            verify(emailService).sendEmailVerificationCodeAsync("new@example.com", "123456");
        }

        @Test
        @DisplayName("Should fail when email already exists")
        void testSendEmailVerificationCode_WhenEmailExists_ShouldFail() {
            // Given
            VerificationCodeRequest request = new VerificationCodeRequest();
            request.setEmail("existing@example.com");
            
            when(userRepository.existsByEmailAndIsActiveTrueAndIsDeletedFalse(anyString())).thenReturn(true);

            // When
            ApiResponse<String> result = userService.sendEmailVerificationCode(request);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("Email has been registered", result.getMessage());
        }
    }

    @Nested
    @DisplayName("User Registration")
    class UserRegistrationTests {

        @Test
        @DisplayName("Should register user successfully with valid data")
        void testRegisterUser_WithValidData_ShouldSucceed() {
            // Given
            when(emailVerificationService.verifyCode(anyString(), anyString())).thenReturn(true);
            when(userRepository.existsByUsernameAndIsActiveTrueAndIsDeletedFalse(anyString())).thenReturn(false);
            when(userRepository.existsByEmailAndIsActiveTrueAndIsDeletedFalse(anyString())).thenReturn(false);
            when(roleService.getDefaultUserRole()).thenReturn(customerRole);
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(userRepository.save(any(UserDtls.class))).thenReturn(testUser);
            when(fileStorageService.buildAvatarUrl(anyString())).thenReturn("avatar-url");

            // When
            ApiResponse<UserResponse> result = userService.registerUser(registerRequest, null);

            // Then
            assertTrue(result.isSuccess());
            assertEquals("Đăng ký thành công", result.getMessage());
            assertNotNull(result.getData());
            
            // Verify user was saved with correct data
            ArgumentCaptor<UserDtls> userCaptor = ArgumentCaptor.forClass(UserDtls.class);
            verify(userRepository).save(userCaptor.capture());
            UserDtls savedUser = userCaptor.getValue();
            assertEquals("Test User", savedUser.getFullName());
            assertEquals("test@example.com", savedUser.getEmail());
            assertEquals("testuser", savedUser.getUsername());
            assertTrue(savedUser.getIsActive());
            assertFalse(savedUser.getIsDeleted());
        }

        @Test
        @DisplayName("Should fail registration when verification code is invalid")
        void testRegisterUser_WithInvalidVerificationCode_ShouldFail() {
            // Given
            when(emailVerificationService.verifyCode(anyString(), anyString())).thenReturn(false);

            // When
            ApiResponse<UserResponse> result = userService.registerUser(registerRequest, null);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("Mã xác thực không đúng hoặc đã hết hạn", result.getMessage());
        }

        @Test
        @DisplayName("Should fail registration when username already exists")
        void testRegisterUser_WithExistingUsername_ShouldFail() {
            // Given
            when(emailVerificationService.verifyCode(anyString(), anyString())).thenReturn(true);
            when(userRepository.existsByUsernameAndIsActiveTrueAndIsDeletedFalse(anyString())).thenReturn(true);

            // When
            ApiResponse<UserResponse> result = userService.registerUser(registerRequest, null);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("Username đã tồn tại", result.getMessage());
        }
    }

    @Nested
    @DisplayName("User Authentication")
    class UserAuthenticationTests {

        @Test
        @DisplayName("Should login successfully with valid email and password")
        void testLogin_WithValidEmailAndPassword_ShouldSucceed() {
            // Given
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername("test@example.com");
            loginRequest.setPassword("password123");

            when(userRepository.findByEmailAndIsActiveTrueAndIsDeletedFalse(anyString()))
                    .thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

            // When
            ApiResponse<LoginResponse> result = userService.login(loginRequest);

            // Then
            assertTrue(result.isSuccess());
            assertEquals("Login successful", result.getMessage());
            assertNotNull(result.getData());
            assertEquals(testUser.getId(), result.getData().getUserId());
            assertEquals(testUser.getEmail(), result.getData().getEmail());
        }

        @Test
        @DisplayName("Should login successfully with valid username and password")
        void testLogin_WithValidUsernameAndPassword_ShouldSucceed() {
            // Given
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername("testuser");
            loginRequest.setPassword("password123");

            when(userRepository.findByUsernameAndIsActiveTrueAndIsDeletedFalse(anyString()))
                    .thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

            // When
            ApiResponse<LoginResponse> result = userService.login(loginRequest);

            // Then
            assertTrue(result.isSuccess());
            assertEquals("Login successful", result.getMessage());
        }

        @Test
        @DisplayName("Should fail login with invalid password")
        void testLogin_WithInvalidPassword_ShouldFail() {
            // Given
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername("test@example.com");
            loginRequest.setPassword("wrongpassword");

            when(userRepository.findByEmailAndIsActiveTrueAndIsDeletedFalse(anyString()))
                    .thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

            // When
            ApiResponse<LoginResponse> result = userService.login(loginRequest);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("Invalid username/email or password", result.getMessage());
        }

        @Test
        @DisplayName("Should fail login when user does not exist")
        void testLogin_WithNonExistentUser_ShouldFail() {
            // Given
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername("nonexistent@example.com");
            loginRequest.setPassword("password123");

            when(userRepository.findByEmailAndIsActiveTrueAndIsDeletedFalse(anyString()))
                    .thenReturn(Optional.empty());

            // When
            ApiResponse<LoginResponse> result = userService.login(loginRequest);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("Invalid username/email or password", result.getMessage());
        }

        @Test
        @DisplayName("Should fail login when user is inactive")
        void testLogin_WithInactiveUser_ShouldFail() {
            // Given
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsername("test@example.com");
            loginRequest.setPassword("password123");

            testUser.setIsActive(false);

            when(userRepository.findByEmailAndIsActiveTrueAndIsDeletedFalse(anyString()))
                    .thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

            // When
            ApiResponse<LoginResponse> result = userService.login(loginRequest);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("Account is disabled", result.getMessage());
        }
    }

    @Nested
    @DisplayName("Password Reset")
    class PasswordResetTests {

        @Test
        @DisplayName("Should send password reset code successfully")
        void testSendPasswordResetCode_WithValidEmail_ShouldSucceed() throws Exception {
            // Given
            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmail("test@example.com");

            when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
            when(passwordResetService.generateVerificationCode(anyString())).thenReturn("123456");
            doNothing().when(emailService).sendPasswordResetCode(anyString(), anyString());

            // When
            ApiResponse<String> result = userService.sendPasswordResetCode(request);

            // Then
            assertTrue(result.isSuccess());
            assertEquals("Verification code has been sent to your email", result.getMessage());
        }

        @Test
        @DisplayName("Should fail when email does not exist for password reset")
        void testSendPasswordResetCode_WithNonExistentEmail_ShouldFail() {
            // Given
            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmail("nonexistent@example.com");

            when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

            // When
            ApiResponse<String> result = userService.sendPasswordResetCode(request);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("No account found with this email", result.getMessage());
        }
    }

    @Nested
    @DisplayName("Phone Number Management")
    class PhoneNumberTests {

        @Test
        @DisplayName("Should return clean phone number without _V suffix")
        void testGetCleanPhoneNumber_WithVerifiedSuffix_ShouldReturnClean() {
            // Given
            String phoneWithSuffix = "1234567890_V";

            // When
            String result = userService.getCleanPhoneNumber(phoneWithSuffix);

            // Then
            assertEquals("1234567890", result);
        }

        @Test
        @DisplayName("Should return clean phone number without _D suffix")
        void testGetCleanPhoneNumber_WithDeletedSuffix_ShouldReturnClean() {
            // Given
            String phoneWithSuffix = "1234567890_D12345";

            // When
            String result = userService.getCleanPhoneNumber(phoneWithSuffix);

            // Then
            assertEquals("1234567890", result);
        }

        @Test
        @DisplayName("Should return original phone number without suffix")
        void testGetCleanPhoneNumber_WithoutSuffix_ShouldReturnOriginal() {
            // Given
            String phone = "1234567890";

            // When
            String result = userService.getCleanPhoneNumber(phone);

            // Then
            assertEquals("1234567890", result);
        }

        @Test
        @DisplayName("Should return null for null phone number")
        void testGetCleanPhoneNumber_WithNull_ShouldReturnNull() {
            // When
            String result = userService.getCleanPhoneNumber(null);

            // Then
            assertNull(result);
        }

        @Test
        @DisplayName("Should detect verified phone number")
        void testIsPhoneVerified_WithVerifiedSuffix_ShouldReturnTrue() {
            // Given
            String verifiedPhone = "1234567890_V";

            // When
            boolean result = userService.isPhoneVerified(verifiedPhone);

            // Then
            assertTrue(result);
        }

        @Test
        @DisplayName("Should detect unverified phone number")
        void testIsPhoneVerified_WithoutSuffix_ShouldReturnFalse() {
            // Given
            String phone = "1234567890";

            // When
            boolean result = userService.isPhoneVerified(phone);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should check phone existence excluding deleted and inactive users")
        void testIsPhoneExists_ShouldExcludeDeletedAndInactive() {
            // Given
            String phone = "1234567890";
            UserDtls activeUser = new UserDtls();
            activeUser.setPhone("1234567890_V");
            activeUser.setIsActive(true);
            activeUser.setIsDeleted(false);

            UserDtls deletedUser = new UserDtls();
            deletedUser.setPhone("1234567890_D12345");
            deletedUser.setIsActive(false);
            deletedUser.setIsDeleted(true);

            when(userRepository.findAll()).thenReturn(Arrays.asList(activeUser, deletedUser));

            // When
            boolean result = userService.isPhoneExists(phone);

            // Then
            assertTrue(result); // Should find the active user
        }
    }

    @Nested
    @DisplayName("Account Deletion")
    class AccountDeletionTests {

        @Test
        @DisplayName("Should send delete verification code for valid customer")
        void testSendDeleteVerificationCode_WithValidCustomer_ShouldSucceed() throws Exception {
            // Given
            Long userId = 1L;
            String password = "password123";

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches(password, testUser.getPassword())).thenReturn(true);
            when(emailVerificationService.generateVerificationCode(anyString())).thenReturn("123456");
            doNothing().when(emailService).sendDeleteAccountVerificationCodeAsync(anyString(), anyString());

            // When
            ApiResponse<String> result = userService.sendDeleteVerificationCode(userId, password);

            // Then
            assertTrue(result.isSuccess());
            assertEquals("Mã xác thực đã được gửi đến email của bạn", result.getMessage());
        }

        @Test
        @DisplayName("Should fail delete verification for non-customer user")
        void testSendDeleteVerificationCode_WithNonCustomer_ShouldFail() {
            // Given
            Long userId = 1L;
            String password = "password123";
            Role adminRole = new Role();
            adminRole.setRoleName("ADMIN");
            testUser.setRole(adminRole);

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

            // When
            ApiResponse<String> result = userService.sendDeleteVerificationCode(userId, password);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("Chỉ tài khoản CUSTOMER mới được phép xóa.", result.getMessage());
        }

        @Test
        @DisplayName("Should soft delete account with suffix logic")
        void testDeleteAccount_WithValidRequest_ShouldSoftDeleteWithSuffix() {
            // Given
            Long userId = 1L;
            DeleteAccountRequest request = new DeleteAccountRequest();
            request.setPassword("password123");
            request.setVerificationCode("123456");

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
            when(emailVerificationService.verifyCode(anyString(), anyString())).thenReturn(true);
            when(userRepository.save(any(UserDtls.class))).thenReturn(testUser);

            // When
            ApiResponse<String> result = userService.deleteAccount(userId, request);

            // Then
            assertTrue(result.isSuccess());
            assertTrue(result.getMessage().contains("Tài khoản đã được xóa vĩnh viễn"));

            // Verify user was soft deleted with suffix
            ArgumentCaptor<UserDtls> userCaptor = ArgumentCaptor.forClass(UserDtls.class);
            verify(userRepository).save(userCaptor.capture());
            UserDtls deletedUser = userCaptor.getValue();
            
            assertTrue(deletedUser.getEmail().contains("_D"));
            assertTrue(deletedUser.getUsername().contains("_D"));
            assertTrue(deletedUser.getPhone().contains("_D"));
            assertEquals("Tài khoản đã xóa", deletedUser.getFullName());
            assertFalse(deletedUser.getIsActive());
            assertTrue(deletedUser.getIsDeleted());
            assertNotNull(deletedUser.getDeletedAt());
        }

        @Test
        @DisplayName("Should fail delete account with wrong password")
        void testDeleteAccount_WithWrongPassword_ShouldFail() {
            // Given
            Long userId = 1L;
            DeleteAccountRequest request = new DeleteAccountRequest();
            request.setPassword("wrongpassword");
            request.setVerificationCode("123456");

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

            // When
            ApiResponse<String> result = userService.deleteAccount(userId, request);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("Mật khẩu không đúng", result.getMessage());
        }

        @Test
        @DisplayName("Should fail delete account with invalid verification code")
        void testDeleteAccount_WithInvalidVerificationCode_ShouldFail() {
            // Given
            Long userId = 1L;
            DeleteAccountRequest request = new DeleteAccountRequest();
            request.setPassword("password123");
            request.setVerificationCode("wrong123");

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
            when(emailVerificationService.verifyCode(anyString(), anyString())).thenReturn(false);

            // When
            ApiResponse<String> result = userService.deleteAccount(userId, request);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("Mã xác thực không đúng hoặc đã hết hạn", result.getMessage());
        }
    }

    @Nested
    @DisplayName("Admin Account Management")
    class AdminAccountManagementTests {

        @Test
        @DisplayName("Should disable account by admin successfully")
        void testDisableAccountByAdmin_WithValidUser_ShouldSucceed() {
            // Given
            Long userId = 1L;
            String reason = "Policy violation";

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(UserDtls.class))).thenReturn(testUser);

            // When
            ApiResponse<String> result = userService.disableAccountByAdmin(userId, reason);

            // Then
            assertTrue(result.isSuccess());
            assertEquals("Tài khoản đã được vô hiệu hóa bởi admin", result.getMessage());

            ArgumentCaptor<UserDtls> userCaptor = ArgumentCaptor.forClass(UserDtls.class);
            verify(userRepository).save(userCaptor.capture());
            UserDtls disabledUser = userCaptor.getValue();
            assertFalse(disabledUser.getIsActive());
            // isDeleted should remain false for admin disable
            assertFalse(disabledUser.getIsDeleted());
        }

        @Test
        @DisplayName("Should restore account by admin successfully")
        void testRestoreAccountByAdmin_WithValidUser_ShouldSucceed() {
            // Given
            Long userId = 1L;
            testUser.setIsActive(false); // Previously disabled by admin
            testUser.setIsDeleted(false); // Not user-deleted

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(UserDtls.class))).thenReturn(testUser);

            // When
            ApiResponse<String> result = userService.restoreAccountByAdmin(userId);

            // Then
            assertTrue(result.isSuccess());
            assertEquals("Tài khoản đã được khôi phục thành công", result.getMessage());

            ArgumentCaptor<UserDtls> userCaptor = ArgumentCaptor.forClass(UserDtls.class);
            verify(userRepository).save(userCaptor.capture());
            UserDtls restoredUser = userCaptor.getValue();
            assertTrue(restoredUser.getIsActive());
        }

        @Test
        @DisplayName("Should fail to restore user-deleted account")
        void testRestoreAccountByAdmin_WithUserDeletedAccount_ShouldFail() {
            // Given
            Long userId = 1L;
            testUser.setIsActive(false);
            testUser.setIsDeleted(true); // User-deleted account

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

            // When
            ApiResponse<String> result = userService.restoreAccountByAdmin(userId);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("Không thể khôi phục tài khoản đã bị xóa bởi người dùng", result.getMessage());
        }
    }

    @Nested
    @DisplayName("User Queries")
    class UserQueriesTests {

        @Test
        @DisplayName("Should get all users successfully")
        void testGetAllUsers_ShouldReturnAllUsers() {
            // Given
            List<UserDtls> users = Arrays.asList(testUser);
            when(userRepository.findAll()).thenReturn(users);
            when(fileStorageService.buildAvatarUrl(anyString())).thenReturn("avatar-url");

            // When
            ApiResponse<List<UserResponse>> result = userService.getAllUsers();

            // Then
            assertTrue(result.isSuccess());
            assertEquals("Get list of users successfully", result.getMessage());
            assertEquals(1, result.getData().size());
        }

        @Test
        @DisplayName("Should get user by ID successfully")
        void testGetUserById_WithValidId_ShouldReturnUser() {
            // Given
            Long userId = 1L;
            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(fileStorageService.buildAvatarUrl(anyString())).thenReturn("avatar-url");

            // When
            ApiResponse<UserResponse> result = userService.getUserById(userId);

            // Then
            assertTrue(result.isSuccess());
            assertEquals("Get user information successfully", result.getMessage());
            assertNotNull(result.getData());
            assertEquals(testUser.getId(), result.getData().getId());
        }

        @Test
        @DisplayName("Should fail to get user with non-existent ID")
        void testGetUserById_WithNonExistentId_ShouldFail() {
            // Given
            Long userId = 999L;
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            // When
            ApiResponse<UserResponse> result = userService.getUserById(userId);

            // Then
            assertFalse(result.isSuccess());
            assertEquals("User not found", result.getMessage());
        }

        @Test
        @DisplayName("Should find active user by email")
        void testFindActiveUserByEmail_WithValidEmail_ShouldReturnUser() {
            // Given
            String email = "test@example.com";
            when(userRepository.findByEmailAndIsActiveTrueAndIsDeletedFalse(email))
                    .thenReturn(Optional.of(testUser));

            // When
            UserDtls result = userService.findActiveUserByEmail(email);

            // Then
            assertNotNull(result);
            assertEquals(testUser.getEmail(), result.getEmail());
        }

        @Test
        @DisplayName("Should return null for non-existent active user by email")
        void testFindActiveUserByEmail_WithNonExistentEmail_ShouldReturnNull() {
            // Given
            String email = "nonexistent@example.com";
            when(userRepository.findByEmailAndIsActiveTrueAndIsDeletedFalse(email))
                    .thenReturn(Optional.empty());

            // When
            UserDtls result = userService.findActiveUserByEmail(email);

            // Then
            assertNull(result);
        }
    }

    @Nested
    @DisplayName("OAuth Integration")
    class OAuthTests {

        @Test
        @DisplayName("Should find user by email and provider")
        void testFindByEmailAndProvider_WithValidData_ShouldReturnUser() {
            // Given
            String email = "test@example.com";
            AuthProvider provider = AuthProvider.GOOGLE;
            testUser.setProvider(provider);

            when(userRepository.findByEmailAndProvider(email, provider))
                    .thenReturn(Optional.of(testUser));

            // When
            UserDtls result = userService.findByEmailAndProvider(email, provider);

            // Then
            assertNotNull(result);
            assertEquals(email, result.getEmail());
            assertEquals(provider, result.getProvider());
        }

        @Test
        @DisplayName("Should return null when user not found by email and provider")
        void testFindByEmailAndProvider_WithNonExistentData_ShouldReturnNull() {
            // Given
            String email = "nonexistent@example.com";
            AuthProvider provider = AuthProvider.GOOGLE;

            when(userRepository.findByEmailAndProvider(email, provider))
                    .thenReturn(Optional.empty());

            // When
            UserDtls result = userService.findByEmailAndProvider(email, provider);

            // Then
            assertNull(result);
        }

        @Test
        @DisplayName("Should save user successfully")
        void testSaveUser_WithValidUser_ShouldReturnSavedUser() {
            // Given
            when(userRepository.save(any(UserDtls.class))).thenReturn(testUser);

            // When
            UserDtls result = userService.saveUser(testUser);

            // Then
            assertNotNull(result);
            assertEquals(testUser.getId(), result.getId());
            verify(userRepository).save(testUser);
        }
    }

    @Nested
    @DisplayName("Error Handling")
    class ErrorHandlingTests {

        @Test
        @DisplayName("Should handle repository exception gracefully")
        void testGetAllUsers_WithRepositoryException_ShouldReturnError() {
            // Given
            when(userRepository.findAll()).thenThrow(new RuntimeException("Database error"));

            // When
            ApiResponse<List<UserResponse>> result = userService.getAllUsers();

            // Then
            assertFalse(result.isSuccess());
            assertTrue(result.getMessage().contains("Error getting list of users"));
        }

        @Test
        @DisplayName("Should handle email service exception gracefully")
        void testSendEmailVerificationCode_WithEmailException_ShouldReturnError() throws Exception {
            // Given
            VerificationCodeRequest request = new VerificationCodeRequest();
            request.setEmail("test@example.com");

            when(userRepository.existsByEmailAndIsActiveTrueAndIsDeletedFalse(anyString())).thenReturn(false);
            when(emailVerificationService.generateVerificationCode(anyString())).thenReturn("123456");
            doThrow(new RuntimeException("Email service error"))
                    .when(emailService).sendEmailVerificationCodeAsync(anyString(), anyString());

            // When
            ApiResponse<String> result = userService.sendEmailVerificationCode(request);

            // Then
            assertFalse(result.isSuccess());
            assertTrue(result.getMessage().contains("Unable to send verification code"));
        }
    }

    @Nested
    @DisplayName("Data Validation")
    class DataValidationTests {

        @Test
        @DisplayName("Should validate phone number format")
        void testGetCleanPhoneNumber_WithEmptyString_ShouldReturnEmpty() {
            // When
            String result = userService.getCleanPhoneNumber("");

            // Then
            assertEquals("", result);
        }

        @Test
        @DisplayName("Should handle null values gracefully")
        void testIsPhoneExists_WithNullPhone_ShouldReturnFalse() {
            // When
            boolean result = userService.isPhoneExists(null);

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should handle empty phone gracefully")
        void testIsPhoneExists_WithEmptyPhone_ShouldReturnFalse() {
            // When
            boolean result = userService.isPhoneExists("");

            // Then
            assertFalse(result);
        }

        @Test
        @DisplayName("Should handle whitespace-only phone gracefully")
        void testIsPhoneExists_WithWhitespacePhone_ShouldReturnFalse() {
            // When
            boolean result = userService.isPhoneExists("   ");

            // Then
            assertFalse(result);
        }
    }
}
