package com.healapp.service;

import java.io.File;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.DeleteAccountRequest;
import com.healapp.dto.SendDeleteVerificationRequest;
import com.healapp.model.AuthProvider;
import com.healapp.model.BlogPost;
import com.healapp.model.ConsultantProfile;
import com.healapp.model.Consultation;
import com.healapp.model.ControlPills;
import com.healapp.model.MenstrualCycle;
import com.healapp.model.Notification;
import com.healapp.model.NotificationPreference;
import com.healapp.model.Payment;
import com.healapp.model.PaymentInfo;
import com.healapp.model.PillLogs;
import com.healapp.model.PregnancyProbLog;
import com.healapp.model.Question;
import com.healapp.model.Rating;
import com.healapp.model.STITest;
import com.healapp.model.TestResult;
import com.healapp.model.UserDtls;
import com.healapp.repository.BlogPostRepository;
import com.healapp.repository.ConsultantProfileRepository;
import com.healapp.repository.ConsultationRepository;
import com.healapp.repository.ControlPillsRepository;
import com.healapp.repository.MenstrualCycleRepository;
import com.healapp.repository.NotificationPreferenceRepository;
import com.healapp.repository.NotificationRepository;
import com.healapp.repository.PaymentInfoRepository;
import com.healapp.repository.PaymentRepository;
import com.healapp.repository.PillLogsRepository;
import com.healapp.repository.PregnancyProbLogRepository;
import com.healapp.repository.QuestionRepository;
import com.healapp.repository.RatingRepository;
import com.healapp.repository.STITestRepository;
import com.healapp.repository.TestResultRepository;
import com.healapp.repository.UserRepository;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AccountDeletionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @Autowired
    private FileStorageService fileStorageService;

    // Repositories for related data
    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private ConsultantProfileRepository consultantProfileRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private ControlPillsRepository controlPillsRepository;

    @Autowired
    private MenstrualCycleRepository menstrualCycleRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationPreferenceRepository notificationPreferenceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentInfoRepository paymentInfoRepository;

    @Autowired
    private PillLogsRepository pillLogsRepository;

    @Autowired
    private PregnancyProbLogRepository pregnancyProbLogRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private STITestRepository stiTestRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    /**
     * Gửi mã xác thực để xóa tài khoản
     */
    public ApiResponse<String> sendDeleteVerificationCode(Long userId, SendDeleteVerificationRequest request) {
        try {
            // Lấy thông tin user
            UserDtls user = userRepository.findById(userId)
                    .orElse(null);

            if (user == null) {
                return ApiResponse.error("Không tìm thấy người dùng");
            }

            // Kiểm tra role - chỉ cho phép CUSTOMER xóa tài khoản
            String userRole = user.getRoleName();
            if (!"CUSTOMER".equals(userRole)) {
                return ApiResponse.error("Chỉ tài khoản CUSTOMER mới được phép xóa. " +
                        "Tài khoản STAFF và CONSULTANT không thể xóa vì lý do bảo mật.");
            }

            // Kiểm tra mật khẩu
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ApiResponse.error("Mật khẩu không đúng");
            }

            // Kiểm tra nếu user đăng nhập bằng OAuth (Google)
            if (user.getProvider() != AuthProvider.LOCAL) {
                return ApiResponse.error("Tài khoản đăng nhập bằng Google không thể xóa qua API này");
            }

            // Tạo mã xác thực
            String verificationCode = emailVerificationService.generateVerificationCode(user.getEmail());

            // Gửi email xác thực
            emailService.sendDeleteAccountVerificationCodeAsync(user.getEmail(), verificationCode);

            return ApiResponse.success("Mã xác thực đã được gửi đến email của bạn", user.getEmail());

        } catch (Exception e) {
            log.error("Error sending delete verification code: ", e);
            return ApiResponse.error("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    /**
     * Xóa tài khoản vĩnh viễn
     */
    @Transactional
    public ApiResponse<String> deleteAccount(Long userId, DeleteAccountRequest request) {
        try {
            // Lấy thông tin user
            UserDtls user = userRepository.findById(userId)
                    .orElse(null);

            if (user == null) {
                return ApiResponse.error("Không tìm thấy người dùng");
            }

            // Kiểm tra role - chỉ cho phép CUSTOMER xóa tài khoản
            String userRole = user.getRoleName();
            if (!"CUSTOMER".equals(userRole)) {
                return ApiResponse.error("Chỉ tài khoản CUSTOMER mới được phép xóa. " +
                        "Tài khoản STAFF và CONSULTANT không thể xóa vì lý do bảo mật.");
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
            if (user.getProvider() != AuthProvider.LOCAL) {
                return ApiResponse.error("Tài khoản đăng nhập bằng Google không thể xóa qua API này");
            }

            log.info("Starting account deletion for user: {}", user.getEmail());

            // Xóa dữ liệu liên quan theo thứ tự (từ bảng con đến bảng cha)
            deleteUserRelatedData(userId);

            // Xóa avatar file nếu có
            deleteUserAvatar(user);

            // Xóa user cuối cùng
            userRepository.delete(user);

            log.info("Account deletion completed for user: {}", user.getEmail());

            return ApiResponse.success("Tài khoản đã được xóa thành công");

        } catch (Exception e) {
            log.error("Error deleting account: ", e);
            return ApiResponse.error("Có lỗi xảy ra khi xóa tài khoản: " + e.getMessage());
        }
    }

    /**
     * Xóa tất cả dữ liệu liên quan đến user
     */
    private void deleteUserRelatedData(Long userId) {
        log.info("Deleting related data for user ID: {}", userId);

        // Lấy user để sử dụng trong các query
        UserDtls user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.error("User not found for ID: {}", userId);
            return;
        }

        // 1. Xóa PillLogs (logs của thuốc tránh thai)
        List<ControlPills> controlPills = controlPillsRepository.findByUserIdAndIsActive(user, true).orElse(null);
        if (controlPills != null && !controlPills.isEmpty()) {
            for (ControlPills controlPill : controlPills) {
                List<PillLogs> pillLogs = pillLogsRepository.findByControlPills(controlPill);
                if (!pillLogs.isEmpty()) {
                    pillLogsRepository.deleteAll(pillLogs);
                    log.info("Deleted {} pill logs for control pill ID: {}", pillLogs.size(), controlPill.getPillsId());
                }
            }
            controlPillsRepository.deleteAll(controlPills);
            log.info("Deleted {} control pills records", controlPills.size());
        }

        // 2. Xóa PregnancyProbLog (log xác suất mang thai)
        List<MenstrualCycle> menstrualCycles = menstrualCycleRepository.findAllByUserId(userId).orElse(null);
        if (menstrualCycles != null && !menstrualCycles.isEmpty()) {
            for (MenstrualCycle cycle : menstrualCycles) {
                List<PregnancyProbLog> pregnancyLogs = pregnancyProbLogRepository
                        .findAllByMenstrualCycleId(cycle.getId()).orElse(null);
                if (pregnancyLogs != null && !pregnancyLogs.isEmpty()) {
                    pregnancyProbLogRepository.deleteAll(pregnancyLogs);
                    log.info("Deleted {} pregnancy probability logs for cycle ID: {}", pregnancyLogs.size(),
                            cycle.getId());
                }
            }
            menstrualCycleRepository.deleteAll(menstrualCycles);
            log.info("Deleted {} menstrual cycles", menstrualCycles.size());
        }

        // 3. Xóa TestResult (kết quả xét nghiệm)
        List<STITest> stiTests = stiTestRepository.findByCustomerIdOrderByCreatedAtDesc(userId);
        if (!stiTests.isEmpty()) {
            for (STITest stiTest : stiTests) {
                List<TestResult> testResults = testResultRepository.findByStiTest(stiTest);
                if (!testResults.isEmpty()) {
                    testResultRepository.deleteAll(testResults);
                    log.info("Deleted {} test results for STI test ID: {}", testResults.size(), stiTest.getTestId());
                }
            }
            stiTestRepository.deleteAll(stiTests);
            log.info("Deleted {} STI tests", stiTests.size());
        }

        // 4. Xóa Rating (đánh giá)
        Page<Rating> ratingPage = ratingRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId,
                Pageable.unpaged());
        List<Rating> ratings = ratingPage.getContent();
        if (!ratings.isEmpty()) {
            ratingRepository.deleteAll(ratings);
            log.info("Deleted {} ratings", ratings.size());
        }

        // 5. Xóa Question (câu hỏi)
        Page<Question> questionPage = questionRepository.findByCustomer(user, Pageable.unpaged());
        List<Question> questions = questionPage.getContent();
        if (!questions.isEmpty()) {
            questionRepository.deleteAll(questions);
            log.info("Deleted {} questions", questions.size());
        }

        // 6. Xóa Consultation (tư vấn)
        List<Consultation> consultations = consultationRepository.findByUserInvolved(userId);
        if (!consultations.isEmpty()) {
            consultationRepository.deleteAll(consultations);
            log.info("Deleted {} consultations", consultations.size());
        }

        // 7. Xóa Payment (thanh toán)
        List<Payment> payments = paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (!payments.isEmpty()) {
            paymentRepository.deleteAll(payments);
            log.info("Deleted {} payments", payments.size());
        }

        // 8. Xóa PaymentInfo (thông tin thanh toán)
        List<PaymentInfo> paymentInfos = paymentInfoRepository
                .findByUserIdAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(userId);
        if (!paymentInfos.isEmpty()) {
            paymentInfoRepository.deleteAll(paymentInfos);
            log.info("Deleted {} payment info records", paymentInfos.size());
        }

        // 9. Xóa Notification (thông báo)
        List<Notification> notifications = notificationRepository.findByUserIdOrderByScheduledAtDesc(userId);
        if (!notifications.isEmpty()) {
            notificationRepository.deleteAll(notifications);
            log.info("Deleted {} notifications", notifications.size());
        }

        // 10. Xóa NotificationPreference (cài đặt thông báo)
        List<NotificationPreference> notificationPreferences = notificationPreferenceRepository.findByUserId(userId);
        if (!notificationPreferences.isEmpty()) {
            notificationPreferenceRepository.deleteAll(notificationPreferences);
            log.info("Deleted {} notification preferences", notificationPreferences.size());
        }

        // 11. Xóa BlogPost (bài viết blog)
        List<BlogPost> blogPosts = blogPostRepository.findByAuthor(user);
        if (!blogPosts.isEmpty()) {
            blogPostRepository.deleteAll(blogPosts);
            log.info("Deleted {} blog posts", blogPosts.size());
        }

        // 12. Xóa ConsultantProfile (hồ sơ tư vấn viên)
        Optional<ConsultantProfile> consultantProfileOpt = consultantProfileRepository.findByUserId(userId);
        if (consultantProfileOpt.isPresent()) {
            consultantProfileRepository.delete(consultantProfileOpt.get());
            log.info("Deleted consultant profile");
        }

        log.info("Completed deleting related data for user ID: {}", userId);
    }

    /**
     * Xóa avatar file của user
     */
    private void deleteUserAvatar(UserDtls user) {
        try {
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                // Kiểm tra nếu avatar không phải là default
                if (!user.getAvatar().contains("default.jpg") && !user.getAvatar().contains("default.png")) {
                    String avatarPath = user.getAvatar();
                    File avatarFile = new File(avatarPath);
                    if (avatarFile.exists()) {
                        boolean deleted = avatarFile.delete();
                        if (deleted) {
                            log.info("Deleted avatar file: {}", avatarPath);
                        } else {
                            log.warn("Failed to delete avatar file: {}", avatarPath);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error deleting avatar file: ", e);
            // Không throw exception vì đây không phải là lỗi nghiêm trọng
        }
    }
}