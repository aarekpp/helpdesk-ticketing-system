package com.example.backend.service.user;

import com.example.backend.dto.user.admin.AdminRequestDTO;
import com.example.backend.dto.user.admin.AdminResponseDTO;
import com.example.backend.exception.OperationType;
import com.example.backend.exception.RoleException;
import com.example.backend.exception.UserException;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenProvider;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService extends BaseUserService{
    @Autowired
    public AdminService(UserRepository userRepository, RoleRepository roleRepository, CompanyRepository companyRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        super(userRepository, roleRepository, companyRepository, passwordEncoder, jwtTokenProvider);
    }

    @Transactional
    public User createAdmin(AdminRequestDTO adminRequestDTO){
        if(userRepository.existsByEmail(adminRequestDTO.getEmail())){
            throw new UserException("Email is already in use.", OperationType.CREATION, "ADMIN");
        }

        if(userRepository.existsByUsername(adminRequestDTO.getUsername())){
            throw new UserException("Username is already in use.", OperationType.CREATION, "ADMIN");
        }

        Role adminRole = roleRepository.findByName("ADMIN").orElseThrow(() -> new RoleException("Failed to get role"));
        User admin = new User();
        admin.setFirstName(adminRequestDTO.getFirstName());
        admin.setLastName(adminRequestDTO.getLastName());
        admin.setUsername(adminRequestDTO.getUsername());
        admin.setEmail(adminRequestDTO.getEmail());
        admin.setRole(adminRole);

        if(adminRequestDTO.getPassword() == null || !isValidPassword(adminRequestDTO.getPassword())){
            throw new UserException("Password does not meet the requirements. It must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.", OperationType.CREATION, "ADMIN");
        }

        admin.setPassword(passwordEncoder.encode(adminRequestDTO.getPassword()));

        try{
            return userRepository.save(admin);
        }catch(RuntimeException ex){
            throw new UserException("Failed to create user due to an error: " + ex.getMessage(), OperationType.CREATION, "ADMIN");
        }
    }

    @Transactional
    public User updateAdmin(Long id, AdminRequestDTO adminRequestDTO){
        User existingAdmin = getUserByIdAndRole(id, "ADMIN");

        if(!existingAdmin.getEmail().equals(adminRequestDTO.getEmail()) && userRepository.existsByEmail(adminRequestDTO.getEmail())){
            throw new UserException("Email is already in use.", OperationType.UPDATE, "ADMIN");
        }

        if (!existingAdmin.getUsername().equals(adminRequestDTO.getUsername()) && userRepository.existsByUsername(adminRequestDTO.getUsername())) {
            throw new UserException("Username is already in use.", OperationType.UPDATE, "ADMIN");
        }

        existingAdmin.setFirstName(adminRequestDTO.getFirstName());
        existingAdmin.setLastName(adminRequestDTO.getLastName());
        existingAdmin.setUsername(adminRequestDTO.getUsername());
        existingAdmin.setEmail(adminRequestDTO.getEmail());

        if (adminRequestDTO.getPassword() != null && !adminRequestDTO.getPassword().isEmpty()) {
            if (!isValidPassword(adminRequestDTO.getPassword())) {
                throw new UserException("Password does not meet the requirements. It must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.", OperationType.UPDATE, "ADMIN");
            }
            existingAdmin.setPassword(passwordEncoder.encode(adminRequestDTO.getPassword()));
        }

        try{
            return userRepository.save(existingAdmin);
        }catch(RuntimeException ex){
            throw new UserException("Failed to update user due to an error: " + ex.getMessage(), OperationType.UPDATE, "ADMIN");
        }
    }

    @Transactional
    public void deleteAdmin(Long id){
        User admin = getUserByIdAndRole(id, "ADMIN");

        try {
            userRepository.delete(admin);
        } catch (EmptyResultDataAccessException ex) {
            throw new UserException("Admin with ID " + id + " does not exist.", OperationType.DELETION, "ADMIN");
        } catch (DataIntegrityViolationException ex) {
            throw new UserException("Cannot delete admin with ID " + id + " due to related data integrity constraints.", OperationType.DELETION, "ADMIN");
        } catch (Exception ex) {
            throw new UserException("Failed to delete user due to an error: " + ex.getMessage(), OperationType.DELETION, "ADMIN");
        }
    }
}
