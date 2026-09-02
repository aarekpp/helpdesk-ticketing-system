package com.example.backend.repository;

import com.example.backend.model.Ticket;
import com.example.backend.model.TicketReadStatus;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketReadStatusRepository extends JpaRepository<TicketReadStatus, Long> {
    boolean existsByTicketAndUser(Ticket ticket, User user);
    List<TicketReadStatus> findAllByTicket(Ticket ticket);
}
