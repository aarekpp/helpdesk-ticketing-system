package com.example.backend.dto.serviceProduct;

import com.example.backend.model.ServiceProduct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceProductDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ServiceProductDTO fromEntity(ServiceProduct serviceProduct) {
        return new ServiceProductDTO(
                serviceProduct.getId(),
                serviceProduct.getName(),
                serviceProduct.getCreatedAt(),
                serviceProduct.getUpdatedAt()
        );
    }
}
