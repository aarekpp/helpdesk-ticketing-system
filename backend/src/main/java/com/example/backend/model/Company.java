package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "companies")
@EntityListeners(AuditingEntityListener.class)
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "{company.name.required}")
    @Size(min = 3, max = 250, message = "{company.name.size}")
    @Pattern(regexp = "^.{3,250}$", message = "{company.name.invalid}")
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank(message = "{company.city.required}")
    @Size(min = 2, max = 100, message = "{company.city.size}")
    @Pattern(regexp = "^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\\s\\-]{2,100}$", message = "{company.city.invalid}")
    @Column(nullable = false)
    private String city;

    @NotBlank(message = "{company.zipCode.required}")
    @Pattern(regexp = "^\\d{2}-\\d{3}$", message = "{company.zipCode.invalid}")
    @Size(min = 6, max = 6, message = "{company.zipCode.size}")
    @Column(name = "zip_code", nullable = false)
    private  String zipCode;

    @NotBlank(message = "{company.address.required}")
    @Size(min = 2, max = 350, message = "{company.address.size}")
    @Pattern(regexp = "^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ,./-]{2,350}$", message = "{company.address.invalid}")
    @Column(nullable = false)
    private String address;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "company_service",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private Set<ServiceProduct> serviceProducts = new HashSet<>();

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();

    @CreatedDate
    @Column(nullable = false, updatable = false, name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "updated_at")
    private LocalDateTime updatedAt;
}
