package com.healapp.config;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.healapp.model.CategoryQuestion;
import com.healapp.model.Role;
import com.healapp.model.UserDtls;
import com.healapp.model.STIPackage;
import com.healapp.model.STIService;
import com.healapp.model.Question;
import com.healapp.model.Rating;
import com.healapp.model.ConsultantProfile;
import com.healapp.model.ServiceTestComponent;
import com.healapp.model.PackageService;
import com.healapp.repository.CategoryQuestionRepository;
import com.healapp.repository.RoleRepository;
import com.healapp.repository.UserRepository;
import com.healapp.repository.STIPackageRepository;
import com.healapp.repository.STIServiceRepository;
import com.healapp.repository.QuestionRepository;
import com.healapp.repository.RatingRepository;
import com.healapp.repository.ConsultantProfileRepository;
import com.healapp.repository.ServiceTestComponentRepository;
import com.healapp.repository.PackageServiceRepository;

@Component
public class DataInitializerConfig implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryQuestionRepository categoryQuestionRepository;
    private final STIPackageRepository stiPackageRepository;
    private final STIServiceRepository stiServiceRepository;
    private final QuestionRepository questionRepository;
    private final RatingRepository ratingRepository;
    private final ConsultantProfileRepository consultantProfileRepository;
    private final ServiceTestComponentRepository serviceTestComponentRepository;
    private final PackageServiceRepository packageServiceRepository;

    public DataInitializerConfig(RoleRepository roleRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder, CategoryQuestionRepository categoryQuestionRepository,
            STIPackageRepository stiPackageRepository, STIServiceRepository stiServiceRepository,
            QuestionRepository questionRepository, RatingRepository ratingRepository,
            ConsultantProfileRepository consultantProfileRepository,
            ServiceTestComponentRepository serviceTestComponentRepository,
            PackageServiceRepository packageServiceRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoryQuestionRepository = categoryQuestionRepository;
        this.stiPackageRepository = stiPackageRepository;
        this.stiServiceRepository = stiServiceRepository;
        this.questionRepository = questionRepository;
        this.ratingRepository = ratingRepository;
        this.consultantProfileRepository = consultantProfileRepository;
        this.serviceTestComponentRepository = serviceTestComponentRepository;
        this.packageServiceRepository = packageServiceRepository;
    }

    @Override
    public void run(String... args) {
        // Tạo roles nếu chưa có
        createRoleIfNotExists("CUSTOMER");
        createRoleIfNotExists("STAFF");
        createRoleIfNotExists("CONSULTANT");
        createRoleIfNotExists("ADMIN");

        // Tạo admin mặc định nếu chưa có
        String defaultAdminUsername = "admin123";
        if (userRepository.findByUsername(defaultAdminUsername).isEmpty()) {
            Optional<Role> adminRoleOpt = roleRepository.findByRoleName("ADMIN");
            if (adminRoleOpt.isPresent()) {
                UserDtls admin = new UserDtls();
                admin.setFullName("System Administrator");
                admin.setUsername(defaultAdminUsername);
                admin.setPassword(passwordEncoder.encode("Admin123@")); // Đặt mật khẩu mặc định
                admin.setEmail("admin@healapp.com");
                admin.setPhone("0123456789");
                admin.setRole(adminRoleOpt.get());
                admin.setIsActive(true);
                admin.setCreatedDate(LocalDateTime.now());

                userRepository.save(admin);
            } else {
                System.out.println("Admin role does not exist. Please create the ADMIN role first.");
            }
        } else {
            System.out.println("Admin account already exists.");
        }

        // Tạo dữ liệu mẫu cho bảng category_questions nếu chưa có
        createCategoryQuestionsIfNotExists();
        createSTIServicesIfNotExists();
        createSTIPackagesIfNotExists();
        createServiceTestComponentsIfNotExists();
        createQuestionsIfNotExists();
        createRatingsIfNotExists();
        createConsultantProfilesIfNotExists();
        createPackageServicesIfNotExists();
        System.out.println("Sample data for all main tables created if not exists.");
    }

    private void createRoleIfNotExists(String roleName) {
        if (roleRepository.findByRoleName(roleName).isEmpty()) {
            Role role = new Role();
            role.setRoleName(roleName);
            role.setCreatedAt(LocalDateTime.now());
            role.setUpdatedAt(LocalDateTime.now());
            roleRepository.save(role);
        }
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

    private void createPackageServicesIfNotExists() {
        if (packageServiceRepository.count() == 0 && stiPackageRepository.count() > 0
                && stiServiceRepository.count() > 0) {
            PackageService ps = new PackageService();
            ps.setStiPackage(stiPackageRepository.findAll().get(0));
            ps.setStiService(stiServiceRepository.findAll().get(0));
            ps.setCreatedAt(java.time.LocalDateTime.now());
            packageServiceRepository.save(ps);
        }
    }
}
