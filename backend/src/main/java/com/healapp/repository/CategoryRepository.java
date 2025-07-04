package com.healapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healapp.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    boolean existsByName(String name);

    Optional<Category> findByNameAndIsActiveTrue(String name);

    Optional<Category> findByCategoryIdAndIsActiveTrue(Long categoryId);

    Optional<Category> findByCategoryId(Long categoryId);

    List<Category> findAllByIsActiveTrue();
}