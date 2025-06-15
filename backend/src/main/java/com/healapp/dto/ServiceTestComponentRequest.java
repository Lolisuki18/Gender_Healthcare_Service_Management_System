package com.healapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceTestComponentRequest {
    public String testName;
    public String unit;
    public String referenceRange;
    public String interpretation;
}
