package com.healapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.healapp.model.MenstrualCycle;

@Repository
public interface MenstrualCycleRepository extends JpaRepository<MenstrualCycle, Long> {

    @Query("SELECT m FROM MenstrualCycle m WHERE m.user.id = :id")
    Optional<List<MenstrualCycle>> findAllById(Long id);

}
