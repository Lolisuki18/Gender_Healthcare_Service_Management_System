package com.healapp.dto;

import java.time.LocalDate;
import java.util.List;

import com.healapp.model.PregnancyProbLog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenstrualCycleResponse {

    private Long id;
    private Long userId;
    private LocalDate startDate;
    private Long numberOfDays;
    private Long cycleLength;
    private LocalDate ovulationDate;
    private Boolean reminderEnabled;

    // Thông tin tỉ lệ mang thai dựa vào chu kỳ kinh nguyệt
    private List<PregnancyProbLog> pregnancyProbLogs;

}
