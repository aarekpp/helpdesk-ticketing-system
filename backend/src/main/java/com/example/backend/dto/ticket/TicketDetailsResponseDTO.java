package com.example.backend.dto.ticket;

import com.example.backend.dto.Message.MessageResponseDTO;
import com.example.backend.model.Message;
import com.example.backend.model.Ticket;
import com.example.backend.model.TicketHistory;
import com.example.backend.model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketDetailsResponseDTO {
    private List<TicketHistoryResponseDTO> history;
    private List<MessageResponseDTO> messages;
    private TicketStatus status;

    public static TicketDetailsResponseDTO fromEntity(Ticket ticket){
        TicketDetailsResponseDTO responseDTO = new TicketDetailsResponseDTO();
        responseDTO.setHistory(ticket.getHistory().stream().map(TicketHistoryResponseDTO::fromEntity).toList());
        responseDTO.setMessages(ticket.getMessages().stream().map(MessageResponseDTO::fromEntity).toList());
        responseDTO.setStatus(ticket.getStatus());
        return responseDTO;
    }
}
