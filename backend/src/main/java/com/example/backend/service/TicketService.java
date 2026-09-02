package com.example.backend.service;

import com.example.backend.controller.websocket.TicketWebSocketController;
import com.example.backend.dto.FileResponseDTO;
import com.example.backend.dto.ticket.*;
import com.example.backend.exception.OperationType;
import com.example.backend.exception.TicketException;
import com.example.backend.exception.UserException;
import com.example.backend.model.*;
import com.example.backend.repository.TicketHistoryRepository;
import com.example.backend.repository.TicketReadStatusRepository;
import com.example.backend.repository.TicketRepository;
import com.example.backend.service.user.ClientService;
import com.example.backend.service.user.EmployeeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketReadStatusRepository ticketReadStatusRepository;
    private final TicketHistoryRepository ticketHistoryRepository;
    private final AuthenticationService authenticationService;
    private final TicketWebSocketController ticketWebSocketController;
    private final ClientService clientService;
    private final ServiceProductService serviceProductService;
    private final FileService fileService;
    private final EmployeeService employeeService;

    @Value("${server.address}")
    private String serverAddress;

    @Value("${server.port}")
    private String serverPort;

    @Autowired
    public TicketService(TicketRepository ticketRepository, TicketReadStatusRepository ticketReadStatusRepository, EmployeeService employeeService, TicketHistoryRepository ticketHistoryRepository, AuthenticationService authenticationService, TicketWebSocketController ticketWebSocketController, ClientService clientService, ServiceProductService serviceProductService, FileService fileService, EmployeeService employeeService1) {
        this.ticketRepository = ticketRepository;
        this.ticketReadStatusRepository = ticketReadStatusRepository;
        this.ticketHistoryRepository = ticketHistoryRepository;
        this.authenticationService = authenticationService;
        this.ticketWebSocketController = ticketWebSocketController;
        this.clientService = clientService;
        this.serviceProductService = serviceProductService;
        this.fileService = fileService;
        this.employeeService = employeeService1;
    }

    public ListTicketResponseDTO getAllTicketsByEmployee(HttpServletRequest request){
        User currentUser = authenticationService.getCurrentUser(request);
        if(!authenticationService.isCurrentUserEmployee(request)){
            throw new UserException("Current user is not Employee", OperationType.RETRIEVAL, "USER");
        }

        try {
            List<Ticket> nonResolvedTickets = ticketRepository.findAllByStatusNot(TicketStatus.RESOLVED);
            List<Ticket> assignedTickets = nonResolvedTickets.stream()
                    .filter(ticket -> ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(currentUser.getId()))
                    .toList();
            List<Ticket> otherTickets = nonResolvedTickets.stream()
                    .filter(ticket -> ticket.getAssignedTo() == null || !ticket.getAssignedTo().getId().equals(currentUser.getId()))
                    .toList();
            List<TicketEmployeeResponseDTO> otherTicketsDTOs = otherTickets.stream().map(ticket -> {
                boolean isRead = ticketReadStatusRepository.existsByTicketAndUser(ticket, currentUser);
                return TicketEmployeeResponseDTO.fromEntity(ticket, isRead ? List.of(currentUser.getId()) : List.of());
            }).toList();
            List<TicketEmployeeResponseDTO> assignedTicketDTOs = assignedTickets.stream().map(ticket -> TicketEmployeeResponseDTO.fromEntity(ticket, List.of(currentUser.getId()))).toList();

            return new ListTicketResponseDTO(otherTicketsDTOs, assignedTicketDTOs);
        } catch (Exception ex) {
            throw new TicketException("Failed to get all tickets due to an error: " + ex.getMessage(), OperationType.GET);
        }
    }

    public List<Ticket> getAllActiveTicketsByClient(HttpServletRequest request){
        User currentUser = authenticationService.getCurrentUser(request);

        try{
            return ticketRepository.findAllByStatusNotAndClient(TicketStatus.RESOLVED, currentUser);
        }catch (Exception ex){
            throw new TicketException("Failed to get all active tickets by client due to an error: " + ex.getMessage(), OperationType.GET);
        }
    }

    public Ticket getTicketById(String id){
        return ticketRepository.findByUuid(id).orElseThrow(() -> new TicketException("Failed to get ticket by ID: " + id, OperationType.GET));
    }

    public TicketDetailsResponseDTO getTicketDetails(String id){
        Ticket ticket = getTicketById(id);
        return TicketDetailsResponseDTO.fromEntity(ticket);
    }

    public List<FileResponseDTO> getFilesForTicket(String ticketId){
        Ticket ticket = ticketRepository.findByUuid(ticketId).orElseThrow(() -> new TicketException("Ticket not found", OperationType.RETRIEVAL));;
        List<File> files = fileService.getFilesForTicket(ticket);

        String url = "https://" + serverAddress + ":" + serverPort;

        return files.stream()
                .map(file -> FileResponseDTO.fromEntity(file, url))
                .toList();
    }

    public Page<TicketEmployeeResponseDTO> getEmployeeArchivedTickets(Pageable pageable) {
        Page<Ticket> tickets = ticketRepository.findAllByStatus(TicketStatus.RESOLVED, pageable);
        return tickets.map(ticket -> TicketEmployeeResponseDTO.fromEntity(ticket, List.of()));
    }

    public Page<Ticket> getClientArchivedTickets(HttpServletRequest request, int page, int size){
        User currentUser = authenticationService.getCurrentUser(request);
        return ticketRepository.findAllByCompanyAndStatus(
                currentUser.getCompany(),
                TicketStatus.RESOLVED,
                PageRequest.of(page, size)
        );
    }

    @Transactional
    public Ticket createTicket(TicketRequestDTO requestDTO, List<MultipartFile> files){
        User client = clientService.getUserByIdAndRole(requestDTO.getClientId(), "CLIENT");

        Ticket ticket = new Ticket();
        ticket.setUuid(generateUUID());
        ticket.setTitle(requestDTO.getTitle());
        ticket.setDescription(requestDTO.getDescription());
        ticket.setClient(client);
        ticket.setCompany(client.getCompany());

        if(requestDTO.getServiceProductId() != null){
            ServiceProduct service = serviceProductService.getServiceById(requestDTO.getServiceProductId());
            ticket.setServiceProduct(service);
        }

        try{
            ticketRepository.save(ticket);

            TicketHistory history = new TicketHistory();
            history.setTicket(ticket);
            history.setPerformedBy(client);
            history.setAction("Wysłanie zgłoszenia");
            ticketHistoryRepository.save(history);
        }catch (Exception ex){
            throw new TicketException("Failed to create ticket: " + ex.getMessage(), OperationType.CREATION);
        }

        if(files != null && !files.isEmpty()){
            fileService.saveFiles(files, ticket);
        }
        ticketWebSocketController.notifyTicketUpdate(ticket);
        return ticket;
    }

    @Transactional
    public Boolean markTicketAsRead(String id, HttpServletRequest request){
        Ticket ticket = getTicketById(id);
        User currentUser = authenticationService.getCurrentUser(request);
        boolean isRead = ticketReadStatusRepository.existsByTicketAndUser(ticket, currentUser);
        if(isRead){
            return true;
        }
        TicketReadStatus readStatus = new TicketReadStatus();
        readStatus.setTicket(ticket);
        readStatus.setUser(currentUser);
        try{
            ticketReadStatusRepository.save(readStatus);
            ticketWebSocketController.notifyTicketUpdate(ticket);
            return true;
        }catch (Exception ex){
            throw new TicketException("Failed to mark ticket as read: " + ex.getMessage(), OperationType.CREATION);
        }
    }

    @Transactional
    public Map<String, Object> assignTicket(String id, HttpServletRequest request){
        User employee = authenticationService.getCurrentUser(request);
        Ticket ticket = getTicketById(id);

        if(ticket.getAssignedTo() != null){
            return Map.of("assigned", false, "status", 2);
        }

        ticket.setAssignedTo(employee);
        ticket.setStatus(TicketStatus.ASSIGNED);

        try{
            Ticket updatedTicket = ticketRepository.save(ticket);

            TicketHistory history = new TicketHistory();
            history.setTicket(ticket);
            history.setPerformedBy(employee);
            history.setAction("Zgłoszenie przyjęte przez " + employee.getFirstName() + " " + employee.getLastName());
            ticketHistoryRepository.save(history);

            ticketWebSocketController.notifyTicketUpdate(updatedTicket);
            ticketWebSocketController.notifyClientTicketUpdate(updatedTicket);
            ticketWebSocketController.notifyTicketDetailsUpdate(updatedTicket);
            return Map.of("assigned", true, "status", 1);
        }catch (Exception ex){
            throw new TicketException("Failed to assign ticket to employee: " + ex.getMessage(), OperationType.CREATION);
        }
    }

    @Transactional
    public TicketEmployeeResponseDTO forwardTicket(String id, Long userId, HttpServletRequest request){
        User currentUser = authenticationService.getCurrentUser(request);
        User userToForward = employeeService.getUserByIdAndRole(userId, "EMPLOYEE");
        Ticket ticket = getTicketById(id);

        ticket.setAssignedTo(userToForward);
        ticket.setStatus(TicketStatus.FORWARDED);

        try{
            Ticket updatedTicket = ticketRepository.save(ticket);

            TicketHistory history = new TicketHistory();
            history.setTicket(updatedTicket);
            history.setPerformedBy(currentUser);
            history.setAction("Zgłoszenie przekazano do " + userToForward.getFirstName() + " " + userToForward.getLastName());

            ticketHistoryRepository.save(history);

            List<Long> readStatusList = ticketReadStatusRepository.findAllByTicket(updatedTicket).stream().map(r -> r.getUser().getId()).toList();

            ticketWebSocketController.notifyTicketUpdate(updatedTicket);
            ticketWebSocketController.notifyClientTicketUpdate(updatedTicket);
            ticketWebSocketController.notifyTicketDetailsUpdate(updatedTicket);

            return TicketEmployeeResponseDTO.fromEntity(updatedTicket, readStatusList);
        }catch (Exception ex){
            System.out.println("\n" + ex.getMessage() +"\n");
            throw new TicketException("Failed to forworad ticket: " + ex.getMessage(), OperationType.UPDATE);
        }
    }

    @Transactional
    public void acceptForward(String id, HttpServletRequest request){
        User currentUser = authenticationService.getCurrentUser(request);
        Ticket ticket = getTicketById(id);

        if(ticket.getAssignedTo().getId().equals(currentUser.getId()) && ticket.getStatus().equals(TicketStatus.FORWARDED)){
            ticket.setStatus(TicketStatus.ASSIGNED);

            try{
                Ticket updatedTicket = ticketRepository.save(ticket);

                TicketHistory history = new TicketHistory();
                history.setTicket(updatedTicket);
                history.setPerformedBy(currentUser);
                history.setAction("Zgłoszenie przyjęte przez " + currentUser.getFirstName() + " " + currentUser.getLastName());

                ticketHistoryRepository.save(history);
                ticketWebSocketController.notifyTicketUpdate(updatedTicket);
                ticketWebSocketController.notifyClientTicketUpdate(updatedTicket);
                ticketWebSocketController.notifyTicketDetailsUpdate(updatedTicket);
            }catch (Exception ex){
                throw new TicketException("Failed to accept forward: " + ex.getMessage(), OperationType.UPDATE);
            }
        }
    }

    @Transactional
    public void closeTicket(String id, HttpServletRequest request){
        User currentUser = authenticationService.getCurrentUser(request);
        Ticket ticket = getTicketById(id);

        if(ticket.getAssignedTo().getId().equals(currentUser.getId())){
            ticket.setStatus(TicketStatus.RESOLVED);
            try{
                Ticket updatedTicket = ticketRepository.save(ticket);

                TicketHistory history = new TicketHistory();
                history.setTicket(updatedTicket);
                history.setPerformedBy(currentUser);
                history.setAction("Zgłoszenie zostało zamknięte");

                ticketHistoryRepository.save(history);
                ticketWebSocketController.notifyTicketUpdate(updatedTicket);
                ticketWebSocketController.notifyClientTicketUpdate(updatedTicket);
                ticketWebSocketController.notifyTicketDetailsUpdate(updatedTicket);
            }catch (Exception ex){
                throw new TicketException("Failed to close the ticket: " + ex.getMessage(), OperationType.UPDATE);
            }
        }else{
            throw new TicketException("This user can't close the ticket.", OperationType.UPDATE);
        }
    }

    public Boolean isTicketRead(Ticket ticket, HttpServletRequest request){
        User user = authenticationService.getCurrentUser(request);
        return ticketReadStatusRepository.existsByTicketAndUser(ticket, user);
    }

    private String generateUUID(){
        String uuid = UUID.randomUUID().toString();
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy_MM_dd"));
        return uuid + "_" + date;
    }
}
