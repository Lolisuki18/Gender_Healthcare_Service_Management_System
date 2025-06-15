package com.healapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.STIServiceRequest;
import com.healapp.dto.STIServiceResponse;
import com.healapp.model.STIService;
import com.healapp.model.ServiceTestComponent;
import com.healapp.repository.STIServiceRepository;

@Service
public class STIServiceService {
    @Autowired
    private STIServiceRepository stiServiceRepository;

    // tạo mới dịch vụ STI
    // Thêm các thành phần xét nghiệm liên quan đến dịch vụ
    public ApiResponse<STIServiceResponse> createSTIService(STIServiceRequest request) {
        try {
            // Validate request
            if (request == null || request.getName() == null || request.getPrice() == null || request.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                return ApiResponse.error("Invalid STI Service request");
            }

            STIService newService = new STIService();
            newService.setName(request.getName());
            newService.setDescription(request.getDescription());
            newService.setPrice(request.getPrice());
            newService.setIsActive(true);

            List<ServiceTestComponent> components = request.components.stream().map(c -> {
                ServiceTestComponent component = new ServiceTestComponent();
                component.setTestName(c.testName);
                component.setReferenceRange(c.referenceRange);
                component.setStiService(newService);
                return component;
            }).collect(Collectors.toList());

            newService.setTestComponents(components);

            STIService savedService = stiServiceRepository.save(newService);

            return ApiResponse.success("STI Service created successfully", convertToResponse(savedService, components));
        } catch (Exception e) {
            return ApiResponse.error("Error creating STI Service: " + e.getMessage());
        }
    }

    // Lấy thông tin tất cả dịch vụ STI
    public ApiResponse<List<STIServiceResponse>> getAllSTIServices() {
        try {
            List<STIService> services = stiServiceRepository.findAll();
            if (services.isEmpty()) {
                return ApiResponse.error("No STI Services found");      
            }

            List<STIServiceResponse> responses = services.stream()
                    .map(service -> convertToResponse(service, service.getTestComponents()))
                    .collect(Collectors.toList());

            return ApiResponse.success("STI Services retrieved successfully", responses);
        } catch (Exception e) {
            return ApiResponse.error("Error retrieving STI Services: " + e.getMessage());
        }
    }

    // Lấy thông tin dịch vụ STI theo ID
    public ApiResponse<STIServiceResponse> getSTIServiceById(Long id) {
        try {
            STIService service = stiServiceRepository.findById(id).orElse(null);
            if (service == null) {
                return ApiResponse.error("STI Service not found");
            }

            List<ServiceTestComponent> components = service.getTestComponents();
            return ApiResponse.success("STI Service retrieved successfully", convertToResponse(service, components));
        } catch (Exception e) {
            return ApiResponse.error("Error retrieving STI Service: " + e.getMessage());
        }
    }

    /**
     * Chuyển đổi STIService sang STIServiceResponse
     */
    private STIServiceResponse convertToResponse(STIService service, List<ServiceTestComponent> components) {
        STIServiceResponse response = new STIServiceResponse();
        response.setId(service.getId());
        response.setName(service.getName());
        response.setDescription(service.getDescription());
        response.setPrice(service.getPrice());
        response.setActive(service.getIsActive());
        response.setCreatedAt(service.getCreatedAt());
        response.setUpdatedAt(service.getUpdatedAt());

        // Đếm số components
        if (service.getTestComponents() != null) {
            response.setComponentCount(service.getTestComponents().size());
        } else {
            response.setComponentCount(0);
        }

        // Lưu thông tin các thành phần của dịch vụ
        List<STIServiceResponse.ServiceComponent> serviceComponents = components.stream().map(c -> {
            STIServiceResponse.ServiceComponent component = new STIServiceResponse.ServiceComponent();
            component.setComponentId(c.getComponentId());
            component.setComponentName(c.getTestName());
            component.setNormalRange(c.getReferenceRange());
            return component;
        }).collect(Collectors.toList());

        response.setComponents(serviceComponents);
        return response;
    }

}
