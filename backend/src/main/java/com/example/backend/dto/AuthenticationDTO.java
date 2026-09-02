package com.example.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationDTO {
    private String token;
    private String role;
    private Boolean isFirstLogin;
    private Long userId;
}
