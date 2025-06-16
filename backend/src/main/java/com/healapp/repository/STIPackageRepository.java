package com.healapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.healapp.model.STIPackage;

@Repository
public interface STIPackageRepository extends JpaRepository<STIPackage, Long>{

}
