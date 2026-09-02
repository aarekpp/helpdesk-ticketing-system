package com.example.backend.dto.ticket;

import com.example.backend.dto.serviceProduct.ServiceProductDTO;
import com.example.backend.dto.user.client.ClientResponseDTO;
import com.example.backend.dto.user.employee.EmployeeResponseDTO;
import com.example.backend.model.Ticket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketClientLightResponseDTO {
    private String id;
    private String title;
    private ServiceProductDTO service;
    private String status;
    private EmployeeResponseDTO assignedTo;
    private ClientResponseDTO client;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TicketClientLightResponseDTO fromEntity(Ticket ticket){
        return new TicketClientLightResponseDTO(
                ticket.getUuid(),
                ticket.getTitle(),
                (ticket.getServiceProduct() != null)
                        ? ServiceProductDTO.fromEntity(ticket.getServiceProduct())
                        : null,
                ticket.getStatus().getDisplayName(),
                (ticket.getAssignedTo() != null)
                        ? EmployeeResponseDTO.fromEntity(ticket.getAssignedTo())
                        : null,
                ClientResponseDTO.fromEntity(ticket.getClient()),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
                );
    }
}
