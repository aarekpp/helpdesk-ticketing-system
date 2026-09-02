package com.example.backend.repository;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByRole_Name(String roleName);
    List<User> findByRole(Role role);
    Optional<User> findByIdAndRole_Name(Long id, String roleName);
    List<User> findByRole_NameAndCompanyIsNull(String roleName);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
