package com.healapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.healapp.model.ServiceTestComponent;

@Repository
public interface ServiceTestComponentRepository extends JpaRepository<ServiceTestComponent, Long> {

    @Query("UPDATE ServiceTestComponent s SET s.testName = :testName, s.unit = :unit, s.referenceRange = :referenceRange, s.interpretation = :interpretation WHERE s.id = :id")
    void updateServiceTestComponent(
            @Param("testName") String testName,
            @Param("unit") String unit,
            @Param("referenceRange") String referenceRange,
            @Param("interpretation") String interpretation,
            @Param("id") Long id
    );

    boolean existsById(Long id);

}
