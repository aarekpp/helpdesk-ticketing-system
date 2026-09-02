package com.example.backend.service;

import com.example.backend.dto.company.CompanyFullResponseDTO;
import com.example.backend.exception.CompanyException;
import com.example.backend.exception.OperationType;
import com.example.backend.exception.UserException;
import com.example.backend.model.Company;
import com.example.backend.model.ServiceProduct;
import com.example.backend.model.User;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.ServiceProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.dto.company.CompanyRequestDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final ServiceProductRepository serviceProductRepository;
    private final UserRepository userRepository;

    @Autowired
    public CompanyService(CompanyRepository companyRepository, ServiceProductRepository serviceProductRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.serviceProductRepository = serviceProductRepository;
        this.userRepository = userRepository;
    }

    public List<Company> getAllCompanies(){
        return companyRepository.findAll();
    }

    public List<CompanyFullResponseDTO> getAllCompaniesWithFullData(){
        return companyRepository.findAll().stream().map(this::convertToFullResponseDTO).toList();
    }

    public Company getCompanyById(Long id){
        return companyRepository.findById(id)
                .orElseThrow(() -> new CompanyException("Company not found", OperationType.RETRIEVAL));
    }

    public CompanyFullResponseDTO getCompanyWithFullDataById(Long id){
        Company company = getCompanyById(id);
        return convertToFullResponseDTO(company);
    }

    public List<ServiceProduct> getServicesByCompanyId(Long companyId){
        Company company = companyRepository.findById(companyId).orElseThrow(() -> new CompanyException("Company not found", OperationType.GET));
        return company.getServiceProducts().stream().toList();
    }

    @Transactional
    public Company createCompany(CompanyRequestDTO companyRequestDTO){
        if(companyRepository.existsByName(companyRequestDTO.getName())){
            throw new CompanyException("Company name is already in use", OperationType.CREATION);
        }

        Company company = new Company();
        company.setName(companyRequestDTO.getName());
        company.setCity(companyRequestDTO.getCity());
        company.setZipCode(companyRequestDTO.getZipCode());
        company.setAddress(companyRequestDTO.getAddress());

        assignServiceProductsToCompany(company, companyRequestDTO.getServiceProducts());
        assignClientsToCompany(company, companyRequestDTO.getClients());

        try{
            return companyRepository.save(company);
        }catch (Exception ex){
            throw new CompanyException("Failed to create company due to an error: " + ex.getMessage(), OperationType.CREATION);
        }
    }

    @Transactional
    public Company updateCompany(Long id, CompanyRequestDTO companyRequestDTO){
        Company existingCompany = getCompanyById(id);

        if(!existingCompany.getName().equals(companyRequestDTO.getName()) && companyRepository.existsByName(companyRequestDTO.getName())){
            throw new CompanyException("Company name is already in use", OperationType.UPDATE);
        }

        existingCompany.setName(companyRequestDTO.getName());
        existingCompany.setCity(companyRequestDTO.getCity());
        existingCompany.setZipCode(companyRequestDTO.getZipCode());
        existingCompany.setAddress(companyRequestDTO.getAddress());

        assignServiceProductsToCompany(existingCompany, companyRequestDTO.getServiceProducts());
        assignClientsToCompany(existingCompany, companyRequestDTO.getClients());

        try {
            return companyRepository.save(existingCompany);
        } catch (Exception ex) {
            throw new CompanyException("Failed to update company due to an error: " + ex.getMessage(), OperationType.UPDATE);
        }
    }

    @Transactional
    public void deleteCompany(Long id){
        Company company = getCompanyById(id);
        try {
            if (company.getServiceProducts() != null) {
                for (ServiceProduct serviceProduct : company.getServiceProducts()) {
                    serviceProduct.getCompanies().remove(company);
                    serviceProductRepository.save(serviceProduct);
                }
            }
            if (company.getUsers() != null) {
                for (User user : company.getUsers()) {
                    user.setCompany(null);
                    userRepository.save(user);
                }
            }
            companyRepository.delete(company);
        } catch (Exception ex) {
            throw new CompanyException("Failed to delete company due to an error: " + ex.getMessage(), OperationType.DELETION);
        }
    }

    public CompanyFullResponseDTO convertToFullResponseDTO(Company company){
        List<User> clients = extractClients(company.getUsers());
        return CompanyFullResponseDTO.fromEntity(company, clients);
    }

    private void assignServiceProductsToCompany(Company company, Set<Long> serviceProductIds) {
        if (serviceProductIds == null || serviceProductIds.isEmpty()) {
            company.getServiceProducts().clear();
        } else {
            Set<ServiceProduct> existingServiceProducts = company.getServiceProducts();
            Set<Long> existingServiceProductIds = existingServiceProducts.stream().map(ServiceProduct::getId).collect(Collectors.toSet());
            existingServiceProducts.removeIf(sp -> !serviceProductIds.contains(sp.getId()));
            Set<Long> newServiceProductIds = new HashSet<>(serviceProductIds);
            newServiceProductIds.removeAll(existingServiceProductIds);
            Set<ServiceProduct> newServiceProducts = findNewEntities(newServiceProductIds, serviceProductRepository, "service products");
            existingServiceProducts.addAll(newServiceProducts);
        }
    }

    private void assignClientsToCompany(Company company, Set<Long> clientIds) {
        Set<User> currentClients = company.getUsers().stream()
                .filter(u -> "CLIENT".equalsIgnoreCase(u.getRole().getName()))
                .collect(Collectors.toSet());
        if (clientIds == null || clientIds.isEmpty()) {
            currentClients.forEach(c -> c.setCompany(null));
            company.getUsers().removeIf(u -> "CLIENT".equalsIgnoreCase(u.getRole().getName()));
            return;
        }
        currentClients.removeIf(c -> !clientIds.contains(c.getId()));
        Set<Long> newClientIds = new HashSet<>(clientIds);
        newClientIds.removeAll(currentClients.stream().map(User::getId).collect(Collectors.toSet()));
        Set<User> newClients = findNewEntities(newClientIds, userRepository, "clients");
        handleUserAssignment(newClients, company);
        company.getUsers().addAll(newClients);
    }

    private void assignManagersToCompany(Company company, Set<Long> managerIds) {
        Set<User> currentManagers = company.getUsers().stream()
                .filter(u -> "MANAGER".equalsIgnoreCase(u.getRole().getName()))
                .collect(Collectors.toSet());
        if (managerIds == null || managerIds.isEmpty()) {
            currentManagers.forEach(m -> m.setCompany(null));
            company.getUsers().removeIf(u -> "MANAGER".equalsIgnoreCase(u.getRole().getName()));
            return;
        }
        currentManagers.removeIf(m -> !managerIds.contains(m.getId()));
        Set<Long> newManagerIds = new HashSet<>(managerIds);
        newManagerIds.removeAll(currentManagers.stream().map(User::getId).collect(Collectors.toSet()));
        Set<User> newManagers = findNewEntities(newManagerIds, userRepository, "managers");
        handleUserAssignment(newManagers, company);
        company.getUsers().addAll(newManagers);
    }

    private <T> Set<T> findNewEntities(Set<Long> newEntityIds, JpaRepository<T, Long> repository, String entityType) throws CompanyException{
        Set<T> newEntities = new HashSet<>(repository.findAllById(newEntityIds));
        if(newEntities.size() != newEntityIds.size()){
            throw new CompanyException("One or more " + entityType + " IDs are invalid", OperationType.UPDATE);
        }
        return newEntities;
    }

    private <T extends User> void handleUserAssignment(Set<T> users, Company company) throws UserException{
        for(T user : users){
            if(user.getCompany() != null && !user.getCompany().equals(company)){
                throw new UserException("User with ID " + user.getId() + " is already assigned to another company", OperationType.UPDATE, user.getRole().getName());
            }
            user.setCompany(company);
        }
    }

    private List<User> extractClients(Set<User> users){
        return users.stream().filter(user -> user.getRole().getName().equalsIgnoreCase("CLIENT")).toList();
    }
}