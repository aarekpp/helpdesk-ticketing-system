package com.example.backend.service;

import com.example.backend.controller.websocket.TicketWebSocketController;
import com.example.backend.exception.MessageException;
import com.example.backend.exception.OperationType;
import com.example.backend.model.Message;
import com.example.backend.model.Ticket;
import com.example.backend.model.User;
import com.example.backend.repository.MessageRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final AuthenticationService authenticationService;
    private final TicketService ticketService;
    private final FileService fileService;
    private final TicketWebSocketController ticketWebSocketController;

    public MessageService(MessageRepository messageRepository, AuthenticationService authenticationService, TicketService ticketService, FileService fileService, TicketWebSocketController ticketWebSocketController) {
        this.messageRepository = messageRepository;
        this.authenticationService = authenticationService;
        this.ticketService = ticketService;
        this.fileService = fileService;
        this.ticketWebSocketController = ticketWebSocketController;
    }

    @Transactional
    public Message saveMessage(HttpServletRequest request, String ticketId, String message, List<MultipartFile> files){
        User currentUser = authenticationService.getCurrentUser(request);
        Ticket ticket = ticketService.getTicketById(ticketId);
        Message newMessage = new Message();

        newMessage.setContent(message);
        newMessage.setTicket(ticket);
        newMessage.setAuthor(currentUser);

        try{
            messageRepository.save(newMessage);
        }catch (Exception ex){
            ex.printStackTrace();
            throw new MessageException("Error during save new message", OperationType.CREATION);
        }

        if(files != null && !files.isEmpty()){
            fileService.saveMessageFiles(files, newMessage);
        }
        Ticket updatedTicket = ticketService.getTicketById(ticketId);
        ticketWebSocketController.notifyTicketDetailsUpdate(updatedTicket);
        return newMessage;
    }
}
