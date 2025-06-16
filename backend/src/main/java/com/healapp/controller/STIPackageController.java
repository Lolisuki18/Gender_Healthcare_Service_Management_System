package com.healapp.controller;

import org.springframework.web.bind.annotation.RestController;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.STIPackageResponse;
import com.healapp.dto.STIPackageResquest;
import com.healapp.service.STIPackageService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/sti-packages")
public class STIPackageController {
    @Autowired
    private STIPackageService stiPackageService;

    //Lấy ra thông tin của gói 
    @GetMapping
    public ResponseEntity<ApiResponse<List<STIPackageResponse>>> getAllSTIPackage() {
        ApiResponse<List<STIPackageResponse>> response = stiPackageService.getAllSTIPackage();
        return ResponseEntity.ok(response);
    }
    
    //Tạo mới 1 gói 
    @PostMapping
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STIPackageResponse>> createSTIService(@Valid @RequestBody STIPackageResquest request) {
        ApiResponse<STIPackageResponse> response = stiPackageService.createSTIPackage(request);
        return ResponseEntity.ok(response);
    }
    

}
