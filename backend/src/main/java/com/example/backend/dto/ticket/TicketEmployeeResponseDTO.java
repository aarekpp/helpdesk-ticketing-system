package com.example.backend.dto.ticket;

import com.example.backend.dto.company.CompanyResponseDTO;
import com.example.backend.dto.serviceProduct.ServiceProductDTO;
import com.example.backend.dto.user.client.ClientResponseDTO;
import com.example.backend.dto.user.employee.EmployeeResponseDTO;
import com.example.backend.model.Ticket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketEmployeeResponseDTO {
    private String id;
    private String title;
    private String description;
    private ServiceProductDTO service;
    private String status;
    private ClientResponseDTO client;
    private EmployeeResponseDTO assignedTo;
    private CompanyResponseDTO company;
    private List<Long> readBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TicketEmployeeResponseDTO fromEntity(Ticket ticket, List<Long> readBy){
        return new TicketEmployeeResponseDTO(
                ticket.getUuid(),
                ticket.getTitle(),
                ticket.getDescription(),
                (ticket.getServiceProduct() != null)
                        ? ServiceProductDTO.fromEntity(ticket.getServiceProduct())
                        : null,
                ticket.getStatus().getDisplayName(),
                ClientResponseDTO.fromEntity(ticket.getClient()),
                (ticket.getAssignedTo() != null)
                        ? EmployeeResponseDTO.fromEntity(ticket.getAssignedTo())
                        : null,
                CompanyResponseDTO.fromEntity(ticket.getCompany()),
                readBy,
                ticket.getCreatedAt(),
                ticket.getUpdatedAt());
    }
}
