package com.example.backend.repository;

import com.example.backend.model.ServiceProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceProductRepository extends JpaRepository<ServiceProduct, Long> {
    boolean existsByName(String name);
}
