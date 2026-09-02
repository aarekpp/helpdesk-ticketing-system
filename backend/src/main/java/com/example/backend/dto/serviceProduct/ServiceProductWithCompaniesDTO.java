package com.example.backend.dto.serviceProduct;

import com.example.backend.dto.company.CompanyResponseDTO;
import com.example.backend.model.ServiceProduct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceProductWithCompaniesDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<CompanyResponseDTO> companies;

    public static ServiceProductWithCompaniesDTO fromEntity(ServiceProduct serviceProduct) {
        Set<CompanyResponseDTO> companyResponseDTOS = serviceProduct.getCompanies().stream()
                .map(CompanyResponseDTO::fromEntity)
                .collect(Collectors.toSet());

        return new ServiceProductWithCompaniesDTO(
                serviceProduct.getId(),
                serviceProduct.getName(),
                serviceProduct.getCreatedAt(),
                serviceProduct.getUpdatedAt(),
                companyResponseDTOS
        );
    }
}
