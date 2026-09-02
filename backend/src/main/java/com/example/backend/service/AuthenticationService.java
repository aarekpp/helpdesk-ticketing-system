package com.example.backend.service;

import com.example.backend.exception.OperationType;
import com.example.backend.exception.TokenException;
import com.example.backend.exception.UserException;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.dto.AuthenticationDTO;
import com.example.backend.security.JwtTokenProvider;
import com.example.backend.security.TokenDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklistService tokenBlacklistService;

    @Autowired
    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, TokenBlacklistService tokenBlacklistService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    public AuthenticationDTO authenticateUser(String username, String password, HttpServletRequest request){
        return userRepository.findByUsername(username)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> {
                    String oldToken = jwtTokenProvider.getJwtFromCookies(request);

                    if(oldToken != null && jwtTokenProvider.validateToken(oldToken)){
                        LocalDateTime expiryTime = jwtTokenProvider.getExpiryFromToken(oldToken);
                        tokenBlacklistService.blacklistToken(oldToken, expiryTime);
                    }

                    String newToken = jwtTokenProvider.generateToken(user.getId(), user.getRole());
                    Boolean isFirstLogin = user.isFirstLogin();
                    return new AuthenticationDTO(newToken, user.getRole().getName(), isFirstLogin, user.getId());
                })
                .orElseThrow(() -> new UserException("Invalid username or password.", OperationType.RETRIEVAL, "USER"));
    }

    public boolean checkIsFirstLogin(Long id){
        return userRepository.findById(id)
                .map(User::isFirstLogin)
                .orElseThrow(() -> new UserException("User not found.", OperationType.RETRIEVAL, "USER"));
    }

    public void addTokenToResponse(HttpServletResponse response, String token) {
        String cookieValue = "TOKEN=" + token + "; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=" + (24 * 60 * 60);
        response.addHeader("Set-Cookie", cookieValue);
    }

    public Map<String, Object> verifyToken(HttpServletRequest request, HttpServletResponse response) {
        String token = jwtTokenProvider.getJwtFromCookies(request);
        if (token != null && jwtTokenProvider.validateToken(token)) {
            TokenDetails tokenDetails = jwtTokenProvider.decodeToken(token);
            boolean isFirstLogin = checkIsFirstLogin(tokenDetails.getUserId());
            return Map.of("role", tokenDetails.getRole(), "isFirstLogin", isFirstLogin, "userId", tokenDetails.getUserId());
        } else {
            clearTokenCookie(response);
            return null;
        }
    }

    public boolean logout(HttpServletRequest request, HttpServletResponse response) {
        String token = jwtTokenProvider.getJwtFromCookies(request);
        if (token != null && jwtTokenProvider.validateToken(token)) {
            LocalDateTime expiryTime = jwtTokenProvider.getExpiryFromToken(token);
            tokenBlacklistService.blacklistToken(token, expiryTime);
            clearTokenCookie(response);
            return true;
        }
        throw new TokenException("Invalid token, unable to logout.", OperationType.UPDATE);
    }

    private void clearTokenCookie(HttpServletResponse response) {
        String cookieValue = "TOKEN=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0";
        response.addHeader("Set-Cookie", cookieValue);
    }

    public User getCurrentUser(HttpServletRequest request){
        String token = jwtTokenProvider.getJwtFromCookies(request);

        if(token != null && jwtTokenProvider.validateToken(token)){
            TokenDetails tokenDetails = jwtTokenProvider.decodeToken(token);
            return userRepository.findById(tokenDetails.getUserId()).orElseThrow(() -> new UserException("User not found.", OperationType.GET, "USER"));
        }else{
            throw new TokenException("Invalid or missing token.", OperationType.RETRIEVAL);
        }
    }

    public boolean isEmployee(User user) {
        return "EMPLOYEE".equals(user.getRole().getName());
    }

    public boolean isCurrentUserEmployee(HttpServletRequest request) {
        User currentUser = getCurrentUser(request);
        return isEmployee(currentUser);
    }
}