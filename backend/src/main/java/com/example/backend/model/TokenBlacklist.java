package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tokens_blacklist")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenBlacklist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Token can not be blank")
    @Size(min = 100, max = 1000, message = "Token length is not valid")
    @Column(name = "token",nullable = false)
    private String token;

    @NotNull(message = "expiry_time can not be null")
    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;
}
