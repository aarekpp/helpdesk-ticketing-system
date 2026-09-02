package com.example.backend.dto.company;

import com.example.backend.dto.serviceProduct.ServiceProductDTO;
import com.example.backend.dto.user.client.ClientResponseDTO;
import com.example.backend.model.Company;
import com.example.backend.model.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyFullResponseDTO {
    private Long id;
    private String name;
    private String city;
    private String zipCode;
    private String address;
    private List<ServiceProductDTO> serviceProducts;
    private List<ClientResponseDTO> clients;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CompanyFullResponseDTO fromEntity(Company company, List<User> clients){
        CompanyFullResponseDTO dto = new CompanyFullResponseDTO();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setCity(company.getCity());
        dto.setZipCode(company.getZipCode());
        dto.setAddress(company.getAddress());
        dto.setServiceProducts(company.getServiceProducts().stream()
                .map(ServiceProductDTO::fromEntity)
                .toList());
        dto.setClients(clients.stream()
                .map(ClientResponseDTO::fromEntity)
                .toList());
        dto.setCreatedAt(company.getCreatedAt());
        dto.setUpdatedAt(company.getUpdatedAt());

        return dto;
    }
}
