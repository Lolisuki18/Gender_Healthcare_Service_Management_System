package com.healapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healapp.model.ControlPills;

@Repository
public interface ControlPillsRepository extends JpaRepository<ControlPills, Long> {

}
