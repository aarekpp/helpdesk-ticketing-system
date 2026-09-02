package com.example.backend.repository;

import com.example.backend.model.File;
import com.example.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findAllByTicket(Ticket ticket);
}
