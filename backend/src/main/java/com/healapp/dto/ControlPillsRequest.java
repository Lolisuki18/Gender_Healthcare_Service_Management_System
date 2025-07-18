package com.healapp.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.healapp.model.PillType;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ControlPillsRequest {

    @NotNull(message = "Số ngày uống thuốc không được để trống")
    private Integer numberDaysDrinking;

    @NotNull(message = "Số ngày nghỉ không được để trống")
    private Integer numberDaysOff;

    @NotNull(message = "Ngày bắt đầu uống thuốc không được để trống")
    private LocalDate startDate;

    @NotNull(message = "Thời gian nhắc nhở không được để trống")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime remindTime;

    private Boolean isActive;

    @NotNull(message = "Loại thuốc không được để trống")
    private PillType pillType;


}

