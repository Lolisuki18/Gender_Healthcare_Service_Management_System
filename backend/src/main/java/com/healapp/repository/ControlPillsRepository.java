package com.healapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healapp.model.ControlPills;
import com.healapp.model.UserDtls;

@Repository
public interface ControlPillsRepository extends JpaRepository<ControlPills, Long> {
    Optional<List<ControlPills>> findByUserIdAndIsActive(UserDtls user, Boolean isActive);
    List<ControlPills> findByIsActive(Boolean isActive);
    List<ControlPills> findByUserId_Id(Long userId);
}
