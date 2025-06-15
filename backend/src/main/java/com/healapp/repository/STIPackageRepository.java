package com.healapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healapp.model.STIPackage;

@Repository
public interface STIPackageRepository extends JpaRepository<STIPackage, Long> {
    
}
