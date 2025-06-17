package com.healapp.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class STIPackageResquest{

    @NotBlank(message = "Package name is request")
    @Size(max = 200, message = "Package must not exceed 100 characters")
    private String name;

    private String description;
    
    @NotNull(message = "Price name is request")
    private BigDecimal price;

    private Boolean isActive;
    
    private List<Long> stiService;
}




