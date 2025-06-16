package com.healapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healapp.model.PackageService;

@Repository
public interface PackageServiceRepository extends JpaRepository<PackageService, Long> {
}
