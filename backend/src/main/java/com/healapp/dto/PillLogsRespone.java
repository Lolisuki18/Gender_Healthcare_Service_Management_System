package com.healapp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PillLogsRespone {
    private Long logId;
    private LocalDateTime checkIn;
    private LocalDateTime createdAt;
    private Boolean status;
    private LocalDate logDate;
      
}
