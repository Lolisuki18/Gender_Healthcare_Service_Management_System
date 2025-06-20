package com.healapp.dto;

import java.time.LocalDate;

import com.healapp.model.UserDtls;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenstrualCycleRequest {

    @NotNull(message = "Ngày bắt đầu chu kỳ kinh nguyệt không được để trống")
    private LocalDate startDate;

    @NotNull(message = "Số ngày hành kinh không được để trống")
    private Long numberOfDays;

    @NotNull(message = "Chu kỳ kinh nguyệt không được để trống")
    private Long cycleLength;

    private Boolean reminderEnabled = false;

}
