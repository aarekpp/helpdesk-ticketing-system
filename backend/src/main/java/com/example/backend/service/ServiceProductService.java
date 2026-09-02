package com.example.backend.service;

import com.example.backend.dto.serviceProduct.ServiceProductRequestDTO;
import com.example.backend.exception.OperationType;
import com.example.backend.exception.ServiceProductException;
import com.example.backend.model.Company;
import com.example.backend.model.ServiceProduct;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.ServiceProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ServiceProductService {
    private final ServiceProductRepository serviceProductRepository;
    private final CompanyRepository companyRepository;

    @Autowired
    public ServiceProductService(ServiceProductRepository serviceProductRepository, CompanyRepository companyRepository) {
        this.serviceProductRepository = serviceProductRepository;
        this.companyRepository = companyRepository;
    }

    public List<ServiceProduct> getAllServices(){
        return serviceProductRepository.findAll();
    }

    public ServiceProduct getServiceById(Long id){
        return serviceProductRepository.findById(id)
                .orElseThrow(() -> new ServiceProductException("Service not found", OperationType.RETRIEVAL));
    }

    @Transactional
    public ServiceProduct createService(ServiceProductRequestDTO serviceProductRequestDTO) {
        if(serviceProductRepository.existsByName(serviceProductRequestDTO.getName())){
            throw new ServiceProductException("Name already in use.", OperationType.CREATION);
        }
        ServiceProduct serviceProduct = new ServiceProduct();
        serviceProduct.setName(serviceProductRequestDTO.getName());
        assignCompaniesToService(serviceProduct, serviceProductRequestDTO.getCompanyIds());
        try {
            return serviceProductRepository.save(serviceProduct);
        } catch (Exception ex) {
            throw new ServiceProductException("Failed to create service due to an error: " + ex.getMessage(), OperationType.CREATION);
        }
    }

    @Transactional
    public ServiceProduct updateService(Long id, ServiceProductRequestDTO serviceProductRequestDTO) {
        ServiceProduct existingService = getServiceById(id);

        if(!existingService.getName().equals(serviceProductRequestDTO.getName()) && serviceProductRepository.existsByName(serviceProductRequestDTO.getName())){
            throw new ServiceProductException("Name already in use.", OperationType.CREATION);
        }

        existingService.setName(serviceProductRequestDTO.getName());
        assignCompaniesToService(existingService, serviceProductRequestDTO.getCompanyIds());
        try {
            return serviceProductRepository.save(existingService);
        } catch (Exception ex) {
            throw new ServiceProductException("Failed to update service due to an error: " + ex.getMessage(), OperationType.UPDATE);
        }
    }

    @Transactional
    public void deleteService(Long id){
        ServiceProduct serviceProduct = getServiceById(id);
        try {
            if (serviceProduct.getCompanies() != null) {
                for (Company company : serviceProduct.getCompanies()) {
                    company.getServiceProducts().remove(serviceProduct);
                    companyRepository.save(company);
                }
            }
            serviceProductRepository.delete(serviceProduct);
        } catch (Exception ex) {
            throw new ServiceProductException("Failed to delete service due to an error: " + ex.getMessage(), OperationType.DELETION);
        }
    }

    private void assignCompaniesToService(ServiceProduct serviceProduct, Set<Long> companyIds) {
        if (companyIds != null && !companyIds.isEmpty()) {
            Set<Company> companies = new HashSet<>(companyRepository.findAllById(companyIds));

            if (companies.size() != companyIds.size()) {
                throw new ServiceProductException("One or more company IDs are invalid", OperationType.CREATION);
            }

            for (Company company : serviceProduct.getCompanies()) {
                company.getServiceProducts().remove(serviceProduct);
            }

            serviceProduct.setCompanies(companies);

            for (Company company : companies) {
                company.getServiceProducts().add(serviceProduct);
            }
        } else {
            for (Company company : serviceProduct.getCompanies()) {
                company.getServiceProducts().remove(serviceProduct);
            }
            serviceProduct.setCompanies(new HashSet<>());
        }
    }
}
