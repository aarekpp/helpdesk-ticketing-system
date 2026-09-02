package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordDTO {
    @NotBlank(message = "{user.changePassword.oldPassword.required}")
    private String oldPassword;
    @NotBlank(message = "user.changePassword.newPassword.required")
    private String newPassword;
}
