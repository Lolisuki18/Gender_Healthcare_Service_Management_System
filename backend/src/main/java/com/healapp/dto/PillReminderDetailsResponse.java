package com.healapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PillReminderDetailsResponse {
    private ControlPillsResponse controlPills;
    private List<PillLogsRespone> pillLogs;
} 