package com.healapp.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.healapp.model.BlogPost;
import com.healapp.model.BlogPostStatus;
import com.healapp.model.Category;
import com.healapp.model.CategoryQuestion;
import com.healapp.model.ConsultantProfile;
import com.healapp.model.Consultation;
import com.healapp.model.PackageService;
import com.healapp.model.Payment;
import com.healapp.model.PaymentInfo;
import com.healapp.model.Question;
import com.healapp.model.Rating;
import com.healapp.model.RatingSummary;
import com.healapp.model.Role;
import com.healapp.model.STIPackage;
import com.healapp.model.STIService;
import com.healapp.model.STITest;
import com.healapp.model.ServiceTestComponent;
import com.healapp.model.UserDtls;
import com.healapp.repository.BlogPostRepository;
import com.healapp.repository.CategoryQuestionRepository;
import com.healapp.repository.CategoryRepository;
import com.healapp.repository.ConsultantProfileRepository;
import com.healapp.repository.ConsultationRepository;
import com.healapp.repository.MenstrualCycleRepository;
import com.healapp.repository.PackageServiceRepository;
import com.healapp.repository.PaymentInfoRepository;
import com.healapp.repository.PaymentRepository;
import com.healapp.repository.QuestionRepository;
import com.healapp.repository.RatingRepository;
import com.healapp.repository.RatingSummaryRepository;
import com.healapp.repository.RoleRepository;
import com.healapp.repository.STIPackageRepository;
import com.healapp.repository.STIServiceRepository;
import com.healapp.repository.STITestRepository;
import com.healapp.repository.ServiceTestComponentRepository;
import com.healapp.repository.UserRepository;
import com.healapp.service.NotificationPreferenceService;

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
    private final PackageServiceRepository packageServiceRepository;
    private final NotificationPreferenceService notificationPreferenceService;

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
            RoleRepository roleRepository,
            PackageServiceRepository packageServiceRepository,
            NotificationPreferenceService notificationPreferenceService) {
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
        this.packageServiceRepository = packageServiceRepository;
        this.notificationPreferenceService = notificationPreferenceService;
    }

    @Override
    public void run(String... args) {
        // ROLES
        // Tạo roles trước nếu chưa có
        createRolesIfNotExists();

        // USER
        // Tạo user mặc định cho từng role
        if (userRepository.count() < 10) {
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
                customer1.setFullName("Nguyễn Văn An");
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

                // Tạo cài đặt thông báo cho customer1
                notificationPreferenceService.createDefaultNotificationPreferences(customer1.getId());
            }

            if (userRepository.count() < 2) {
                UserDtls customer2 = new UserDtls();
                customer2.setFullName("Trần Thị Bình");
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

                // Tạo cài đặt thông báo cho customer2
                notificationPreferenceService.createDefaultNotificationPreferences(customer2.getId());
            }

            // Tạo 1 tài khoản STAFF
            if (userRepository.count() < 3) {
                UserDtls staff = new UserDtls();
                staff.setFullName("Lê Văn Cao");
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

                // Tạo cài đặt thông báo cho staff
                notificationPreferenceService.createDefaultNotificationPreferences(staff.getId());
            }

            // Tạo 6 tài khoản CONSULTANT
            if (userRepository.count() < 4) {
                UserDtls consultant1 = new UserDtls();
                consultant1.setFullName("Dr. Phạm Thị Diệu Linh");
                consultant1.setUsername("consultant1");
                consultant1.setPassword(passwordEncoder.encode("Aa12345@"));
                consultant1.setEmail("consultant1@healapp.com");
                consultant1.setPhone("0900000004");
                consultant1.setIsActive(true);
                consultant1.setGender(com.healapp.model.Gender.FEMALE);
                consultant1.setBirthDay(java.time.LocalDate.of(1985, 8, 25));
                consultant1.setAddress("321 Đường JKL, Quận 4, TP.HCM");
                consultant1.setProvider(com.healapp.model.AuthProvider.LOCAL);
                consultant1.setCreatedDate(LocalDateTime.now());
                consultant1.setRole(consultantRole);
                userRepository.save(consultant1);

                // Tạo cài đặt thông báo cho consultant1
                notificationPreferenceService.createDefaultNotificationPreferences(consultant1.getId());
            }

            if (userRepository.count() < 5) {
                UserDtls consultant2 = new UserDtls();
                consultant2.setFullName("Dr. Nguyễn Minh Phương");
                consultant2.setUsername("consultant2");
                consultant2.setPassword(passwordEncoder.encode("Aa12345@"));
                consultant2.setEmail("consultant2@healapp.com");
                consultant2.setPhone("0900000005");
                consultant2.setIsActive(true);
                consultant2.setGender(com.healapp.model.Gender.MALE);
                consultant2.setBirthDay(java.time.LocalDate.of(1980, 3, 15));
                consultant2.setAddress("789 Đường PQR, Quận 7, TP.HCM");
                consultant2.setProvider(com.healapp.model.AuthProvider.LOCAL);
                consultant2.setCreatedDate(LocalDateTime.now());
                consultant2.setRole(consultantRole);
                userRepository.save(consultant2);

                // Tạo cài đặt thông báo cho consultant2
                notificationPreferenceService.createDefaultNotificationPreferences(consultant2.getId());
            }

            if (userRepository.count() < 6) {
                UserDtls consultant3 = new UserDtls();
                consultant3.setFullName("Dr. Lê Thị Gấm");
                consultant3.setUsername("consultant3");
                consultant3.setPassword(passwordEncoder.encode("Aa12345@"));
                consultant3.setEmail("consultant3@healapp.com");
                consultant3.setPhone("0900000006");
                consultant3.setIsActive(true);
                consultant3.setGender(com.healapp.model.Gender.FEMALE);
                consultant3.setBirthDay(java.time.LocalDate.of(1987, 11, 10));
                consultant3.setAddress("456 Đường STU, Quận 8, TP.HCM");
                consultant3.setProvider(com.healapp.model.AuthProvider.LOCAL);
                consultant3.setCreatedDate(LocalDateTime.now());
                consultant3.setRole(consultantRole);
                userRepository.save(consultant3);

                // Tạo cài đặt thông báo cho consultant3
                notificationPreferenceService.createDefaultNotificationPreferences(consultant3.getId());
            }

            if (userRepository.count() < 7) {
                UserDtls consultant4 = new UserDtls();
                consultant4.setFullName("Dr. Trần Văn Hoàng");
                consultant4.setUsername("consultant4");
                consultant4.setPassword(passwordEncoder.encode("Aa12345@"));
                consultant4.setEmail("consultant4@healapp.com");
                consultant4.setPhone("0900000007");
                consultant4.setIsActive(true);
                consultant4.setGender(com.healapp.model.Gender.MALE);
                consultant4.setBirthDay(java.time.LocalDate.of(1983, 6, 28));
                consultant4.setAddress("123 Đường VWX, Quận 9, TP.HCM");
                consultant4.setProvider(com.healapp.model.AuthProvider.LOCAL);
                consultant4.setCreatedDate(LocalDateTime.now());
                consultant4.setRole(consultantRole);
                userRepository.save(consultant4);
                // Tạo cài đặt thông báo cho consultant4
                notificationPreferenceService.createDefaultNotificationPreferences(consultant4.getId());
            }

            if (userRepository.count() < 8) {
                UserDtls consultant5 = new UserDtls();
                consultant5.setFullName("Dr. Võ Thị Sáu");
                consultant5.setUsername("consultant5");
                consultant5.setPassword(passwordEncoder.encode("Aa12345@"));
                consultant5.setEmail("consultant5@healapp.com");
                consultant5.setPhone("0900000008");
                consultant5.setIsActive(true);
                consultant5.setGender(com.healapp.model.Gender.FEMALE);
                consultant5.setBirthDay(java.time.LocalDate.of(1989, 9, 18));
                consultant5.setAddress("987 Đường YZ, Quận 10, TP.HCM");
                consultant5.setProvider(com.healapp.model.AuthProvider.LOCAL);
                consultant5.setCreatedDate(LocalDateTime.now());
                consultant5.setRole(consultantRole);
                userRepository.save(consultant5);
                // Tạo cài đặt thông báo cho consultant5
                notificationPreferenceService.createDefaultNotificationPreferences(consultant5.getId());
            }

            if (userRepository.count() < 9) {
                UserDtls consultant6 = new UserDtls();
                consultant6.setFullName("Dr. Đặng Minh Tâm");
                consultant6.setUsername("consultant6");
                consultant6.setPassword(passwordEncoder.encode("Aa12345@"));
                consultant6.setEmail("consultant6@healapp.com");
                consultant6.setPhone("0900000009");
                consultant6.setIsActive(true);
                consultant6.setGender(com.healapp.model.Gender.MALE);
                consultant6.setBirthDay(java.time.LocalDate.of(1982, 12, 3));
                consultant6.setAddress("654 Đường ABC, Quận 11, TP.HCM");
                consultant6.setProvider(com.healapp.model.AuthProvider.LOCAL);
                consultant6.setCreatedDate(LocalDateTime.now());
                consultant6.setRole(consultantRole);
                userRepository.save(consultant6);
                // Tạo cài đặt thông báo cho consultant6
                notificationPreferenceService.createDefaultNotificationPreferences(consultant6.getId());
            }

            // Tạo 1 tài khoản ADMIN
            if (userRepository.count() < 10) {
                UserDtls admin = new UserDtls();
                admin.setFullName("Admin System Management");
                admin.setUsername("admin1");
                admin.setPassword(passwordEncoder.encode("Aa12345@"));
                admin.setEmail("admin1@healapp.com");
                admin.setPhone("0900000010");
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

        // // BLOG_POSTS
        // createBlogPostsAndSectionsIfNotExists();

        // CONSULTANT_PROFILES
        createConsultantProfilesIfNotExists();

        // // CONSULTATIONS
        // createConsultationsIfNotExists();

        // // MENSTRUAL_CYCLE
        // createMenstrualCyclesIfNotExists();

        // PAYMENT_INFO
        createPaymentInfosIfNotExists();

        // PAYMENTS
        // createPaymentsIfNotExists();

        // QUESTIONS
        // createQuestionsIfNotExists();

        // RATING_SUMMARY
        // createRatingSummariesIfNotExists();

        // RATINGS
        // createRatingsIfNotExists();

        // SERVICE_TEST_COMPONENTS
        createServiceTestComponentsIfNotExists();

        // STI_PACKAGES
        createSTIPackagesIfNotExists();

        // STI_SERVICES
        createSTIServicesIfNotExists();

        // PACKAGE_SERVICES
        createPackageServicesIfNotExists();

        // STI_TESTS
        // createSTITestsIfNotExists();

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
            // HIV Testing Service
            STIService hivService = new STIService();
            hivService.setName("Xét nghiệm HIV");
            hivService.setDescription(
                    "Dịch vụ xét nghiệm HIV bao gồm test nhanh và test ELISA để phát hiện kháng thể HIV trong máu");
            hivService.setPrice(new java.math.BigDecimal("500000"));
            hivService.setIsActive(true);
            hivService.setCreatedAt(java.time.LocalDateTime.now());
            hivService.setUpdatedAt(java.time.LocalDateTime.now());
            stiServiceRepository.save(hivService);

            // HPV Testing Service
            STIService hpvService = new STIService();
            hpvService.setName("Xét nghiệm HPV");
            hpvService
                    .setDescription("Xét nghiệm HPV (Human Papillomavirus) để phát hiện virus gây ung thư cổ tử cung");
            hpvService.setPrice(new java.math.BigDecimal("400000"));
            hpvService.setIsActive(true);
            hpvService.setCreatedAt(java.time.LocalDateTime.now());
            hpvService.setUpdatedAt(java.time.LocalDateTime.now());
            stiServiceRepository.save(hpvService);

            // Syphilis Testing Service
            STIService syphilisService = new STIService();
            syphilisService.setName("Xét nghiệm giang mai (Syphilis)");
            syphilisService.setDescription("Xét nghiệm phát hiện vi khuẩn Treponema pallidum gây bệnh giang mai");
            syphilisService.setPrice(new java.math.BigDecimal("350000"));
            syphilisService.setIsActive(true);
            syphilisService.setCreatedAt(java.time.LocalDateTime.now());
            syphilisService.setUpdatedAt(java.time.LocalDateTime.now());
            stiServiceRepository.save(syphilisService);

            // Hepatitis B Testing Service
            STIService hepatitisBService = new STIService();
            hepatitisBService.setName("Xét nghiệm Viêm gan B");
            hepatitisBService.setDescription("Xét nghiệm HBsAg và các marker khác để phát hiện virus viêm gan B");
            hepatitisBService.setPrice(new java.math.BigDecimal("300000"));
            hepatitisBService.setIsActive(true);
            hepatitisBService.setCreatedAt(java.time.LocalDateTime.now());
            hepatitisBService.setUpdatedAt(java.time.LocalDateTime.now());
            stiServiceRepository.save(hepatitisBService);

            // Gonorrhea Testing Service
            STIService gonorrheaService = new STIService();
            gonorrheaService.setName("Xét nghiệm lậu (Gonorrhea)");
            gonorrheaService.setDescription("Xét nghiệm PCR để phát hiện vi khuẩn Neisseria gonorrhoeae gây bệnh lậu");
            gonorrheaService.setPrice(new java.math.BigDecimal("450000"));
            gonorrheaService.setIsActive(true);
            gonorrheaService.setCreatedAt(java.time.LocalDateTime.now());
            gonorrheaService.setUpdatedAt(java.time.LocalDateTime.now());
            stiServiceRepository.save(gonorrheaService);

            // Chlamydia Testing Service
            STIService chlamydiaService = new STIService();
            chlamydiaService.setName("Xét nghiệm Chlamydia");
            chlamydiaService.setDescription("Xét nghiệm PCR để phát hiện vi khuẩn Chlamydia trachomatis");
            chlamydiaService.setPrice(new java.math.BigDecimal("420000"));
            chlamydiaService.setIsActive(true);
            chlamydiaService.setCreatedAt(java.time.LocalDateTime.now());
            chlamydiaService.setUpdatedAt(java.time.LocalDateTime.now());
            stiServiceRepository.save(chlamydiaService);
        }
    }

    private void createSTIPackagesIfNotExists() {
        if (stiPackageRepository.count() == 0) {
            // Comprehensive STI Package
            STIPackage comprehensivePackage = new STIPackage();
            comprehensivePackage.setPackageName("Gói xét nghiệm STI toàn diện");
            comprehensivePackage.setDescription(
                    "Gói xét nghiệm bao gồm tất cả các xét nghiệm STI cơ bản: HIV, HPV, Syphilis, Hepatitis B, Gonorrhea, Chlamydia");
            comprehensivePackage.setPackagePrice(new java.math.BigDecimal("2000000"));
            comprehensivePackage.setIsActive(true);
            comprehensivePackage.setCreatedAt(java.time.LocalDateTime.now());
            comprehensivePackage.setUpdatedAt(java.time.LocalDateTime.now());
            stiPackageRepository.save(comprehensivePackage);

            // Basic STI Package
            STIPackage basicPackage = new STIPackage();
            basicPackage.setPackageName("Gói xét nghiệm STI cơ bản");
            basicPackage.setDescription("Gói xét nghiệm bao gồm các STI phổ biến: HIV, Syphilis, Hepatitis B");
            basicPackage.setPackagePrice(new java.math.BigDecimal("1200000"));
            basicPackage.setIsActive(true);
            basicPackage.setCreatedAt(java.time.LocalDateTime.now());
            basicPackage.setUpdatedAt(java.time.LocalDateTime.now());
            stiPackageRepository.save(basicPackage);

            // Women's STI Package
            STIPackage womensPackage = new STIPackage();
            womensPackage.setPackageName("Gói xét nghiệm STI cho phụ nữ");
            womensPackage.setDescription("Gói xét nghiệm chuyên biệt cho phụ nữ: HPV, Chlamydia, Gonorrhea, HIV");
            womensPackage.setPackagePrice(new java.math.BigDecimal("1500000"));
            womensPackage.setIsActive(true);
            womensPackage.setCreatedAt(java.time.LocalDateTime.now());
            womensPackage.setUpdatedAt(java.time.LocalDateTime.now());
            stiPackageRepository.save(womensPackage);

            // Quick STI Package
            STIPackage quickPackage = new STIPackage();
            quickPackage.setPackageName("Gói xét nghiệm STI nhanh");
            quickPackage.setDescription("Gói xét nghiệm nhanh cho những người cần kết quả trong ngày: HIV, Syphilis");
            quickPackage.setPackagePrice(new java.math.BigDecimal("800000"));
            quickPackage.setIsActive(true);
            quickPackage.setCreatedAt(java.time.LocalDateTime.now());
            quickPackage.setUpdatedAt(java.time.LocalDateTime.now());
            stiPackageRepository.save(quickPackage);

            // Annual STI Package
            STIPackage annualPackage = new STIPackage();
            annualPackage.setPackageName("Gói xét nghiệm STI hàng năm");
            annualPackage.setDescription("Gói xét nghiệm định kỳ hàng năm bao gồm tất cả các STI và tư vấn sức khỏe");
            annualPackage.setPackagePrice(new java.math.BigDecimal("2500000"));
            annualPackage.setIsActive(true);
            annualPackage.setCreatedAt(java.time.LocalDateTime.now());
            annualPackage.setUpdatedAt(java.time.LocalDateTime.now());
            stiPackageRepository.save(annualPackage);
        }
    }

    private void createServiceTestComponentsIfNotExists() {
        if (serviceTestComponentRepository.count() == 0 && stiServiceRepository.count() > 0) {
            // Lấy các STI services đã tạo
            java.util.List<STIService> services = stiServiceRepository.findAll();

            // Tạo test components cho HIV Service
            if (services.size() > 0) {
                STIService hivService = services.get(0); // Service đầu tiên là HIV

                // HIV Antibody Test
                ServiceTestComponent hivAntibody = new ServiceTestComponent();
                hivAntibody.setStiService(hivService);
                hivAntibody.setTestName("Kháng thể HIV (Anti-HIV)");
                hivAntibody.setUnit("COI");
                hivAntibody.setReferenceRange("< 1.0");
                hivAntibody.setInterpretation("Âm tính: < 1.0 COI, Dương tính: ≥ 1.0 COI");
                hivAntibody.setSampleType("Máu tĩnh mạch");
                hivAntibody.setIsActive(true);
                hivAntibody.setCreatedAt(java.time.LocalDateTime.now());
                hivAntibody.setUpdatedAt(java.time.LocalDateTime.now());
                serviceTestComponentRepository.save(hivAntibody);

                // HIV Antigen Test
                ServiceTestComponent hivAntigen = new ServiceTestComponent();
                hivAntigen.setStiService(hivService);
                hivAntigen.setTestName("Kháng nguyên HIV p24");
                hivAntigen.setUnit("pg/mL");
                hivAntigen.setReferenceRange("< 5.0");
                hivAntigen.setInterpretation("Âm tính: < 5.0 pg/mL, Dương tính: ≥ 5.0 pg/mL");
                hivAntigen.setSampleType("Máu tĩnh mạch");
                hivAntigen.setIsActive(true);
                hivAntigen.setCreatedAt(java.time.LocalDateTime.now());
                hivAntigen.setUpdatedAt(java.time.LocalDateTime.now());
                serviceTestComponentRepository.save(hivAntigen);
            }

            // Tạo test components cho HPV Service
            if (services.size() > 1) {
                STIService hpvService = services.get(1); // Service thứ hai là HPV

                // HPV DNA Test
                ServiceTestComponent hpvDna = new ServiceTestComponent();
                hpvDna.setStiService(hpvService);
                hpvDna.setTestName("HPV DNA (High-risk types)");
                hpvDna.setUnit("Copies/mL");
                hpvDna.setReferenceRange("Không phát hiện");
                hpvDna.setInterpretation("Âm tính: Không phát hiện HPV, Dương tính: Phát hiện HPV");
                hpvDna.setSampleType("Dịch cổ tử cung");
                hpvDna.setIsActive(true);
                hpvDna.setCreatedAt(java.time.LocalDateTime.now());
                hpvDna.setUpdatedAt(java.time.LocalDateTime.now());
                serviceTestComponentRepository.save(hpvDna);

                // HPV Genotyping
                ServiceTestComponent hpvGenotype = new ServiceTestComponent();
                hpvGenotype.setStiService(hpvService);
                hpvGenotype.setTestName("HPV Genotyping (16, 18, 31, 33, 45, 52, 58)");
                hpvGenotype.setUnit("Định tính");
                hpvGenotype.setReferenceRange("Âm tính");
                hpvGenotype.setInterpretation("Âm tính: Không phát hiện, Dương tính: Xác định type HPV");
                hpvGenotype.setSampleType("Dịch cổ tử cung");
                hpvGenotype.setIsActive(true);
                hpvGenotype.setCreatedAt(java.time.LocalDateTime.now());
                hpvGenotype.setUpdatedAt(java.time.LocalDateTime.now());
                serviceTestComponentRepository.save(hpvGenotype);
            }

            // Tạo test components cho Syphilis Service
            if (services.size() > 2) {
                STIService syphilisService = services.get(2); // Service thứ ba là Syphilis

                // Syphilis VDRL Test
                ServiceTestComponent syphilisVdrl = new ServiceTestComponent();
                syphilisVdrl.setStiService(syphilisService);
                syphilisVdrl.setTestName("VDRL (Venereal Disease Research Laboratory)");
                syphilisVdrl.setUnit("Titer");
                syphilisVdrl.setReferenceRange("Non-reactive");
                syphilisVdrl.setInterpretation("Non-reactive: Âm tính, Reactive: Dương tính (cần xác nhận)");
                syphilisVdrl.setSampleType("Máu tĩnh mạch");
                syphilisVdrl.setIsActive(true);
                syphilisVdrl.setCreatedAt(java.time.LocalDateTime.now());
                syphilisVdrl.setUpdatedAt(java.time.LocalDateTime.now());
                serviceTestComponentRepository.save(syphilisVdrl);

                // Syphilis TPHA Test
                ServiceTestComponent syphilisTpha = new ServiceTestComponent();
                syphilisTpha.setStiService(syphilisService);
                syphilisTpha.setTestName("TPHA (Treponema pallidum Hemagglutination)");
                syphilisTpha.setUnit("Titer");
                syphilisTpha.setReferenceRange("Non-reactive");
                syphilisTpha.setInterpretation("Non-reactive: Âm tính, Reactive: Dương tính (xác nhận nhiễm)");
                syphilisTpha.setSampleType("Máu tĩnh mạch");
                syphilisTpha.setIsActive(true);
                syphilisTpha.setCreatedAt(java.time.LocalDateTime.now());
                syphilisTpha.setUpdatedAt(java.time.LocalDateTime.now());
                serviceTestComponentRepository.save(syphilisTpha);
            }

            // Tạo test components cho Hepatitis B Service
            if (services.size() > 3) {
                STIService hepatitisBService = services.get(3); // Service thứ tư là Hepatitis B

                // HBsAg Test
                ServiceTestComponent hbsAg = new ServiceTestComponent();
                hbsAg.setStiService(hepatitisBService);
                hbsAg.setTestName("HBsAg (Hepatitis B Surface Antigen)");
                hbsAg.setUnit("COI");
                hbsAg.setReferenceRange("< 1.0");
                hbsAg.setInterpretation("Âm tính: < 1.0 COI, Dương tính: ≥ 1.0 COI");
                hbsAg.setSampleType("Máu tĩnh mạch");
                hbsAg.setIsActive(true);
                hbsAg.setCreatedAt(java.time.LocalDateTime.now());
                hbsAg.setUpdatedAt(java.time.LocalDateTime.now());
                serviceTestComponentRepository.save(hbsAg);

                // Anti-HBs Test
                ServiceTestComponent antiHbs = new ServiceTestComponent();
                antiHbs.setStiService(hepatitisBService);
                antiHbs.setTestName("Anti-HBs (Hepatitis B Surface Antibody)");
                antiHbs.setUnit("mIU/mL");
                antiHbs.setReferenceRange("≥ 10.0");
                antiHbs.setInterpretation("< 10.0: Không miễn dịch, ≥ 10.0: Có miễn dịch");
                antiHbs.setSampleType("Máu tĩnh mạch");
                antiHbs.setIsActive(true);
                antiHbs.setCreatedAt(java.time.LocalDateTime.now());
                antiHbs.setUpdatedAt(java.time.LocalDateTime.now());
                serviceTestComponentRepository.save(antiHbs);
            }
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
            // Lấy tất cả users có role CONSULTANT
            java.util.List<UserDtls> consultants = userRepository.findByRoleName("CONSULTANT");

            for (int i = 0; i < consultants.size(); i++) {
                UserDtls consultant = consultants.get(i);
                ConsultantProfile cp = new ConsultantProfile();
                cp.setUser(consultant);

                // Tạo profile chi tiết cho từng consultant
                switch (i) {
                    case 0: // Dr. Phạm Thị D
                        cp.setQualifications("Bác sĩ Chuyên khoa II Sản phụ khoa, Thạc sĩ Y học");
                        cp.setExperience("15 năm kinh nghiệm trong lĩnh vực sức khỏe sinh sản phụ nữ");
                        cp.setBio(
                                "Chuyên gia hàng đầu về sức khỏe phụ nữ, tư vấn về các vấn đề sinh sản và nội tiết tố");
                        break;
                    case 1: // Dr. Nguyễn Minh F
                        cp.setQualifications("Bác sĩ Chuyên khoa I Da liễu, Chứng chỉ STI/HIV");
                        cp.setExperience("12 năm kinh nghiệm điều trị các bệnh lây truyền qua đường tình dục");
                        cp.setBio("Chuyên gia về STI, HIV và các bệnh da liễu, tư vấn phòng chống bệnh lây nhiễm");
                        break;
                    case 2: // Dr. Lê Thị G
                        cp.setQualifications("Bác sĩ Chuyên khoa I Tâm lý lâm sàng, Tiến sĩ Tâm lý học");
                        cp.setExperience("10 năm kinh nghiệm tư vấn tâm lý về giới tính và sức khỏe tinh thần");
                        cp.setBio("Chuyên gia tâm lý, tư vấn về các vấn đề giới tính, tình dục và sức khỏe tinh thần");
                        break;
                    case 3: // Dr. Trần Văn H
                        cp.setQualifications("Bác sĩ Chuyên khoa I Tiết niệu, Chứng chỉ Andrologia");
                        cp.setExperience("14 năm kinh nghiệm điều trị các bệnh nam khoa và tiết niệu");
                        cp.setBio("Chuyên gia nam khoa, tư vấn về sức khỏe sinh sản nam giới và rối loạn tình dục");
                        break;
                    case 4: // Dr. Võ Thị I
                        cp.setQualifications("Bác sĩ Chuyên khoa I Nội tiết, Thạc sĩ Dinh dưỡng");
                        cp.setExperience("8 năm kinh nghiệm về nội tiết sinh sản và dinh dưỡng sức khỏe");
                        cp.setBio("Chuyên gia nội tiết, tư vấn về hormone, chu kỳ kinh nguyệt và dinh dưỡng");
                        break;
                    case 5: // Dr. Đặng Minh J
                        cp.setQualifications("Bác sĩ Chuyên khoa I Nhiễm khuẩn, Chứng chỉ HIV/AIDS");
                        cp.setExperience("11 năm kinh nghiệm điều trị các bệnh nhiễm khuẩn và HIV");
                        cp.setBio("Chuyên gia nhiễm khuẩn, tư vấn điều trị HIV, STI và các bệnh nhiễm trùng");
                        break;
                    default:
                        cp.setQualifications("Bác sĩ Chuyên khoa I");
                        cp.setExperience("5+ năm kinh nghiệm tư vấn sức khỏe");
                        cp.setBio("Bác sĩ chuyên nghiệp, tận tâm với bệnh nhân");
                        break;
                }

                cp.setCreatedAt(java.time.LocalDateTime.now());
                cp.setUpdatedAt(java.time.LocalDateTime.now());
                consultantProfileRepository.save(cp);
            }
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

            Category c4 = new Category();
            c4.setName("Khác");
            c4.setDescription("Các bài viết về các vấn đề khác liên quan đến sức khỏe");
            c4.setIsActive(true);
            categoryRepository.save(c1);
            categoryRepository.save(c2);
            categoryRepository.save(c3);
            categoryRepository.save(c4);
        }
    }

    private void createPaymentsIfNotExists() {
        if (paymentRepository.count() == 0 && userRepository.count() > 0) {
            Payment p1 = new Payment();
            p1.setUser(userRepository.findAll().get(0)); // Sửa: truyền UserDtls thay vì id
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
            pi1.setUser(userRepository.findAll().get(0)); // Sửa: truyền UserDtls thay vì id
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
                p.setUser(userRepository.findAll().get(i % (int) userRepository.count())); // Sửa: truyền UserDtls thay vì id
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
                pi.setUser(userRepository.findAll().get(i % (int) userRepository.count())); // Sửa: truyền UserDtls thay vì id
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

    private void createPackageServicesIfNotExists() {
        if (packageServiceRepository.count() == 0 && stiPackageRepository.count() > 0
                && stiServiceRepository.count() > 0) {
            // Lấy danh sách packages và services
            java.util.List<STIPackage> packages = stiPackageRepository.findAll();
            java.util.List<STIService> services = stiServiceRepository.findAll();

            if (packages.size() >= 5 && services.size() >= 6) {
                // Gói toàn diện - Package 1 (index 0)
                STIPackage comprehensivePackage = packages.get(0);
                // Bao gồm tất cả services: HIV, HPV, Syphilis, Hepatitis B, Gonorrhea,
                // Chlamydia
                for (int i = 0; i < 6; i++) {
                    PackageService ps = new PackageService();
                    ps.setStiPackage(comprehensivePackage);
                    ps.setStiService(services.get(i));
                    ps.setCreatedAt(java.time.LocalDateTime.now());
                    packageServiceRepository.save(ps);
                }

                // Gói cơ bản - Package 2 (index 1)
                STIPackage basicPackage = packages.get(1);
                // Bao gồm: HIV (0), Syphilis (2), Hepatitis B (3)
                int[] basicServices = { 0, 2, 3 };
                for (int serviceIndex : basicServices) {
                    PackageService ps = new PackageService();
                    ps.setStiPackage(basicPackage);
                    ps.setStiService(services.get(serviceIndex));
                    ps.setCreatedAt(java.time.LocalDateTime.now());
                    packageServiceRepository.save(ps);
                }

                // Gói cho phụ nữ - Package 3 (index 2)
                STIPackage womensPackage = packages.get(2);
                // Bao gồm: HPV (1), Chlamydia (5), Gonorrhea (4), HIV (0)
                int[] womensServices = { 0, 1, 4, 5 };
                for (int serviceIndex : womensServices) {
                    PackageService ps = new PackageService();
                    ps.setStiPackage(womensPackage);
                    ps.setStiService(services.get(serviceIndex));
                    ps.setCreatedAt(java.time.LocalDateTime.now());
                    packageServiceRepository.save(ps);
                }

                // Gói nhanh - Package 4 (index 3)
                STIPackage quickPackage = packages.get(3);
                // Bao gồm: HIV (0), Syphilis (2)
                int[] quickServices = { 0, 2 };
                for (int serviceIndex : quickServices) {
                    PackageService ps = new PackageService();
                    ps.setStiPackage(quickPackage);
                    ps.setStiService(services.get(serviceIndex));
                    ps.setCreatedAt(java.time.LocalDateTime.now());
                    packageServiceRepository.save(ps);
                }

                // Gói hàng năm - Package 5 (index 4)
                STIPackage annualPackage = packages.get(4);
                // Bao gồm tất cả services như gói toàn diện
                for (int i = 0; i < 6; i++) {
                    PackageService ps = new PackageService();
                    ps.setStiPackage(annualPackage);
                    ps.setStiService(services.get(i));
                    ps.setCreatedAt(java.time.LocalDateTime.now());
                    packageServiceRepository.save(ps);
                }
            }
        }
    }
}
