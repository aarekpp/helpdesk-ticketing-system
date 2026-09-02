package com.example.backend.dto.serviceProduct;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceProductRequestDTO {
    @NotBlank(message = "{serviceProduct.name.required}")
    private String name;
    private Set<Long> companyIds;
}
