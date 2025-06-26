package com.healapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceTestComponentRequest {

    private Long componentId;

    @NotBlank(message = "Test name is required")
    @Size(max = 100, message = "Test name must not exceed 100 characters")
    private String testName;

    @Size(max = 50, message = "Unit must not exceed 50 characters")
    private String unit;

    @Size(max = 100, message = "Reference range must not exceed 100 characters")
    private String referenceRange;

    @Size(max = 200, message = "Interpretation must not exceed 200 characters")
    private String interpretation;

    @Size(max = 100, message = "Sample type must not exceed 100 characters")
    private String sampleType;

    private Boolean isActive = true;
}
