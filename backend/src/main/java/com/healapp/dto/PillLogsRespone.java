package com.healapp.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data

public class PillLogsRespone {
    private Long logId;
    private LocalDateTime checkIn;
    private LocalDateTime createdAt;
    private Boolean status;
      
}
// log_id BIGINT [pk, increment]
// pills_id BIGINT
// check_in TIMESTAMP
// created_at TIMESTAMP
// status BOOLEAN
// }