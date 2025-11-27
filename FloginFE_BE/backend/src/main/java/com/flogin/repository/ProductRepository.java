package com.flogin.repository;

import com.flogin.entity.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(value = "SELECT * FROM product WHERE name LIKE %?1%", nativeQuery = true)
    List<Product> findByNameContaining(String name);
    Page<Product> findAll(Pageable pageable);
}
