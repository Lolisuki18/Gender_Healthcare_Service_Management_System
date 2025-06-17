package com.healapp.dto;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class STIPackageResponse {
      private Long id;
      private String name;
      private String description;
      private BigDecimal price;
      private String recommended_for;
      private boolean isActive;
      private LocalDateTime createdAt;
      private LocalDateTime updatedAt;

      private List<STIServiceResponse> services;

      @Data
      @AllArgsConstructor
      @NoArgsConstructor
      public class STIServiceResponse {
          private Long id;
          private String name;
          private String description;
          private BigDecimal price;
          private boolean isActive;
      }

}
