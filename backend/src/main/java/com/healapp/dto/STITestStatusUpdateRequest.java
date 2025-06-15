package com.healapp.dto;

import com.healapp.model.STITestStatus;
import lombok.Data;

import java.util.List;

@Data
public class STITestStatusUpdateRequest {
    private STITestStatus status;
    private List<TestResultRequest> results; // Used when updating to RESULTED status
}