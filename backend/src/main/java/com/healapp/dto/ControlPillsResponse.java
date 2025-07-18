package com.healapp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.healapp.model.PillType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ControlPillsResponse {
    private Long pillsId;
    private LocalDate startDate;
    private Boolean isActive;
    private LocalTime remindTime;
    private int numberDaysDrinking;
    private int numberDaysOff;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PillType pillType;
    
      

}

