package com.example.backend.dto.user.client;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientRequestDTO {
    @NotBlank(message = "{user.firstName.required}")
    private String firstName;
    @NotBlank(message = "{user.lastName.required}")
    private String lastName;
    @NotBlank(message = "{user.username.required}")
    private String username;
    @NotBlank(message = "{user.email.required}")
    private String email;
    private String password;
    private Long companyId;
    private boolean changePasswordRequired;
}
