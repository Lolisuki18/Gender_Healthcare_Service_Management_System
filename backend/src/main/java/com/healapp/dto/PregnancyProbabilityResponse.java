package com.healapp.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PregnancyProbabilityResponse {
    private LocalDate date;
    private Double pregnancyProbability;
    private String dayType;
    private Integer dayOfCycle;
}
