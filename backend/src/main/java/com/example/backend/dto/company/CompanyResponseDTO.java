package com.example.backend.dto.company;

import com.example.backend.model.Company;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponseDTO {
    private Long id;
    private String name;
    private String city;
    private String zipCode;
    private String address;

    public static CompanyResponseDTO fromEntity(Company company){
        return new CompanyResponseDTO(
                company.getId(),
                company.getName(),
                company.getCity(),
                company.getZipCode(),
                company.getAddress()
        );
    }
}