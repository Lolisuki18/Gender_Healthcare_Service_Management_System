package com.healapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healapp.model.CategoryQuestion;

public interface CategoryQuestionRepository extends JpaRepository<CategoryQuestion, Long> {
    boolean existsByName(String name);
    boolean existsByNameAndIsActiveTrue(String name);
    Optional<CategoryQuestion> findByIdAndIsActiveTrue(Long id);
    List<CategoryQuestion> findAllByIsActiveTrue();
}