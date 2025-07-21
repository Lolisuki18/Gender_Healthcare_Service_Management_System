package com.healapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healapp.model.STIService;
import com.healapp.model.STITest;
import com.healapp.model.TestServiceConsultantNote;

@Repository
public interface TestServiceConsultantNoteRepository extends JpaRepository<TestServiceConsultantNote, Long> {
    List<TestServiceConsultantNote> findByStiTest(STITest stiTest);
    List<TestServiceConsultantNote> findByStiTestAndService(STITest stiTest, STIService service);
    List<TestServiceConsultantNote> findByStiTest_TestId(Long stiTestId);
} 