package com.example.backend.controller;

import com.example.backend.config.ApiResponse;
import com.example.backend.dto.serviceProduct.ServiceProductDTO;
import com.example.backend.dto.serviceProduct.ServiceProductRequestDTO;
import com.example.backend.dto.serviceProduct.ServiceProductWithCompaniesDTO;
import com.example.backend.model.ServiceProduct;
import com.example.backend.service.ServiceProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
public class ServiceProductController {
    private final ServiceProductService serviceProductService;

    @Autowired
    public ServiceProductController(ServiceProductService serviceProductService) {
        this.serviceProductService = serviceProductService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceProductDTO>>> getAllServices(){
        List<ServiceProductDTO> services = serviceProductService.getAllServices().stream().map(ServiceProductDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(services, "Fetched all services successfully."));
    }

    @GetMapping("/with-companies")
    public ResponseEntity<ApiResponse<List<ServiceProductWithCompaniesDTO>>> getAllServicesWithCompanies(){
        List<ServiceProductWithCompaniesDTO> services = serviceProductService.getAllServices().stream().map(ServiceProductWithCompaniesDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(services, "Fetched all services successfully."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceProductDTO>> getServiceById(@PathVariable Long id){
        ServiceProduct serviceProduct = serviceProductService.getServiceById(id);
        return ResponseEntity.ok(ApiResponse.success(ServiceProductDTO.fromEntity(serviceProduct), "Service found with ID: " + id));
    }

    @GetMapping("/{id}/with-companies")
    public ResponseEntity<ApiResponse<ServiceProductWithCompaniesDTO>> getServiceWithCompany(@PathVariable Long id){
        ServiceProduct serviceProduct = serviceProductService.getServiceById(id);
        return ResponseEntity.ok(ApiResponse.success(ServiceProductWithCompaniesDTO.fromEntity(serviceProduct), "Service with companies found with ID: " + id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceProductWithCompaniesDTO>> createService(@Valid @RequestBody ServiceProductRequestDTO serviceProductRequestDTO) {
        ServiceProduct createdService = serviceProductService.createService(serviceProductRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(ServiceProductWithCompaniesDTO.fromEntity(createdService), "Service created successfully with ID: " + createdService.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceProductWithCompaniesDTO>> updateService(@PathVariable Long id, @Valid @RequestBody ServiceProductRequestDTO serviceProductRequestDTO) {
        ServiceProduct updatedService = serviceProductService.updateService(id, serviceProductRequestDTO);
        return ResponseEntity.ok(ApiResponse.success(ServiceProductWithCompaniesDTO.fromEntity(updatedService), "Service updated successfully with ID: " + updatedService.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id){
        serviceProductService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Service deleted successfully with ID: " + id));
    }
}