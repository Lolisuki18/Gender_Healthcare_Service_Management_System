package com.healapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class STIServiceResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Thông tin về các thành phần xét nghiệm liên quan đến dịch vụ
    private int componentCount;
    private List<ServiceComponent> components;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceComponent {
        private Long componentId;
        private String componentName;
        private String unit;
        private String normalRange;
        private String description;
        private String sampleType;
        private boolean isActive;
    }
}
