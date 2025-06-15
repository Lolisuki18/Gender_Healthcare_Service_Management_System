package com.healapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healapp.model.STITest;

@Repository
public interface STITestRepository extends JpaRepository<STITest, Long> {

}
