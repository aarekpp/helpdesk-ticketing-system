package com.example.backend.controller;

import com.example.backend.config.ApiResponse;
import com.example.backend.dto.FileResponseDTO;
import com.example.backend.dto.ticket.*;
import com.example.backend.model.Ticket;
import com.example.backend.service.TicketService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/employee")
    public ResponseEntity<ApiResponse<ListTicketResponseDTO>> getAllTicketsByEmployee(HttpServletRequest request){
        ListTicketResponseDTO tickets = ticketService.getAllTicketsByEmployee(request);
        return ResponseEntity.ok(ApiResponse.success(tickets, "Fetched all tickets by employee successfully."));
    }

    @GetMapping("/client")
    public ResponseEntity<ApiResponse<List<TicketClientLightResponseDTO>>> getAllActiveTicketsByClient(HttpServletRequest request){
        List<Ticket> tickets = ticketService.getAllActiveTicketsByClient(request);
        List<TicketClientLightResponseDTO> ticketDTOs = tickets.stream().map(TicketClientLightResponseDTO::fromEntity).toList();
        return ResponseEntity.ok(ApiResponse.success(ticketDTOs, "Fetched all active tickets by client successfully."));
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<ApiResponse<TicketDetailsResponseDTO>> getTicketDetails(@PathVariable String id){
        TicketDetailsResponseDTO responseDTOS = ticketService.getTicketDetails(id);
        return ResponseEntity.ok(ApiResponse.success(responseDTOS, "Fetched ticket details successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketEmployeeResponseDTO>> getTicketById(@PathVariable String id, HttpServletRequest request){
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ApiResponse.success(TicketEmployeeResponseDTO.fromEntity(ticket, List.of()), "Fetched ticket by ID successfully."));
    }

    @GetMapping("/archive/{id}")
    public ResponseEntity<ApiResponse<TicketArchiveResponseDTO>> getTicketArchive(@PathVariable String id){
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ApiResponse.success(TicketArchiveResponseDTO.fromEntity(ticket), "Fetched ticket archive history successfully."));
    }

    @GetMapping("/{id}/files")
    public ResponseEntity<ApiResponse<List<FileResponseDTO>>> getAllFilesForTicket(@PathVariable String id){
        List<FileResponseDTO> files = ticketService.getFilesForTicket(id);
        return ResponseEntity.ok(ApiResponse.success(files, "Files retrieved successfully."));
    }

    @GetMapping("/employee/archive")
    public ResponseEntity<ApiResponse<Page<TicketEmployeeResponseDTO>>> getEmployeeArchivedTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TicketEmployeeResponseDTO> tickets = ticketService.getEmployeeArchivedTickets(pageable);
        return ResponseEntity.ok(ApiResponse.success(tickets, "Fetched archived tickets successfully."));
    }

    @GetMapping("/client/archive")
    public ResponseEntity<ApiResponse<Page<TicketClientLightResponseDTO>>> getClientArchivedTickets(
            HttpServletRequest request,
            @RequestParam int page,
            @RequestParam int size){
        Page<Ticket> tickets = ticketService.getClientArchivedTickets(request, page, size);
        Page<TicketClientLightResponseDTO> response = tickets.map(TicketClientLightResponseDTO::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(response, "Fetched archived tickets successfully."));
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ApiResponse<TicketEmployeeResponseDTO>> createTicket(
            @RequestPart("ticket") String ticketData,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        TicketRequestDTO ticketRequestDTO = objectMapper.readValue(ticketData, TicketRequestDTO.class);

        Ticket ticket = ticketService.createTicket(ticketRequestDTO, files);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(TicketEmployeeResponseDTO.fromEntity(ticket, List.of()), "Ticket created successfully."));
    }

    @PostMapping("/mark-as-read/{id}")
    public ResponseEntity<ApiResponse<Boolean>> markTicketAsRead(@PathVariable String id, HttpServletRequest request){
        Boolean ticketMarked = ticketService.markTicketAsRead(id, request);
        return ResponseEntity.ok(ApiResponse.success(ticketMarked,"Ticket marked as read successfully"));
    }

    @PostMapping("/assign/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> assignTicketToEmployee(@PathVariable String id, HttpServletRequest request){
        Map<String, Object> ticketAssigned = ticketService.assignTicket(id, request);
        return ResponseEntity.ok(ApiResponse.success(ticketAssigned, "Ticket assigned to employee successfully."));
    }

    @PostMapping("/forward/{id}")
    public ResponseEntity<ApiResponse<TicketEmployeeResponseDTO>> forwardTicket(@PathVariable String id, @RequestBody Map<String, Long> payload, HttpServletRequest request){
        TicketEmployeeResponseDTO ticket = ticketService.forwardTicket(id, payload.get("userId"), request);
        return ResponseEntity.ok(ApiResponse.success(ticket, "Ticket forwarded successfully."));
    }

    @PutMapping("/accept-forward/{id}")
    public ResponseEntity<ApiResponse<Void>> acceptForward(@PathVariable String id, HttpServletRequest request){
        ticketService.acceptForward(id,request);
        return ResponseEntity.ok(ApiResponse.success(null,"Forward accepted successfully"));
    }

    @PutMapping("/close/{id}")
    public ResponseEntity<ApiResponse<Void>> closeTicket(@PathVariable String id, HttpServletRequest request){
        ticketService.closeTicket(id, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Ticket closed successfully."));
    }
}
