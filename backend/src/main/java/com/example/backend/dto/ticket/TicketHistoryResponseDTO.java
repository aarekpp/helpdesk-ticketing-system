package com.example.backend.dto.ticket;

import com.example.backend.dto.user.employee.EmployeeResponseDTO;
import com.example.backend.model.TicketHistory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketHistoryResponseDTO {
    private Long id;
    private String action;
    private EmployeeResponseDTO employee;
    private LocalDateTime createdAt;

    public static TicketHistoryResponseDTO fromEntity(TicketHistory history){
        return new TicketHistoryResponseDTO(
                history.getId(),
                history.getAction(),
                EmployeeResponseDTO.fromEntity(history.getPerformedBy()),
                history.getTimestamp()
        );
    }
}
