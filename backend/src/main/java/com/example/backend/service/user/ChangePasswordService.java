package com.example.backend.service.user;

import com.example.backend.dto.ChangePasswordDTO;
import com.example.backend.exception.OperationType;
import com.example.backend.exception.TokenException;
import com.example.backend.exception.UserException;
import com.example.backend.model.User;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenProvider;
import com.example.backend.security.TokenDetails;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ChangePasswordService extends BaseUserService{
    @Autowired
    public ChangePasswordService(UserRepository userRepository, RoleRepository roleRepository, CompanyRepository companyRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        super(userRepository, roleRepository, companyRepository, passwordEncoder, jwtTokenProvider);
    }

    public void changeFirstLoginPassword(HttpServletRequest request, ChangePasswordDTO changePasswordDTO){
        String token = jwtTokenProvider.getJwtFromCookies(request);
        if(token == null || !jwtTokenProvider.validateToken(token)){
            throw new TokenException("Invalid or missing token.", OperationType.RETRIEVAL);
        }

        TokenDetails tokenDetails = jwtTokenProvider.decodeToken(token);
        if(!isValidPassword(changePasswordDTO.getNewPassword())){
            throw new UserException("Password does not meet the requirements. It must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.", OperationType.CREATION, tokenDetails.getRole());
        }

        User user = userRepository.findById(tokenDetails.getUserId())
                .orElseThrow(() -> new UserException("User not found.", OperationType.RETRIEVAL, tokenDetails.getRole()));

        if (!user.isFirstLogin()) {
            throw new UserException("Password change is not allowed. The user has already changed their password.", OperationType.UPDATE, tokenDetails.getRole());
        }

        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
            throw new UserException("Current password is incorrect.", OperationType.UPDATE, tokenDetails.getRole());
        }

        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        user.setFirstLogin(false);

        try{
            userRepository.save(user);
        }catch(RuntimeException ex){
            throw new UserException("Failed to update user password due to an error: " + ex.getMessage(), OperationType.UPDATE, tokenDetails.getRole());
        }
    }
}
