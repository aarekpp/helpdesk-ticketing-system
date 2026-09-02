package com.example.backend.controller.user;

import com.example.backend.config.ApiResponse;
import com.example.backend.dto.user.employee.EmployeeRequestDTO;
import com.example.backend.dto.user.employee.EmployeeResponseDTO;
import com.example.backend.model.User;
import com.example.backend.service.user.EmployeeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponseDTO>>> getAllEmployees(){
        List<EmployeeResponseDTO> employees = employeeService.getAllUsersByRole("EMPLOYEE").stream().map(EmployeeResponseDTO::fromEntity).toList();
        return ResponseEntity.ok(ApiResponse.success(employees, "Fetched all users with employee role successfully."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> getEmployeeById(@PathVariable Long id){
        EmployeeResponseDTO employee = EmployeeResponseDTO.fromEntity(employeeService.getUserByIdAndRole(id, "EMPLOYEE"));
        return ResponseEntity.ok(ApiResponse.success(employee, "Fetched user with employee role successfully."));
    }

    @GetMapping("/to-forward")
    public ResponseEntity<ApiResponse<List<EmployeeResponseDTO>>> getEmployeesToForward(HttpServletRequest request){
        List<EmployeeResponseDTO> employees = employeeService.getEmployeesToForward(request).stream().map(EmployeeResponseDTO::fromEntity).toList();
        return ResponseEntity.ok(ApiResponse.success(employees, "Fetched employees to forward ticket successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> createEmployee(@Valid @RequestBody EmployeeRequestDTO employeeRequestDTO){
        User createdEmployee = employeeService.createEmployee(employeeRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(EmployeeResponseDTO.fromEntity(createdEmployee), "User with employee role created successfully with ID: " + createdEmployee.getId()));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeRequestDTO employeeRequestDTO){
        User updatedEmployee = employeeService.updateEmployee(id, employeeRequestDTO);
        return ResponseEntity.ok(ApiResponse.success(EmployeeResponseDTO.fromEntity(updatedEmployee), "User with employee role updated successfully with ID: " + updatedEmployee.getId()));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id){
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User with employee role deleted successfully with ID: " + id));
    }
}
