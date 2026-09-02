package com.example.backend.dto.user.admin;

import com.example.backend.model.User;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminResponseDTO fromEntity(User user){
        return new AdminResponseDTO(user.getId(), user.getFirstName(),user.getLastName(), user.getUsername(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt());
    }
}
