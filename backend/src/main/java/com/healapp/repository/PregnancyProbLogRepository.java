package com.healapp.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.healapp.model.MenstrualCycle;
import com.healapp.model.PregnancyProbLog;

@Repository
public interface PregnancyProbLogRepository extends JpaRepository<PregnancyProbLog, Long> {

    @Query("SELECT p FROM PregnancyProbLog p WHERE p.menstrualCycle.id = :menstrualCycleId ORDER BY p.date ASC")
    Optional<List<PregnancyProbLog>> findAllByMenstrualCycleId(Long menstrualCycleId);

    // Tìm tất cả pregnancy prob logs theo chu kỳ, sắp xếp theo ngày
    List<PregnancyProbLog> findByMenstrualCycleOrderByDateAsc(MenstrualCycle menstrualCycle);

    // Tìm pregnancy prob log theo chu kỳ và ngày cụ thể
    Optional<PregnancyProbLog> findByMenstrualCycleAndDate(MenstrualCycle menstrualCycle, LocalDate date);

    // Tìm pregnancy prob logs trong khoảng thời gian
    @Query("SELECT p FROM PregnancyProbLog p WHERE p.menstrualCycle = :menstrualCycle AND p.date BETWEEN :startDate AND :endDate ORDER BY p.date ASC")
    List<PregnancyProbLog> findByMenstrualCycleAndDateBetween(
        @Param("menstrualCycle") MenstrualCycle menstrualCycle, 
        @Param("startDate") LocalDate startDate, 
        @Param("endDate") LocalDate endDate
    );

}
