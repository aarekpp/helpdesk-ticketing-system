package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "{user.firstName.required}")
    @Size(min = 2, max = 50, message = "{user.firstName.size}")
    @Pattern(regexp = "^[a-zA-ZąęłńóśźżćĄĆĘŁŃÓŚŹŻ]+$", message = "{user.firstName.invalid}")
    @Column(nullable = false)
    private String firstName;

    @NotBlank(message = "{user.lastName.required}")
    @Size(min = 2, max = 100, message = "{user.lastName.size}")
    @Pattern(regexp = "^[a-zA-ZżźąęłńóśćĄĆĘŁŃÓŚŹŻ' -]+$", message = "{user.lastName.invalid}")
    @Column(nullable = false)
    private String lastName;

    @NotBlank(message = "{user.email.required}")
    @Email(message = "{user.email.invalid}")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "{user.username.required}")
    @Size(min = 3, max = 50, message = "{user.username.size}")
    @Pattern(regexp = "^[a-zA-ZąęłńóśźżćĄĆĘŁŃÓŚŹŻ0-9-_.]+$", message = "{user.username.invalid}")
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank(message = "{user.password.required}")
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean isFirstLogin = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "company_id")
    private Company company;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}

