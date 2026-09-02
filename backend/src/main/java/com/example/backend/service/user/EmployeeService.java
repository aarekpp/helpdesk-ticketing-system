package com.example.backend.service.user;

import com.example.backend.dto.user.employee.EmployeeRequestDTO;
import com.example.backend.exception.OperationType;
import com.example.backend.exception.RoleException;
import com.example.backend.exception.UserException;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenProvider;
import com.example.backend.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService extends BaseUserService {
    private final AuthenticationService authenticationService;
    @Autowired
    public EmployeeService(UserRepository userRepository, RoleRepository roleRepository, CompanyRepository companyRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, AuthenticationService authenticationService) {
        super(userRepository, roleRepository, companyRepository, passwordEncoder, jwtTokenProvider);
        this.authenticationService = authenticationService;
    }

    public List<User> getEmployeesToForward(HttpServletRequest request){
        User employee = authenticationService.getCurrentUser(request);
        try{
            return userRepository.findByRole_NameAndCompanyIsNull("EMPLOYEE")
                    .stream().filter(e -> !e.getId().equals(employee.getId())).toList();
        }catch (Exception ex){
            throw new UserException("Error during fetch employees to fetch.", OperationType.GET, "EMPLOYEE");
        }
    }

    @Transactional
    public User createEmployee(EmployeeRequestDTO employeeRequestDTO){
        if(userRepository.existsByEmail(employeeRequestDTO.getEmail())){
            throw new UserException("Email is already in use.", OperationType.CREATION, "EMPLOYEE");
        }

        if(userRepository.existsByUsername(employeeRequestDTO.getUsername())){
            throw new UserException("Username is already in use.", OperationType.CREATION, "EMPLOYEE");
        }

        Role employeeRole = roleRepository.findByName("EMPLOYEE").orElseThrow(() -> new RoleException("Failed to get role"));
        User employee = new User();
        employee.setFirstName(employeeRequestDTO.getFirstName());
        employee.setLastName(employeeRequestDTO.getLastName());
        employee.setUsername(employeeRequestDTO.getUsername());
        employee.setEmail(employeeRequestDTO.getEmail());
        employee.setRole(employeeRole);

        if(employeeRequestDTO.getPassword() == null || !isValidPassword(employeeRequestDTO.getPassword())){
            throw new UserException("Password does not meet the requirements. It must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.", OperationType.CREATION, "EMPLOYEE");
        }

        employee.setPassword(passwordEncoder.encode(employeeRequestDTO.getPassword()));

        try{
            return userRepository.save(employee);
        }catch(RuntimeException ex){
            throw new UserException("Failed to create user due to an error: " + ex.getMessage(), OperationType.CREATION, "EMPLOYEE");
        }
    }

    @Transactional
    public User updateEmployee(Long id, EmployeeRequestDTO employeeRequestDTO){
        User existingEmployee = getUserByIdAndRole(id, "EMPLOYEE");

        if(!existingEmployee.getEmail().equals(employeeRequestDTO.getEmail()) && userRepository.existsByEmail(employeeRequestDTO.getEmail())){
            throw new UserException("Email is already in use.", OperationType.UPDATE, "EMPLOYEE");
        }

        if (!existingEmployee.getUsername().equals(employeeRequestDTO.getUsername()) && userRepository.existsByUsername(employeeRequestDTO.getUsername())) {
            throw new UserException("Username is already in use.", OperationType.UPDATE, "EMPLOYEE");
        }

        existingEmployee.setFirstName(employeeRequestDTO.getFirstName());
        existingEmployee.setLastName(employeeRequestDTO.getLastName());
        existingEmployee.setUsername(employeeRequestDTO.getUsername());
        existingEmployee.setEmail(employeeRequestDTO.getEmail());

        if(employeeRequestDTO.isChangePasswordRequired()){
            existingEmployee.setFirstLogin(true);
        }

        if (employeeRequestDTO.getPassword() != null && !employeeRequestDTO.getPassword().isEmpty()) {
            if (!isValidPassword(employeeRequestDTO.getPassword())) {
                throw new UserException("Password does not meet the requirements. It must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.", OperationType.UPDATE, "EMPLOYEE");
            }
            existingEmployee.setPassword(passwordEncoder.encode(employeeRequestDTO.getPassword()));
        }

        try{
            return userRepository.save(existingEmployee);
        }catch(RuntimeException ex){
            throw new UserException("Failed to update user due to an error: " + ex.getMessage(), OperationType.UPDATE, "EMPLOYEE");
        }
    }

    @Transactional
    public void deleteEmployee(Long id){
        User employee = getUserByIdAndRole(id, "EMPLOYEE");

        try {
            userRepository.delete(employee);
        } catch (EmptyResultDataAccessException ex) {
            throw new UserException("Employee with ID " + id + " does not exist.", OperationType.DELETION, "EMPLOYEE");
        } catch (DataIntegrityViolationException ex) {
            throw new UserException("Cannot delete admin with ID " + id + " due to related data integrity constraints.", OperationType.DELETION, "EMPLOYEE");
        } catch (Exception ex) {
            throw new UserException("Failed to delete user due to an error: " + ex.getMessage(), OperationType.DELETION, "EMPLOYEE");
        }
    }
}
