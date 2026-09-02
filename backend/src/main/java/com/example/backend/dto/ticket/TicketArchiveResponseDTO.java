package com.example.backend.dto.ticket;

import com.example.backend.dto.Message.MessageResponseDTO;
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
public class TicketArchiveResponseDTO {
    private String id;
    private String title;
    private String description;
    private ServiceProductDTO service;
    private ClientResponseDTO client;
    private EmployeeResponseDTO assignedTo;
    private CompanyResponseDTO company;
    private List<TicketHistoryResponseDTO> history;
    private List<MessageResponseDTO> messages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TicketArchiveResponseDTO fromEntity(Ticket ticket){
        TicketArchiveResponseDTO responseDTO = new TicketArchiveResponseDTO();
        responseDTO.setId(ticket.getUuid());
        responseDTO.setTitle(ticket.getTitle());
        responseDTO.setDescription(ticket.getDescription());
        responseDTO.setService(ticket.getServiceProduct() != null ? ServiceProductDTO.fromEntity(ticket.getServiceProduct()) : null);
        responseDTO.setClient(ClientResponseDTO.fromEntity(ticket.getClient()));
        responseDTO.setAssignedTo(ticket.getAssignedTo() != null ? EmployeeResponseDTO.fromEntity(ticket.getAssignedTo()) : null);
        responseDTO.setCompany(CompanyResponseDTO.fromEntity(ticket.getCompany()));
        responseDTO.setHistory(ticket.getHistory().stream().map(TicketHistoryResponseDTO::fromEntity).toList());
        responseDTO.setMessages(ticket.getMessages().stream().map(MessageResponseDTO::fromEntity).toList());
        responseDTO.setCreatedAt(ticket.getCreatedAt());
        responseDTO.setUpdatedAt(ticket.getUpdatedAt());

        return responseDTO;
    }
}
