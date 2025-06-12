package com.healapp.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.healapp.model.Role;
import com.healapp.repository.RoleRepository;

@Component
public class DataInitializerConfig implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializerConfig(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        // Kiểm tra và thêm role nếu chưa có
        if (roleRepository.findByRoleName("CUSTOMER").isEmpty()) {
            Role customerRole = new Role();
            customerRole.setRoleName("CUSTOMER");
            roleRepository.save(customerRole);
        }

        if (roleRepository.findByRoleName("STAFF").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setRoleName("STAFF");
            roleRepository.save(adminRole);
        }

        if (roleRepository.findByRoleName("CONSULTANT").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setRoleName("CONSULTANT");
            roleRepository.save(adminRole);
        }

        if (roleRepository.findByRoleName("ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setRoleName("ADMIN");
            roleRepository.save(adminRole);
        }
    }
}

