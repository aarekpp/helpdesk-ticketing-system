package com.example.backend.controller.user;

import com.example.backend.config.ApiResponse;
import com.example.backend.dto.ChangePasswordDTO;
import com.example.backend.service.user.ChangePasswordService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class BaseUserController {
    private final ChangePasswordService changePasswordService;

    @Autowired
    public BaseUserController(ChangePasswordService changePasswordService) {
        this.changePasswordService = changePasswordService;
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changeFirstLoginPassword(HttpServletRequest request, @Valid @RequestBody ChangePasswordDTO changePasswordDTO){
        changePasswordService.changeFirstLoginPassword(request, changePasswordDTO);
        return ResponseEntity.ok(ApiResponse.success(null, "Password has been successfully changed."));
    }
}
