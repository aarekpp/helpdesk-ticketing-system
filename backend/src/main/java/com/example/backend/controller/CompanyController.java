package com.example.backend.controller;

import com.example.backend.config.ApiResponse;
import com.example.backend.dto.company.CompanyFullResponseDTO;
import com.example.backend.dto.company.CompanyResponseDTO;
import com.example.backend.dto.serviceProduct.ServiceProductDTO;
import com.example.backend.model.Company;
import com.example.backend.dto.company.CompanyRequestDTO;
import com.example.backend.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private final CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompanyResponseDTO>>> getAllCompanies(){
        List<CompanyResponseDTO> companies = companyService.getAllCompanies().stream().map(CompanyResponseDTO::fromEntity).toList();
        return ResponseEntity.ok(ApiResponse.success(companies, "Fetched all companies successfully."));
    }

    @GetMapping("/extended")
    public ResponseEntity<ApiResponse<List<CompanyFullResponseDTO>>> getAllCompaniesWithFullData(){
        List<CompanyFullResponseDTO> companies = companyService.getAllCompaniesWithFullData();
        return ResponseEntity.ok(ApiResponse.success(companies, "Fetched all companies with extended data successfully."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponseDTO>> getCompanyById(@PathVariable Long id){
        Company company = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.success(CompanyResponseDTO.fromEntity(company), "Company found with ID: " + id));
    }

    @GetMapping("/{id}/services")
    public ResponseEntity<ApiResponse<List<ServiceProductDTO>>> getServicesByCompanyId(@PathVariable Long id){
        List<ServiceProductDTO> services = companyService.getServicesByCompanyId(id).stream().map(ServiceProductDTO::fromEntity).toList();
        return ResponseEntity.ok(ApiResponse.success(services, "Founded belonging services to company with ID: " + id));
    }

    @GetMapping("/{id}/extended")
    public ResponseEntity<ApiResponse<CompanyFullResponseDTO>> getCompanyByIdWithFullData(@PathVariable Long id){
        CompanyFullResponseDTO company = companyService.getCompanyWithFullDataById(id);
        return ResponseEntity.ok(ApiResponse.success(company, "Company with extended data found with ID: " + id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CompanyFullResponseDTO>> createCompany(@Valid @RequestBody CompanyRequestDTO companyRequestDTO){
        Company createdCompany = companyService.createCompany(companyRequestDTO);
        CompanyFullResponseDTO companyDTO = companyService.convertToFullResponseDTO(createdCompany);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(companyDTO, "Company created successfully with ID: " + createdCompany.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyFullResponseDTO>> updateCompany(@PathVariable Long id, @Valid @RequestBody CompanyRequestDTO companyRequestDTO){
        Company updatedCompany = companyService.updateCompany(id, companyRequestDTO);
        CompanyFullResponseDTO companyDTO = companyService.convertToFullResponseDTO(updatedCompany);
        return ResponseEntity.ok(ApiResponse.success(companyDTO, "Company updated successfully with ID: " + updatedCompany.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(@PathVariable Long id){
        companyService.deleteCompany(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Company deleted successfully with ID: " + id));
    }
}
