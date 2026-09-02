package com.example.backend.dto.user;

import com.example.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BasicUserResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String username;

    public static BasicUserResponseDTO fromEntity(User user){
        return new BasicUserResponseDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getUsername());
    }
}
