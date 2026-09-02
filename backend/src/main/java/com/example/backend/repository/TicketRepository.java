package com.example.backend.repository;

import com.example.backend.model.Company;
import com.example.backend.model.Ticket;
import com.example.backend.model.TicketStatus;
import com.example.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findAllByStatusNot(TicketStatus status);
    List<Ticket> findAllByStatusNotAndClient(TicketStatus status, User client);
    Optional<Ticket> findByUuid(String uuid);
    Page<Ticket> findAllByStatus(TicketStatus status, Pageable pageable);
    Page<Ticket> findAllByCompanyAndStatus(Company company, TicketStatus status, Pageable pageable);
}
