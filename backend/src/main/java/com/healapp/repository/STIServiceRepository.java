package com.healapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healapp.model.STIService;

@Repository
public interface STIServiceRepository extends JpaRepository<STIService, Long> {

    boolean existsByName(String name);

}
