package com.example.backend.controller.user;

import com.example.backend.config.ApiResponse;
import com.example.backend.dto.user.client.ClientRequestDTO;
import com.example.backend.dto.user.client.ClientResponseDTO;
import com.example.backend.dto.user.client.ClientWithCompanyResponseDTO;
import com.example.backend.model.User;
import com.example.backend.service.user.ClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/clients")
public class ClientController {
    private final ClientService clientService;

    @Autowired
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientResponseDTO>>> getAllClients(){
        List<ClientResponseDTO> clients = clientService.getAllUsersByRole("CLIENT").stream().map(ClientResponseDTO::fromEntity).toList();
        return ResponseEntity.ok(ApiResponse.success(clients, "Fetched all users with client role successfully."));
    }

    @GetMapping("/without-company")
    public ResponseEntity<ApiResponse<List<ClientResponseDTO>>> getAllClientsWithoutCompany(){
        List<ClientResponseDTO> clients = clientService.getAllClientsWithoutCompany().stream().map(ClientResponseDTO::fromEntity).toList();
        return ResponseEntity.ok(ApiResponse.success(clients, "Fetched all users with client role without company successfully."));
    }

    @GetMapping("/with-company")
    public ResponseEntity<ApiResponse<List<ClientWithCompanyResponseDTO>>> getAllClientsWithCompanyData(){
        List<ClientWithCompanyResponseDTO> clients = clientService.getAllUsersByRole("CLIENT").stream().map(ClientWithCompanyResponseDTO::fromEntity).toList();
        return ResponseEntity.ok(ApiResponse.success(clients, "Fetched all users with client role with company data successfully."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientResponseDTO>> getClientById(@PathVariable Long id){
        ClientResponseDTO client = ClientResponseDTO.fromEntity(clientService.getUserByIdAndRole(id, "CLIENT"));
        return ResponseEntity.ok(ApiResponse.success(client, "Fetched user with client role successfully."));
    }

    @GetMapping("/{id}/with-company")
    public ResponseEntity<ApiResponse<ClientWithCompanyResponseDTO>> getClientWithCompanyDataById(@PathVariable Long id){
        ClientWithCompanyResponseDTO client = ClientWithCompanyResponseDTO.fromEntity(clientService.getUserByIdAndRole(id, "CLIENT"));
        return ResponseEntity.ok(ApiResponse.success(client, "Fetched user with client role and company data successfully."));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClientWithCompanyResponseDTO>> createClient(@Valid @RequestBody ClientRequestDTO clientRequestDTO){
        User createdClient = clientService.createClient(clientRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(ClientWithCompanyResponseDTO.fromEntity(createdClient), "User with client role created successfully with ID: " + createdClient.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientWithCompanyResponseDTO>> updateClient(@PathVariable Long id, @Valid @RequestBody ClientRequestDTO clientRequestDTO){
        User updatedClient = clientService.updateClient(id, clientRequestDTO);
        return ResponseEntity.ok(ApiResponse.success(ClientWithCompanyResponseDTO.fromEntity(updatedClient), "User with client role updated successfully with ID: " + updatedClient.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClient(@PathVariable Long id){
        clientService.deleteClient(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User with client role deleted successfully with ID: " + id));
    }
}
