package com.healapp.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.healapp.model.MenstrualCycle;

@Repository
public interface MenstrualCycleRepository extends JpaRepository<MenstrualCycle, Long> {

    @Query("SELECT m FROM MenstrualCycle m WHERE m.user.id = :userId")
    Optional<List<MenstrualCycle>> findAllByUserId(Long userId);

    @Query("SELECT c FROM MenstrualCycle c WHERE c.user.id = :userId AND c.startDate <= :today ORDER BY c.startDate DESC")
    Optional<MenstrualCycle> findLatestCycleBeforeToday(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT mc FROM MenstrualCycle mc WHERE mc.user.id = :userId ORDER BY mc.startDate DESC")
    Optional<MenstrualCycle> findLatestCycleByUserId(@Param("userId") Long userId);

    Optional<MenstrualCycle> findTopByUserIdOrderByStartDateDesc(Long userId);
}
