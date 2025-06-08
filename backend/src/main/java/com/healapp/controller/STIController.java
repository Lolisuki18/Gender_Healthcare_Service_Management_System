package com.healapp.controller;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.STIServiceResponse;
import com.healapp.service.STIServiceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sti-services")
public class STIController {

    @Autowired
    private STIServiceService stiServiceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<STIServiceResponse>>> getActiveSTIServices() {
        ApiResponse<List<STIServiceResponse>> response = stiServiceService.getActiveServices();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sti-services/{serviceId}")
    public ResponseEntity<ApiResponse<STIServiceResponse>> getSTIServiceDetails(@PathVariable Long serviceId) {
        ApiResponse<STIServiceResponse> response = stiServiceService.getServiceWithComponents(serviceId);
        return ResponseEntity.ok(response);
    }

}