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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/sti-packages")
public class STIPackageController {
    @Autowired
    private STIPackageService stiPackageService;

    //Lấy ra thông tin của gói 
    @GetMapping
    public ResponseEntity<ApiResponse<List<STIPackageResponse>>> getAllSTIPackage(@AuthenticationPrincipal UserDetails userDetails) {
        String role = userDetails.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .findFirst()
        .orElse("ROLE_STAFF");
        ApiResponse<List<STIPackageResponse>> response = stiPackageService.getAllSTIPackage(role);
        return ResponseEntity.ok(response);
    }
    
    //Tạo mới 1 gói 
    /*
     * {
     * String name
     * String description
     * BigDecimal price 
     * Boolean isActive
     * stiService
     * }
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STIPackageResponse>> createSTIService(@Valid @RequestBody STIPackageResquest request) {
        ApiResponse<STIPackageResponse> response = stiPackageService.createSTIPackage(request);
        return ResponseEntity.ok(response);
    }
    
    //Lấy thông tin của gói thông qua Id
    @GetMapping("/{packageId}")
    public ResponseEntity<ApiResponse<STIPackageResponse>> getSTIPackageById(@PathVariable Long packageId) {
        ApiResponse<STIPackageResponse> response = stiPackageService.getSTIPackageById(packageId);
        return ResponseEntity.ok(response);
    }

    //Cập nhật thông tin của gói dịch vụ
    /*
     * String name
     * String description
     * BigDecimal price
     * isActive
     * stiService
     */
    @PutMapping("/{packageId}")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STIPackageResponse>> updateSTIPackage(@PathVariable Long packageId, @Valid @RequestBody STIPackageResquest resquest) {
        ApiResponse<STIPackageResponse> response = stiPackageService.updateSTIPackage(packageId, resquest);
        
        return ResponseEntity.ok(response);
    }

    //Xóa gói dịch vụ xóa mềm
    @DeleteMapping("/{packageId}")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<String>> deleteSTIPackage(@PathVariable Long packageId){
        ApiResponse<String> response = stiPackageService.deleteSTIPackage(packageId);
        return ResponseEntity.ok(response);
    }
    

}
