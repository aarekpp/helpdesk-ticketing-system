package com.example.backend.security;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenDetails {
    private Long userId;
    private String role;
}
