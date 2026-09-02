package com.example.backend.service.user;

import com.example.backend.dto.user.client.ClientRequestDTO;
import com.example.backend.exception.CompanyException;
import com.example.backend.exception.OperationType;
import com.example.backend.exception.RoleException;
import com.example.backend.exception.UserException;
import com.example.backend.model.Company;
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

import java.util.List;

@Service
public class ClientService extends BaseUserService{
    @Autowired
    public ClientService(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, CompanyRepository companyRepository, JwtTokenProvider jwtTokenProvider) {
        super(userRepository, roleRepository, companyRepository, passwordEncoder, jwtTokenProvider);
    }

    public List<User> getAllClientsWithoutCompany(){
        return userRepository.findByRole_NameAndCompanyIsNull("CLIENT");
    }

    @Transactional
    public User createClient(ClientRequestDTO clientRequestDTO){
        if(userRepository.existsByEmail(clientRequestDTO.getEmail())){
            throw new UserException("Email is already in use.", OperationType.CREATION, "CLIENT");
        }

        if(userRepository.existsByUsername(clientRequestDTO.getUsername())){
            throw new UserException("Username is already in use.", OperationType.CREATION, "CLIENT");
        }

        Role clientRole = roleRepository.findByName("CLIENT").orElseThrow(() -> new RoleException("Failed to get role"));
        User client = new User();
        client.setFirstName(clientRequestDTO.getFirstName());
        client.setLastName(clientRequestDTO.getLastName());
        client.setUsername(clientRequestDTO.getUsername());
        client.setEmail(clientRequestDTO.getEmail());
        client.setRole(clientRole);

        if(clientRequestDTO.getPassword() == null || !isValidPassword(clientRequestDTO.getPassword())){
            throw new UserException("Password does not meet the requirements. It must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.", OperationType.CREATION, "CLIENT");
        }

        client.setPassword(passwordEncoder.encode(clientRequestDTO.getPassword()));

        if(clientRequestDTO.getCompanyId() != null){
            Company company = companyRepository.findById(clientRequestDTO.getCompanyId())
                    .orElseThrow(() -> new CompanyException("Company not found", OperationType.CREATION));
            client.setCompany(company);
        }

        try{
            return userRepository.save(client);
        }catch(RuntimeException ex){
            throw new UserException("Failed to create user due to an error: " + ex.getMessage(), OperationType.CREATION, "CLIENT");
        }
    }

    @Transactional
    public User updateClient(Long id, ClientRequestDTO clientRequestDTO){
        User existingClient = getUserByIdAndRole(id, "CLIENT");

        if(!existingClient.getEmail().equals(clientRequestDTO.getEmail()) && userRepository.existsByEmail(clientRequestDTO.getEmail())){
            throw new UserException("Email is already in use.", OperationType.UPDATE, "CLIENT");
        }

        if (!existingClient.getUsername().equals(clientRequestDTO.getUsername()) && userRepository.existsByUsername(clientRequestDTO.getUsername())) {
            throw new UserException("Username is already in use.", OperationType.UPDATE, "CLIENT");
        }

        existingClient.setFirstName(clientRequestDTO.getFirstName());
        existingClient.setLastName(clientRequestDTO.getLastName());
        existingClient.setUsername(clientRequestDTO.getUsername());
        existingClient.setEmail(clientRequestDTO.getEmail());

        if(clientRequestDTO.isChangePasswordRequired()){
            existingClient.setFirstLogin(true);
        }

        if (clientRequestDTO.getPassword() != null && !clientRequestDTO.getPassword().isEmpty()) {
            if (!isValidPassword(clientRequestDTO.getPassword())) {
                throw new UserException("Password does not meet the requirements. It must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.", OperationType.UPDATE, "CLIENT");
            }
            existingClient.setPassword(passwordEncoder.encode(clientRequestDTO.getPassword()));
        }

        if(clientRequestDTO.getCompanyId() == null){
            existingClient.setCompany(null);
        }else{
            Company company = companyRepository.findById(clientRequestDTO.getCompanyId())
                    .orElseThrow(() -> new CompanyException("Company not found", OperationType.CREATION));
            existingClient.setCompany(company);
        }

        try{
            return userRepository.save(existingClient);
        }catch(RuntimeException ex){
            throw new UserException("Failed to update user due to an error: " + ex.getMessage(), OperationType.UPDATE, "CLIENT");
        }
    }

    @Transactional
    public void deleteClient(Long id){
        User client = getUserByIdAndRole(id, "CLIENT");

        try {
            userRepository.delete(client);
        } catch (EmptyResultDataAccessException ex) {
            throw new UserException("Client with ID " + id + " does not exist.", OperationType.DELETION, "CLIENT");
        } catch (DataIntegrityViolationException ex) {
            throw new UserException("Cannot delete admin with ID " + id + " due to related data integrity constraints.", OperationType.DELETION, "CLIENT");
        } catch (Exception ex) {
            throw new UserException("Failed to delete user due to an error: " + ex.getMessage(), OperationType.DELETION, "CLIENT");
        }
    }
}
