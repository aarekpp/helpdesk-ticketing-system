package com.example.backend.controller;

import com.example.backend.config.ApiResponse;
import com.example.backend.dto.SignInDTO;
import com.example.backend.dto.AuthenticationDTO;
import com.example.backend.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<Map<String, Object>>> authenticateUser(HttpServletRequest request, HttpServletResponse response, @Valid  @RequestBody SignInDTO signInDTO) {
        AuthenticationDTO authenticationDTO = authenticationService.authenticateUser(signInDTO.getUsername(), signInDTO.getPassword(), request);
        authenticationService.addTokenToResponse(response, authenticationDTO.getToken());

        Map<String, Object> responseBody = Map.of(
                "role", authenticationDTO.getRole(),
                "isFirstLogin", authenticationDTO.getIsFirstLogin(),
                "userId", authenticationDTO.getUserId()
        );

        return ResponseEntity.ok(ApiResponse.success(responseBody, "User authenticated successfully."));
    }

    @PostMapping("/verify-token")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyToken(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> verificationResult = authenticationService.verifyToken(request, response);
        return ResponseEntity.ok(ApiResponse.success(verificationResult, "Token verified successfully."));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        boolean loggedOut = authenticationService.logout(request, response);
        if (loggedOut) {
            return ResponseEntity.ok(ApiResponse.success(null, "User logged out successfully."));
        }
        return ResponseEntity.badRequest().body(ApiResponse.failure("Unable to logout."));
    }
}
