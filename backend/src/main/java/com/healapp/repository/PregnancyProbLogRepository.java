package com.healapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.healapp.model.PregnancyProbLog;

@Repository
public interface PregnancyProbLogRepository extends JpaRepository<PregnancyProbLog, Long> {

    @Query("SELECT p FROM PregnancyProbLog p WHERE p.menstrualCycle.id = :menstrualCycleId ORDER BY p.date ASC")
    Optional<List<PregnancyProbLog>> findAllByMenstrualCycleId(Long menstrualCycleId);

}
