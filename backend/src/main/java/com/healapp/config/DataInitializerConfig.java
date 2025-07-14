package com.healapp.config;

import java.time.LocalDateTime;


import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.healapp.model.CategoryQuestion;
import com.healapp.model.UserDtls;
import com.healapp.model.STIPackage;
import com.healapp.model.STIService;
import com.healapp.model.Question;
import com.healapp.model.Rating;
import com.healapp.model.ConsultantProfile;
import com.healapp.model.ServiceTestComponent;
import com.healapp.repository.CategoryQuestionRepository;
import com.healapp.repository.UserRepository;
import com.healapp.repository.STIPackageRepository;
import com.healapp.repository.STIServiceRepository;
import com.healapp.repository.QuestionRepository;
import com.healapp.repository.RatingRepository;
import com.healapp.repository.ConsultantProfileRepository;
import com.healapp.repository.ServiceTestComponentRepository;
import com.healapp.repository.CategoryRepository;
import com.healapp.repository.RoleRepository;
import com.healapp.model.Category;
import com.healapp.model.Payment;
import com.healapp.model.STITest;

import com.healapp.model.PaymentInfo;
import com.healapp.model.Role;
import com.healapp.repository.PaymentRepository;
import com.healapp.repository.STITestRepository;
import com.healapp.repository.PaymentInfoRepository;

import com.healapp.repository.MenstrualCycleRepository;
import com.healapp.model.Consultation;
import com.healapp.model.RatingSummary;
import com.healapp.repository.ConsultationRepository;
import com.healapp.repository.RatingSummaryRepository;
import com.healapp.model.BlogPost;
import com.healapp.model.BlogPostStatus;
import com.healapp.repository.BlogPostRepository;


