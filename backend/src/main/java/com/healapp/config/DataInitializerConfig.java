package com.healapp.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.healapp.model.Role;
import com.healapp.model.UserDtls;
import com.healapp.repository.RoleRepository;
import com.healapp.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class DataInitializerConfig implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializerConfig(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
}
