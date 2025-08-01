package com.healapp.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.healapp.model.ControlPills;
import com.healapp.model.PillLogs;

import jakarta.transaction.Transactional;

@Repository
public interface PillLogsRepository extends JpaRepository<PillLogs, Long>{
    
    @Modifying
    @Transactional
    @Query("DELETE FROM PillLogs p WHERE p.controlPills.pillsId = :pillsId AND p.logDate > CURRENT_DATE")
    void deleteLogsAfterToday(@Param("pillsId") Long pillsId);

    Optional<PillLogs> findByControlPillsAndLogDate(ControlPills controlPills, LocalDate logDate);

    List<PillLogs> findByControlPills(ControlPills controlPills);

    List<PillLogs> findByControlPillsAndStatus(ControlPills controlPills, Boolean status);

    Optional<PillLogs> findTopByControlPillsOrderByLogDateDesc(ControlPills controlPills);

    @Modifying
    @Transactional
    void deleteByControlPills(ControlPills controlPills);
}
