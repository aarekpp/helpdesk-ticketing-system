package com.example.backend.config;

import com.example.backend.exception.FileException;
import com.example.backend.exception.OperationType;
import com.example.backend.exception.RoleException;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeAdminAccount();
        initializeFileDirectories();
    }

    private void initializeRoles(){
        List<String> requiredRoles = List.of("ADMIN", "EMPLOYEE", "CLIENT");
        requiredRoles.forEach(roleName -> {
            if(roleRepository.findByName(roleName).isEmpty()){
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }
        });
    }

    private void initializeAdminAccount(){
        Role adminRole = roleRepository.findByName("ADMIN").orElseThrow(() -> new RoleException("Failed to get role"));
        if(userRepository.findByRole(adminRole).isEmpty()){
            User admin = new User();
            admin.setFirstName("admin");
            admin.setLastName("admin");
            admin.setEmail("admin@company.com");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("ZAQ!2wsx"));
            admin.setRole(adminRole);
            userRepository.save(admin);
        }
    }

    private void initializeFileDirectories() {
        Path uploadDirectory = Paths.get("uploads");
        Path ticketsDirectory = uploadDirectory.resolve("tickets");
        Path chatsDirectory = uploadDirectory.resolve("chats");
        try {
            if (!Files.exists(uploadDirectory)) {
                Files.createDirectories(uploadDirectory);
            }
            if (!Files.exists(ticketsDirectory)) {
                Files.createDirectories(ticketsDirectory);
            }
            if (!Files.exists(chatsDirectory)) {
                Files.createDirectories(chatsDirectory);
            }
        } catch (IOException ex) {
            throw new FileException("Could not initialize directories: " + ex.getMessage(), OperationType.CREATION);
        }
    }

}
