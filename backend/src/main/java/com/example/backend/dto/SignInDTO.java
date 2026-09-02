package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignInDTO {
    @NotBlank(message = "{user.username.required}")
    private String username;
    @NotBlank(message = "{user.password.required}")
    private String password;
}
