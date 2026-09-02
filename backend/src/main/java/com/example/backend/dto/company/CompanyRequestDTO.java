package com.example.backend.dto.company;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequestDTO {
    @NotBlank(message = "{company.name.required}")
    private String name;
    @NotBlank(message = "{company.city.required}")
    private String city;
    @NotBlank(message = "{company.zipCode.required}")
    private String zipCode;
    @NotBlank(message = "{company.address.required}")
    private String address;
    private Set<Long> serviceProducts;
    private Set<Long> clients;
}
