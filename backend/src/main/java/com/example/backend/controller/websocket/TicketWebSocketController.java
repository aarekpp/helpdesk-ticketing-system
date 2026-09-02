package com.example.backend.controller.websocket;

import com.example.backend.dto.ticket.TicketClientLightResponseDTO;
import com.example.backend.dto.ticket.TicketDetailsResponseDTO;
import com.example.backend.dto.ticket.TicketEmployeeResponseDTO;
import com.example.backend.model.Ticket;
import com.example.backend.repository.TicketReadStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class TicketWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final TicketReadStatusRepository ticketReadStatusRepository;

    @Autowired
    public TicketWebSocketController(SimpMessagingTemplate messagingTemplate, TicketReadStatusRepository ticketReadStatusRepository) {
        this.messagingTemplate = messagingTemplate;
        this.ticketReadStatusRepository = ticketReadStatusRepository;
    }

    public void notifyTicketUpdate(Ticket ticket){
        List<Long> readBy = ticketReadStatusRepository.findAllByTicket(ticket).stream().map(status -> status.getUser().getId()).toList();
        TicketEmployeeResponseDTO responseDTO = TicketEmployeeResponseDTO.fromEntity(ticket, readBy);
        messagingTemplate.convertAndSend("/topic/tickets", responseDTO);
    }

    public void notifyClientTicketUpdate(Ticket ticket){
        String topic = "/topic/client/" + ticket.getClient().getId() + "/tickets";
        messagingTemplate.convertAndSend(topic, TicketClientLightResponseDTO.fromEntity(ticket));
    }

    public void notifyTicketDetailsUpdate(Ticket ticket){
        String topic = "/topic/ticket/" + ticket.getUuid();
        TicketDetailsResponseDTO detailsResponseDTO = TicketDetailsResponseDTO.fromEntity(ticket);
        messagingTemplate.convertAndSend(topic, detailsResponseDTO);
    }
}
