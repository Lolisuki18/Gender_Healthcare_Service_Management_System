package com.healapp.config;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.healapp.model.CategoryQuestion;
import com.healapp.model.Role;
import com.healapp.model.UserDtls;
import com.healapp.repository.CategoryQuestionRepository;
import com.healapp.repository.RoleRepository;
import com.healapp.repository.UserRepository;

@Component
public class DataInitializerConfig implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryQuestionRepository categoryQuestionRepository;

    public DataInitializerConfig(RoleRepository roleRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder, CategoryQuestionRepository categoryQuestionRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoryQuestionRepository = categoryQuestionRepository;
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
        System.out.println("Category question already exists.");
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
}
