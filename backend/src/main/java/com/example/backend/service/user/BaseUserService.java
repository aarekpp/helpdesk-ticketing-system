package com.example.backend.service.user;

import com.example.backend.exception.OperationType;
import com.example.backend.exception.UserException;
import com.example.backend.model.User;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

public abstract class BaseUserService {
    protected final UserRepository userRepository;
    protected final RoleRepository roleRepository;
    protected final CompanyRepository companyRepository;
    protected final PasswordEncoder passwordEncoder;
    protected final JwtTokenProvider jwtTokenProvider;


    @Autowired
    public BaseUserService(UserRepository userRepository, RoleRepository roleRepository, CompanyRepository companyRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.companyRepository = companyRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public List<User> getAllUsersByRole(String role){
        return userRepository.findByRole_Name(role);
    }

    public User getUserByIdAndRole(Long id, String role){
        return userRepository.findByIdAndRole_Name(id, role).orElseThrow(() -> new UserException("Not found", OperationType.GET, role));
    }

    public boolean isValidPassword(String password) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$";
        return password.matches(regex);
    }
}
