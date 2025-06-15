package com.healapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.STIServiceRequest;
import com.healapp.dto.STIServiceResponse;
import com.healapp.model.STIService;
import com.healapp.service.STIServiceService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/sti-services")
public class STIServiceController {
    @Autowired
    private STIServiceService stiServiceService;

    /*
     * description: Tạo mới một dịch vụ xét nghiệm STI
     * path: /sti-services
     * method: POST
     * body:
    {
    String name *
    String description
    double price *
    components  {
                String testName *
                String unit *
                String referenceRange *
                String interpretation *
                }
    }
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STIServiceResponse>> createSTIService(@Valid @RequestBody STIServiceRequest request) {
        ApiResponse<STIServiceResponse> response = stiServiceService.createSTIService(request);
        return ResponseEntity.ok(response);
    }

    /*
     * description: Lấy thông tin tất cả dịch vụ xét nghiệm STI
     * path: /sti-services
     * method: GET
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<STIServiceResponse>>> getAllSTIServices(@AuthenticationPrincipal UserDetails userDetails) {
        // Kiểm tra role người truy cập
        String role = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .findFirst()
            .orElse("ROLE_STAFF");
        ApiResponse<List<STIServiceResponse>> response = stiServiceService.getAllSTIServices(role);
        return ResponseEntity.ok(response);
    }

    /*
     * description: Lấy thông tin một dịch vụ xét nghiệm STI theo ID
     * path: /sti-services/{serviceId}
     * method: GET
     */
    @GetMapping("/{serviceId}")
    public ResponseEntity<ApiResponse<STIServiceResponse>> getSTIServiceById(@PathVariable Long serviceId) {
        ApiResponse<STIServiceResponse> response = stiServiceService.getSTIServiceById(serviceId);
        return ResponseEntity.ok(response);
    }

    /*
     * description: Cập nhật thông tin một dịch vụ xét nghiệm STI   
     * path: /sti-services/{serviceId}
     * method: PUT
     * body:
    {
    String name *
    String description
    double price *
    components  {
                String testName *
                String unit *
                String referenceRange *
                String interpretation *
                }
    }
     */
    @PutMapping("/{serviceId}")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STIServiceResponse>> updateSTIService(@PathVariable Long serviceId, @Valid @RequestBody STIServiceRequest request) {
        ApiResponse<STIServiceResponse> response = stiServiceService.updateSTIService(serviceId, request);
        return ResponseEntity.ok(response);
    }

    /*
     * description: Xóa một dịch vụ xét nghiệm STI theo ID
     * path: /sti-services/{serviceId}
     * method: DELETE
     */
    @DeleteMapping("/{serviceId}")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<String>> deleteSTIService(@PathVariable Long serviceId) {
        ApiResponse<String> response = stiServiceService.deleteSTIService(serviceId);
        return ResponseEntity.ok(response);
    }

}
