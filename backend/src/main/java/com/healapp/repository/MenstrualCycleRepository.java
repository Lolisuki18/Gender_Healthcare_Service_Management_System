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

    @Query("SELECT mc FROM MenstrualCycle mc WHERE mc.user.id = :userId ORDER BY mc.startDate DESC")
    List<MenstrualCycle> findLatestCycleByUserIdList(@Param("userId") Long userId);

    default Optional<MenstrualCycle> findLatestCycleByUserId(Long userId) {
        List<MenstrualCycle> results = findLatestCycleByUserIdList(userId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    Optional<MenstrualCycle> findTopByUserIdOrderByStartDateDesc(Long userId);
}
