package com.healapp.dto;

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
public class STIServiceRequest {

    @NotBlank(message = "Service name is required")
    @Size(max = 100, message = "Service name must not exceed 100 characters")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    private double price;

    private boolean active;

    private List<ServiceTestComponentRequest> components;
}

