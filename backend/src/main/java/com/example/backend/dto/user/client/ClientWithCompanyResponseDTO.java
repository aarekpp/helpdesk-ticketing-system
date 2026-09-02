package com.example.backend.dto.user.client;

import com.example.backend.dto.company.CompanyResponseDTO;
import com.example.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientWithCompanyResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CompanyResponseDTO company;

    public static ClientWithCompanyResponseDTO fromEntity(User user){
        return new ClientWithCompanyResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getUsername(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getCompany() != null ? CompanyResponseDTO.fromEntity(user.getCompany()) : null
        );
    }
}