@Component
public class DataInitializerConfig implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryQuestionRepository categoryQuestionRepository;
    private final STIPackageRepository stiPackageRepository;
    private final STIServiceRepository stiServiceRepository;
    private final QuestionRepository questionRepository;
    private final RatingRepository ratingRepository;
    private final ConsultantProfileRepository consultantProfileRepository;
    private final ServiceTestComponentRepository serviceTestComponentRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentRepository paymentRepository;
    private final STITestRepository stiTestRepository;
    private final PaymentInfoRepository paymentInfoRepository;
    private final MenstrualCycleRepository menstrualCycleRepository;
    private final ConsultationRepository consultationRepository;
    private final RatingSummaryRepository ratingSummaryRepository;
    private final BlogPostRepository blogPostRepository;
    private final RoleRepository roleRepository;

    public DataInitializerConfig(UserRepository userRepository,
            PasswordEncoder passwordEncoder, CategoryQuestionRepository categoryQuestionRepository,
            STIPackageRepository stiPackageRepository, STIServiceRepository stiServiceRepository,
            QuestionRepository questionRepository, RatingRepository ratingRepository,
            ConsultantProfileRepository consultantProfileRepository,
            ServiceTestComponentRepository serviceTestComponentRepository,
            CategoryRepository categoryRepository,
            PaymentRepository paymentRepository,
            STITestRepository stiTestRepository,
            PaymentInfoRepository paymentInfoRepository,
            MenstrualCycleRepository menstrualCycleRepository,
            ConsultationRepository consultationRepository,
            RatingSummaryRepository ratingSummaryRepository,
            BlogPostRepository blogPostRepository,
            RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoryQuestionRepository = categoryQuestionRepository;
        this.stiPackageRepository = stiPackageRepository;
        this.stiServiceRepository = stiServiceRepository;
        this.questionRepository = questionRepository;
        this.ratingRepository = ratingRepository;
        this.consultantProfileRepository = consultantProfileRepository;
        this.serviceTestComponentRepository = serviceTestComponentRepository;
        this.categoryRepository = categoryRepository;
        this.paymentRepository = paymentRepository;
        this.stiTestRepository = stiTestRepository;
        this.paymentInfoRepository = paymentInfoRepository;
        this.menstrualCycleRepository = menstrualCycleRepository;
        this.consultationRepository = consultationRepository;
        this.ratingSummaryRepository = ratingSummaryRepository;
        this.blogPostRepository = blogPostRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        // ROLES
        // Tạo roles trước nếu chưa có
        createRolesIfNotExists();

        // USER
        // Tạo user mặc định cho từng role
        if (userRepository.count() < 5) {
            // Lấy các roles
            Role customerRole = roleRepository.findByRoleName("CUSTOMER")
                    .orElseThrow(() -> new RuntimeException("CUSTOMER role not found"));
            Role staffRole = roleRepository.findByRoleName("STAFF")
                    .orElseThrow(() -> new RuntimeException("STAFF role not found"));
            Role consultantRole = roleRepository.findByRoleName("CONSULTANT")
                    .orElseThrow(() -> new RuntimeException("CONSULTANT role not found"));
            Role adminRole = roleRepository.findByRoleName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            // Tạo 2 tài khoản CUSTOMER
            if (userRepository.count() < 1) {
                UserDtls customer1 = new UserDtls();
                customer1.setFullName("Nguyễn Văn A");
                customer1.setUsername("customer1");
                customer1.setPassword(passwordEncoder.encode("Aa12345@"));
                customer1.setEmail("customer1@healapp.com");
                customer1.setPhone("0900000001");
                customer1.setIsActive(true);
                customer1.setGender(com.healapp.model.Gender.MALE);
                customer1.setBirthDay(java.time.LocalDate.of(1990, 1, 15));
                customer1.setAddress("123 Đường ABC, Quận 1, TP.HCM");
                customer1.setProvider(com.healapp.model.AuthProvider.LOCAL);
                customer1.setCreatedDate(LocalDateTime.now());
                customer1.setRole(customerRole);
                userRepository.save(customer1);
            }

            if (userRepository.count() < 2) {
                UserDtls customer2 = new UserDtls();
                customer2.setFullName("Trần Thị B");
                customer2.setUsername("customer2");
                customer2.setPassword(passwordEncoder.encode("Aa12345@"));
                customer2.setEmail("customer2@healapp.com");
                customer2.setPhone("0900000002");
                customer2.setIsActive(true);
                customer2.setGender(com.healapp.model.Gender.FEMALE);
                customer2.setBirthDay(java.time.LocalDate.of(1992, 3, 20));
                customer2.setAddress("456 Đường DEF, Quận 2, TP.HCM");
                customer2.setProvider(com.healapp.model.AuthProvider.LOCAL);
                customer2.setCreatedDate(LocalDateTime.now());
                customer2.setRole(customerRole);
                userRepository.save(customer2);
            }

            // Tạo 1 tài khoản STAFF
            if (userRepository.count() < 3) {
                UserDtls staff = new UserDtls();
                staff.setFullName("Lê Văn C");
                staff.setUsername("staff1");
                staff.setPassword(passwordEncoder.encode("Aa12345@"));
                staff.setEmail("staff1@healapp.com");
                staff.setPhone("0900000003");
                staff.setIsActive(true);
                staff.setGender(com.healapp.model.Gender.MALE);
                staff.setBirthDay(java.time.LocalDate.of(1988, 5, 10));
                staff.setAddress("789 Đường GHI, Quận 3, TP.HCM");
                staff.setProvider(com.healapp.model.AuthProvider.LOCAL);
                staff.setCreatedDate(LocalDateTime.now());
                staff.setRole(staffRole);
                userRepository.save(staff);
            }

            // Tạo 1 tài khoản CONSULTANT
            if (userRepository.count() < 4) {
                UserDtls consultant = new UserDtls();
                consultant.setFullName("Dr. Phạm Thị D");
                consultant.setUsername("consultant1");
                consultant.setPassword(passwordEncoder.encode("Aa12345@"));
                consultant.setEmail("consultant1@healapp.com");
                consultant.setPhone("0900000004");
                consultant.setIsActive(true);
                consultant.setGender(com.healapp.model.Gender.FEMALE);
                consultant.setBirthDay(java.time.LocalDate.of(1985, 8, 25));
                consultant.setAddress("321 Đường JKL, Quận 4, TP.HCM");
                consultant.setProvider(com.healapp.model.AuthProvider.LOCAL);
                consultant.setCreatedDate(LocalDateTime.now());
                consultant.setRole(consultantRole);
                userRepository.save(consultant);
            }

            // Tạo 1 tài khoản ADMIN
            if (userRepository.count() < 5) {
                UserDtls admin = new UserDtls();
                admin.setFullName("Hoàng Văn E");
                admin.setUsername("admin1");
                admin.setPassword(passwordEncoder.encode("Aa12345@"));
                admin.setEmail("admin1@healapp.com");
                admin.setPhone("0900000005");
                admin.setIsActive(true);
                admin.setGender(com.healapp.model.Gender.MALE);
                admin.setBirthDay(java.time.LocalDate.of(1983, 12, 5));
                admin.setAddress("654 Đường MNO, Quận 5, TP.HCM");
                admin.setProvider(com.healapp.model.AuthProvider.LOCAL);
                admin.setCreatedDate(LocalDateTime.now());
                admin.setRole(adminRole);
                userRepository.save(admin);
            }
        }

        // CATEGORY_QUESTIONS
        createCategoryQuestionsIfNotExists();

        // CATEGORIES
        createCategoriesIfNotExists();

        // BLOG_POSTS
        createBlogPostsAndSectionsIfNotExists();

        // CONSULTANT_PROFILES
        createConsultantProfilesIfNotExists();

        // CONSULTATIONS
        createConsultationsIfNotExists();

        // MENSTRUAL_CYCLE
        createMenstrualCyclesIfNotExists();

        // PAYMENT_INFO
        createPaymentInfosIfNotExists();

        // PAYMENTS
        createPaymentsIfNotExists();

        // QUESTIONS
        createQuestionsIfNotExists();

        // RATING_SUMMARY
        createRatingSummariesIfNotExists();

        // RATINGS
        createRatingsIfNotExists();

        // SERVICE_TEST_COMPONENTS
        createServiceTestComponentsIfNotExists();

        // STI_PACKAGES
        createSTIPackagesIfNotExists();

        // STI_SERVICES
        createSTIServicesIfNotExists();

        // STI_TESTS
        createSTITestsIfNotExists();

        System.out.println("Sample data for selected main tables created if not exists.");
    }

    private void createCategoryQuestionsIfNotExists() {
        if (categoryQuestionRepository.count() == 0) {
            CategoryQuestion cq1 = new CategoryQuestion();
            cq1.setName("Sức khỏe sinh sản");
            cq1.setDescription("Các câu hỏi về sức khỏe sinh sản");

            CategoryQuestion cq2 = new CategoryQuestion();
            cq2.setName("Tư vấn tâm lý");
            cq2.setDescription("Các câu hỏi về tư vấn tâm lý");

            CategoryQuestion cq3 = new CategoryQuestion();
            cq3.setName("Dinh dưỡng");
            cq3.setDescription("Các câu hỏi về dinh dưỡng");

            CategoryQuestion cq4 = new CategoryQuestion();
            cq4.setName("Khác");
            cq4.setDescription("Khác với các loại trên");

            categoryQuestionRepository.save(cq1);
            categoryQuestionRepository.save(cq2);
            categoryQuestionRepository.save(cq3);
            categoryQuestionRepository.save(cq4);
        }
    }

    private void createSTIServicesIfNotExists() {
        if (stiServiceRepository.count() == 0) {
            STIService s1 = new STIService();
            s1.setName("Xét nghiệm HIV");
            s1.setDescription("Dịch vụ xét nghiệm HIV");
            s1.setPrice(new java.math.BigDecimal("500000"));
            s1.setIsActive(true);
            s1.setCreatedAt(java.time.LocalDateTime.now());
            s1.setUpdatedAt(java.time.LocalDateTime.now());
            stiServiceRepository.save(s1);

            STIService s2 = new STIService();
            s2.setName("Xét nghiệm HPV");
            s2.setDescription("Dịch vụ xét nghiệm HPV");
            s2.setPrice(new java.math.BigDecimal("400000"));
            s2.setIsActive(true);
            s2.setCreatedAt(java.time.LocalDateTime.now());
            s2.setUpdatedAt(java.time.LocalDateTime.now());
            stiServiceRepository.save(s2);
        }
    }

    private void createSTIPackagesIfNotExists() {
        if (stiPackageRepository.count() == 0) {
            STIPackage p1 = new STIPackage();
            p1.setPackageName("Gói xét nghiệm tổng quát");
            p1.setDescription("Bao gồm nhiều dịch vụ xét nghiệm tổng quát");
            p1.setPackagePrice(new java.math.BigDecimal("1200000"));
            p1.setIsActive(true);
            p1.setCreatedAt(java.time.LocalDateTime.now());
            p1.setUpdatedAt(java.time.LocalDateTime.now());
            stiPackageRepository.save(p1);
        }
    }

    private void createServiceTestComponentsIfNotExists() {
        if (serviceTestComponentRepository.count() == 0 && stiServiceRepository.count() > 0) {
            STIService service = stiServiceRepository.findAll().get(0);
            ServiceTestComponent c1 = new ServiceTestComponent();
            c1.setStiService(service);
            c1.setTestName("Kháng thể HIV");
            c1.setUnit("ng/mL");
            c1.setReferenceRange("0-1");
            c1.setInterpretation("Âm tính nếu <1");
            c1.setSampleType("Máu");
            c1.setIsActive(true);
            c1.setCreatedAt(java.time.LocalDateTime.now());
            c1.setUpdatedAt(java.time.LocalDateTime.now());
            serviceTestComponentRepository.save(c1);
        }
    }

    private void createQuestionsIfNotExists() {
        if (questionRepository.count() == 0 && userRepository.count() > 0 && categoryQuestionRepository.count() > 0) {
            Question q1 = new Question();
            q1.setCustomer(userRepository.findAll().get(0));
            q1.setCategoryQuestion(categoryQuestionRepository.findAll().get(0));
            q1.setContent("Tôi nên làm gì để phòng tránh HIV?");
            q1.setAnswer("Bạn nên sử dụng bao cao su và kiểm tra sức khỏe định kỳ.");
            q1.setStatus(Question.QuestionStatus.ANSWERED);
            q1.setCreatedAt(java.time.LocalDateTime.now());
            q1.setUpdatedAt(java.time.LocalDateTime.now());
            questionRepository.save(q1);
        }
    }

    private void createRatingsIfNotExists() {
        if (ratingRepository.count() == 0 && userRepository.count() > 0) {
            Rating r1 = new Rating();
            r1.setUser(userRepository.findAll().get(0));
            r1.setTargetType(Rating.RatingTargetType.CONSULTANT);
            r1.setTargetId(1L);
            r1.setRating(5);
            r1.setComment("Dịch vụ rất tốt!");
            r1.setIsActive(true);
            r1.setCreatedAt(java.time.LocalDateTime.now());
            r1.setUpdatedAt(java.time.LocalDateTime.now());
            ratingRepository.save(r1);
        }
    }

    private void createConsultantProfilesIfNotExists() {
        if (consultantProfileRepository.count() == 0 && userRepository.count() > 0) {
            ConsultantProfile cp = new ConsultantProfile();
            cp.setUser(userRepository.findAll().get(0));
            cp.setQualifications("Bác sĩ chuyên khoa I");
            cp.setExperience("10 năm tư vấn sức khỏe");
            cp.setBio("Tận tâm với nghề");
            cp.setCreatedAt(java.time.LocalDateTime.now());
            cp.setUpdatedAt(java.time.LocalDateTime.now());
            consultantProfileRepository.save(cp);
        }
    }

    private void createCategoriesIfNotExists() {
        if (categoryRepository.count() == 0) {
            Category c1 = new Category();
            c1.setName("Sức khỏe phụ nữ");
            c1.setDescription("Các bài viết về sức khỏe phụ nữ");
            c1.setIsActive(true);

            Category c2 = new Category();
            c2.setName("Tư vấn giới tính");
            c2.setDescription("Các bài viết về tư vấn giới tính");
            c2.setIsActive(true);

            Category c3 = new Category();
            c3.setName("Dinh dưỡng & Lối sống");
            c3.setDescription("Các bài viết về dinh dưỡng và lối sống lành mạnh");
            c3.setIsActive(true);

            categoryRepository.save(c1);
            categoryRepository.save(c2);
            categoryRepository.save(c3);
        }
    }

    private void createPaymentsIfNotExists() {
        if (paymentRepository.count() == 0 && userRepository.count() > 0) {
            Payment p1 = new Payment();
            p1.setUserId(userRepository.findAll().get(0).getId());
            p1.setServiceType("STI_SERVICE");
            p1.setServiceId(1L);
            p1.setPaymentMethod(com.healapp.model.PaymentMethod.VISA);
            p1.setPaymentStatus(com.healapp.model.PaymentStatus.COMPLETED);
            p1.setAmount(new java.math.BigDecimal("500000"));
            p1.setCurrency("VND");
            p1.setCreatedAt(java.time.LocalDateTime.now());
            p1.setUpdatedAt(java.time.LocalDateTime.now());
            paymentRepository.save(p1);
            // Thêm nhiều payment khác nếu muốn
        }
    }

    private void createSTITestsIfNotExists() {
        if (stiTestRepository.count() == 0 && userRepository.count() > 0 && stiServiceRepository.count() > 0) {
            com.healapp.model.STITest test1 = new com.healapp.model.STITest();
            test1.setCustomer(userRepository.findAll().get(0));
            test1.setStiService(stiServiceRepository.findAll().get(0));
            test1.setStatus(com.healapp.model.STITestStatus.COMPLETED);
            test1.setCreatedAt(java.time.LocalDateTime.now());
            test1.setUpdatedAt(java.time.LocalDateTime.now());
            stiTestRepository.save(test1);
        }
    }

    private void createPaymentInfosIfNotExists() {
        if (paymentInfoRepository.count() == 0 && userRepository.count() > 0) {
            com.healapp.model.PaymentInfo pi1 = new com.healapp.model.PaymentInfo();
            pi1.setUserId(userRepository.findAll().get(0).getId());
            pi1.setCardNumber("4111111111111111");
            pi1.setCardHolderName("Nguyễn Văn A");
            pi1.setExpiryMonth("12");
            pi1.setExpiryYear("2026");
            pi1.setCvv("123");
            pi1.setCardType("VISA");
            pi1.setIsDefault(true);
            pi1.setIsActive(true);
            pi1.setCreatedAt(java.time.LocalDateTime.now());
            pi1.setUpdatedAt(java.time.LocalDateTime.now());
            paymentInfoRepository.save(pi1);
        }
    }

    private void createMenstrualCyclesIfNotExists() {
        if (menstrualCycleRepository.count() == 0 && userRepository.count() > 0) {
            com.healapp.model.MenstrualCycle mc1 = new com.healapp.model.MenstrualCycle();
            mc1.setUser(userRepository.findAll().get(0));
            mc1.setStartDate(java.time.LocalDate.now().minusDays(28));
            mc1.setNumberOfDays(5L);
            mc1.setCycleLength(28L);
            mc1.setOvulationDate(java.time.LocalDate.now().minusDays(14));
            mc1.setCreatedAt(java.time.LocalDateTime.now());
            menstrualCycleRepository.save(mc1);
        }
    }

    private void createConsultationsIfNotExists() {
        if (consultationRepository.count() == 0 && userRepository.count() > 1) {
            com.healapp.model.Consultation c1 = new com.healapp.model.Consultation();
            c1.setCustomer(userRepository.findAll().get(0));
            c1.setConsultant(userRepository.findAll().get(1));
            c1.setStartTime(java.time.LocalDateTime.now());
            c1.setEndTime(java.time.LocalDateTime.now().plusMinutes(30));
            c1.setStatus(com.healapp.model.ConsultationStatus.COMPLETED);
            c1.setCreatedAt(java.time.LocalDateTime.now());
            consultationRepository.save(c1);
        }
    }

    private void createRatingSummariesIfNotExists() {
        if (ratingSummaryRepository.count() == 0) {
            com.healapp.model.RatingSummary rs1 = new com.healapp.model.RatingSummary();
            rs1.setTargetType(com.healapp.model.Rating.RatingTargetType.CONSULTANT);
            rs1.setTargetId(1L);
            rs1.setTotalRatings(1);
            rs1.setAverageRating(new java.math.BigDecimal("5.0"));
            rs1.setFiveStarCount(1);
            rs1.setLastUpdated(java.time.LocalDateTime.now());
            ratingSummaryRepository.save(rs1);
        }
    }

    private void createBlogPostsAndSectionsIfNotExists() {
        // Chỉ giữ lại insert dữ liệu mẫu cho các bảng chính
        // roles, user, categories, category_questions, blog_posts, consultant_profiles,
        // payments, sti_services, sti_packages, questions, ratings, notifications,
        // notification_preference, consultations, payment_info, sti_tests,
        // test_results, rating_summary
        // Xoá logic insert cho các bảng phụ
        // (1) Đã có logic roles, user, categories, category_questions ở đầu hàm run
        // (2) BLOG_POSTS
        if (blogPostRepository.count() < 5 && userRepository.count() > 0 && categoryRepository.count() > 0) {
            for (int i = (int) blogPostRepository.count(); i < 5; i++) {
                BlogPost post = new BlogPost();
                post.setTitle("Bài viết mẫu " + (i + 1));
                post.setContent("Nội dung bài viết mẫu " + (i + 1));
                post.setCategory(categoryRepository.findAll().get(i % (int) categoryRepository.count()));
                post.setAuthor(userRepository.findAll().get(i % (int) userRepository.count()));
                post.setStatus(i % 3 == 0 ? BlogPostStatus.PROCESSING
                        : (i % 3 == 1 ? BlogPostStatus.CONFIRMED : BlogPostStatus.CANCELED));
                post.setCreatedAt(java.time.LocalDateTime.now());
                blogPostRepository.save(post);
            }
        }
        // CONSULTANT_PROFILES
        if (consultantProfileRepository.count() < 5 && userRepository.count() > 0) {
            for (int i = (int) consultantProfileRepository.count(); i < 5; i++) {
                ConsultantProfile cp = new ConsultantProfile();
                cp.setUser(userRepository.findAll().get(i % (int) userRepository.count()));
                cp.setQualifications("Bằng cấp mẫu " + (i + 1));
                cp.setExperience((5 + i) + " năm kinh nghiệm");
                cp.setBio("Bio mẫu " + (i + 1));
                cp.setCreatedAt(java.time.LocalDateTime.now());
                cp.setUpdatedAt(java.time.LocalDateTime.now());
                consultantProfileRepository.save(cp);
            }
        }
        // PAYMENTS
        if (paymentRepository.count() < 5 && userRepository.count() > 0) {
            for (int i = (int) paymentRepository.count(); i < 5; i++) {
                Payment p = new Payment();
                p.setUserId(userRepository.findAll().get(i % (int) userRepository.count()).getId());
                p.setServiceType(i % 2 == 0 ? "STI_SERVICE" : "STI_PACKAGE");
                p.setServiceId((long) ((i % 2) + 1));
                p.setPaymentMethod(i % 3 == 0 ? com.healapp.model.PaymentMethod.VISA
                        : (i % 3 == 1 ? com.healapp.model.PaymentMethod.QR_CODE : com.healapp.model.PaymentMethod.COD));
                p.setPaymentStatus(i % 2 == 0 ? com.healapp.model.PaymentStatus.COMPLETED
                        : com.healapp.model.PaymentStatus.PENDING);
                p.setAmount(new java.math.BigDecimal(500000 + i * 100000));
                p.setCurrency("VND");
                p.setCreatedAt(java.time.LocalDateTime.now());
                p.setUpdatedAt(java.time.LocalDateTime.now());
                paymentRepository.save(p);
            }
        }
        // STI_SERVICES
        if (stiServiceRepository.count() < 5) {
            for (int i = (int) stiServiceRepository.count(); i < 5; i++) {
                STIService s = new STIService();
                s.setName("Dịch vụ STI mẫu " + (i + 1));
                s.setDescription("Mô tả dịch vụ STI mẫu " + (i + 1));
                s.setPrice(new java.math.BigDecimal(400000 + i * 50000));
                s.setIsActive(true);
                s.setCreatedAt(java.time.LocalDateTime.now());
                s.setUpdatedAt(java.time.LocalDateTime.now());
                stiServiceRepository.save(s);
            }
        }
        // STI_PACKAGES
        if (stiPackageRepository.count() < 5) {
            for (int i = (int) stiPackageRepository.count(); i < 5; i++) {
                STIPackage p = new STIPackage();
                p.setPackageName("Gói xét nghiệm mẫu " + (i + 1));
                p.setDescription("Mô tả gói xét nghiệm mẫu " + (i + 1));
                p.setPackagePrice(new java.math.BigDecimal(800000 + i * 100000));
                p.setIsActive(true);
                p.setCreatedAt(java.time.LocalDateTime.now());
                p.setUpdatedAt(java.time.LocalDateTime.now());
                stiPackageRepository.save(p);
            }
        }
        // QUESTIONS
        if (questionRepository.count() < 5 && userRepository.count() > 0 && categoryQuestionRepository.count() > 0) {
            for (int i = (int) questionRepository.count(); i < 5; i++) {
                Question q = new Question();
                q.setCustomer(userRepository.findAll().get(i % (int) userRepository.count()));
                q.setCategoryQuestion(
                        categoryQuestionRepository.findAll().get(i % (int) categoryQuestionRepository.count()));
                q.setContent("Câu hỏi mẫu " + (i + 1));
                q.setAnswer(i % 2 == 0 ? "Trả lời mẫu " + (i + 1) : null);
                q.setStatus(i % 3 == 0 ? Question.QuestionStatus.ANSWERED
                        : (i % 3 == 1 ? Question.QuestionStatus.PROCESSING : Question.QuestionStatus.CONFIRMED));
                q.setCreatedAt(java.time.LocalDateTime.now());
                q.setUpdatedAt(java.time.LocalDateTime.now());
                questionRepository.save(q);
            }
        }
        // RATINGS
        if (ratingRepository.count() < 5 && userRepository.count() > 0) {
            for (int i = (int) ratingRepository.count(); i < 5; i++) {
                Rating r = new Rating();
                r.setUser(userRepository.findAll().get(i % (int) userRepository.count()));
                r.setTargetType(i % 2 == 0 ? Rating.RatingTargetType.CONSULTANT : Rating.RatingTargetType.STI_SERVICE);
                r.setTargetId((long) ((i % 2) + 1));
                r.setRating(1 + (i % 5));
                r.setComment("Nhận xét mẫu " + (i + 1));
                r.setIsActive(true);
                r.setCreatedAt(java.time.LocalDateTime.now());
                r.setUpdatedAt(java.time.LocalDateTime.now());
                ratingRepository.save(r);
            }
        }
        // NOTIFICATIONS
        // NOTIFICATION_PREFERENCE
        // CONSULTATIONS
        if (consultationRepository.count() < 5 && userRepository.count() > 1) {
            for (int i = (int) consultationRepository.count(); i < 5; i++) {
                Consultation c = new Consultation();
                c.setCustomer(userRepository.findAll().get(i % (int) userRepository.count()));
                c.setConsultant(userRepository.findAll().get((i + 1) % (int) userRepository.count()));
                c.setStartTime(java.time.LocalDateTime.now().minusDays(i));
                c.setEndTime(java.time.LocalDateTime.now().minusDays(i).plusMinutes(30));
                c.setStatus(i % 4 == 0 ? com.healapp.model.ConsultationStatus.COMPLETED
                        : (i % 4 == 1 ? com.healapp.model.ConsultationStatus.CONFIRMED
                                : (i % 4 == 2 ? com.healapp.model.ConsultationStatus.CANCELED
                                        : com.healapp.model.ConsultationStatus.PENDING)));
                c.setCreatedAt(java.time.LocalDateTime.now());
                consultationRepository.save(c);
            }
        }
        // PAYMENT_INFO
        if (paymentInfoRepository.count() < 5 && userRepository.count() > 0) {
            for (int i = (int) paymentInfoRepository.count(); i < 5; i++) {
                PaymentInfo pi = new PaymentInfo();
                pi.setUserId(userRepository.findAll().get(i % (int) userRepository.count()).getId());
                pi.setCardNumber("411111111111111" + i); // 15 ký tự + 1 ký tự = 16 ký tự
                pi.setCardHolderName("Holder " + (i + 1));
                pi.setExpiryMonth(String.format("%02d", (i % 12) + 1));
                pi.setExpiryYear("202" + (i % 10));
                pi.setCvv("1" + (i + 1) + "3");
                pi.setCardType(i % 2 == 0 ? "VISA" : "MASTERCARD");
                pi.setIsDefault(i == 0);
                pi.setIsActive(true);
                pi.setCreatedAt(java.time.LocalDateTime.now());
                pi.setUpdatedAt(java.time.LocalDateTime.now());
                paymentInfoRepository.save(pi);
            }
        }
        // STI_TESTS
        if (stiTestRepository.count() < 5 && userRepository.count() > 0 && stiServiceRepository.count() > 0) {
            for (int i = (int) stiTestRepository.count(); i < 5; i++) {
                STITest test = new STITest();
                test.setCustomer(userRepository.findAll().get(i % (int) userRepository.count()));
                test.setStiService(stiServiceRepository.findAll().get(i % (int) stiServiceRepository.count()));
                test.setStatus(i % 3 == 0 ? com.healapp.model.STITestStatus.COMPLETED
                        : (i % 3 == 1 ? com.healapp.model.STITestStatus.PENDING
                                : com.healapp.model.STITestStatus.CANCELED));
                test.setCreatedAt(java.time.LocalDateTime.now());
                test.setUpdatedAt(java.time.LocalDateTime.now());
                stiTestRepository.save(test);
            }
        }
        // RATING_SUMMARY
        if (ratingSummaryRepository.count() < 5) {
            for (int i = (int) ratingSummaryRepository.count(); i < 5; i++) {
                RatingSummary rs = new RatingSummary();
                rs.setTargetType(i % 2 == 0 ? com.healapp.model.Rating.RatingTargetType.CONSULTANT
                        : com.healapp.model.Rating.RatingTargetType.STI_SERVICE);
                rs.setTargetId((long) ((i % 2) + 1));
                rs.setTotalRatings(1 + i);
                rs.setAverageRating(new java.math.BigDecimal(2.0 + i));
                rs.setFiveStarCount(i);
                rs.setLastUpdated(java.time.LocalDateTime.now());
                ratingSummaryRepository.save(rs);
            }
        }
    }

    private void createRolesIfNotExists() {
        // Tạo role CUSTOMER nếu chưa có
        if (!roleRepository.existsByRoleName("CUSTOMER")) {
            Role customerRole = new Role("CUSTOMER", "Customer role for regular users");
            roleRepository.save(customerRole);
        }

        // Tạo role STAFF nếu chưa có
        if (!roleRepository.existsByRoleName("STAFF")) {
            Role staffRole = new Role("STAFF", "Staff role for employees");
            roleRepository.save(staffRole);
        }

        // Tạo role CONSULTANT nếu chưa có
        if (!roleRepository.existsByRoleName("CONSULTANT")) {
            Role consultantRole = new Role("CONSULTANT", "Medical consultant role");
            roleRepository.save(consultantRole);
        }

        // Tạo role ADMIN nếu chưa có
        if (!roleRepository.existsByRoleName("ADMIN")) {
            Role adminRole = new Role("ADMIN", "Administrator role with full access");
            roleRepository.save(adminRole);
        }
    }
}
