package com.example.backend.controller.user;

import com.example.backend.config.ApiResponse;
import com.example.backend.dto.user.admin.AdminRequestDTO;
import com.example.backend.dto.user.admin.AdminResponseDTO;
import com.example.backend.model.User;
import com.example.backend.service.user.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users/admins")
public class AdminController {
    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminResponseDTO>>> getAllAdmins(){
        List<AdminResponseDTO> admins = adminService.getAllUsersByRole("ADMIN").stream().map(AdminResponseDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(admins, "Fetched all users with admin role successfully."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminResponseDTO>> getAdminById(@PathVariable Long id){
        AdminResponseDTO admin = AdminResponseDTO.fromEntity(adminService.getUserByIdAndRole(id, "ADMIN"));
        return ResponseEntity.ok(ApiResponse.success(admin, "Fetched user with admin role successfully."));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminResponseDTO>> createAdmin(@Valid @RequestBody AdminRequestDTO adminRequestDTO){
        User createdAdmin = adminService.createAdmin(adminRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(AdminResponseDTO.fromEntity(createdAdmin), "User with admin role created successfully with ID: " + createdAdmin.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminResponseDTO>> updateAdmin(@PathVariable Long id, @Valid @RequestBody AdminRequestDTO adminRequestDTO){
        User updatedAdmin = adminService.updateAdmin(id, adminRequestDTO);
        return ResponseEntity.ok(ApiResponse.success(AdminResponseDTO.fromEntity(updatedAdmin), "User with admin role updated successfully with ID: " + updatedAdmin.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAdmin(@PathVariable Long id){
        adminService.deleteAdmin(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User with admin role deleted successfully with ID: " + id));
    }
}