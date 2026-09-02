package com.example.backend.dto.ticket;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListTicketResponseDTO {
    private List<TicketEmployeeResponseDTO> allTickets;
    private List<TicketEmployeeResponseDTO> assignedTickets;
}
