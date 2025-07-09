package com.healapp.dto;



import com.healapp.model.ControlPills;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PillLogsRequest {
       
    private Boolean status;
    private ControlPills controlPills;


}
