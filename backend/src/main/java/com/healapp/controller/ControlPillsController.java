package com.healapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ControlPillsRequest;
import com.healapp.service.ControlPillsService;
import com.healapp.dto.ControlPillsResponse;


import jakarta.validation.Valid;

@RestController
@RequestMapping("/contraceptive")
public class ControlPillsController {
     @Autowired
     private ControlPillsService controlPillsService;

     @PostMapping
     @PreAuthorize("hasRole('ROLE_CUSTOMER')")
     public ResponseEntity<ApiResponse<ControlPillsResponse>> createControlPills(@RequestBody @Valid ControlPillsRequest request){
        ApiResponse<ControlPillsResponse> response = controlPillsService.createControlPills(request);
        return ResponseEntity.ok(response);
     }
}
