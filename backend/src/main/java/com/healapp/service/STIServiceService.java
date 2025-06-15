package com.healapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.STIServiceRequest;
import com.healapp.dto.STIServiceResponse;
import com.healapp.dto.ServiceTestComponentRequest;
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
        try{
            // Validate request
            if (request == null || request.getName() == null || request.getPrice() <= 0) {
                return ApiResponse.error("Invalid STI Service request");
            }

            // Kiểm tra xem tên dịch vụ đã tồn tại chưa
            if (stiServiceRepository.existsByName(request.getName())) {
                return ApiResponse.error("STI Service with this name already exists");
            }

            STIService newService = new STIService();
            newService.setName(request.getName());
            newService.setDescription(request.getDescription());
            newService.setPrice(request.getPrice());
            newService.setActive(true);

            List<ServiceTestComponent> components = request.getComponents().stream()
                .map(componentRequest -> {
                    ServiceTestComponent component = new ServiceTestComponent();
                    component.setTestName(componentRequest.getTestName());
                    component.setUnit(componentRequest.getUnit());
                    component.setReferenceRange(componentRequest.getReferenceRange());
                    component.setInterpretation(componentRequest.getInterpretation());
                    component.setStiService(newService);
                    return component;
                })
                .collect(Collectors.toList());

            newService.setComponents(components);

            STIService savedService = stiServiceRepository.save(newService);

            return ApiResponse.success("STI Service created successfully", convertToResponse(savedService, components));
        } catch (Exception e) {
            return ApiResponse.error("Error creating STI Service: " + e.getMessage());
        }
    }

    // Lấy thông tin tất cả dịch vụ STI
    public ApiResponse<List<STIServiceResponse>> getAllSTIServices(String role) {
        try {
            List<STIService> services = stiServiceRepository.findAll();
            if (services.isEmpty()) {
                return ApiResponse.error("No STI Services found");
            }

            List<STIServiceResponse> responses;
            // Kiểm tra role người truy cập
            // Nếu không phải STAFF, chỉ lấy các dịch vụ đang hoạt động
            if(role == null || !role.equals("ROLE_STAFF")) {
                responses = services.stream()
                    .map(service -> convertToResponse(service, service.getComponents()))
                    .filter(response -> response.isActive()) // Chỉ lấy các dịch vụ đang hoạt động
                    .collect(Collectors.toList());
            } else {
                responses = services.stream()
                    .map(service -> convertToResponse(service, service.getComponents()))
                    .collect(Collectors.toList());
            }
            
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
            List<ServiceTestComponent> components = service.getComponents();
            return ApiResponse.success("STI Service retrieved successfully", convertToResponse(service, components));
        } catch (Exception e) {
            return ApiResponse.error("Error retrieving STI Service: " + e.getMessage());
        }
    }

    // Cập nhật thông tin dịch vụ STI
    public ApiResponse<STIServiceResponse> updateSTIService(Long id, STIServiceRequest request) {
        try {
            STIService existingService = stiServiceRepository.findById(id).orElse(null);
            if (existingService == null) {
                return ApiResponse.error("STI Service not found");
            }

            // Cập nhật thông tin dịch vụ
            existingService.setName(request.getName());
            existingService.setDescription(request.getDescription());
            existingService.setPrice(request.getPrice());
            existingService.setActive(request.isActive());

            // Cập nhật các thành phần xét nghiệm liên quan đến dịch vụ
            List<ServiceTestComponent> oldComponents = existingService.getComponents();
            
            // kiểm tra xem thành phần mới có cùng id với thành phần cũ không
            // nếu cùng thì cập nhật, nếu không thì thêm mới
            for (ServiceTestComponentRequest componentRequest : request.getComponents()) {
                ServiceTestComponent existingComponent = oldComponents.stream()
                        .filter(c -> c.getId().equals(componentRequest.getComponentId()))
                        .findFirst()
                        .orElse(null);
                
                if (existingComponent != null) {
                    // Cập nhật thông tin thành phần
                    existingComponent.setTestName(componentRequest.getTestName());
                    existingComponent.setUnit(componentRequest.getUnit());
                    existingComponent.setReferenceRange(componentRequest.getReferenceRange());
                    existingComponent.setInterpretation(componentRequest.getInterpretation());
                } else {
                    // Thêm mới thành phần nếu không tồn tại
                    ServiceTestComponent newComponent = new ServiceTestComponent();
                    newComponent.setTestName(componentRequest.getTestName());
                    newComponent.setUnit(componentRequest.getUnit());
                    newComponent.setReferenceRange(componentRequest.getReferenceRange());
                    newComponent.setInterpretation(componentRequest.getInterpretation());
                    newComponent.setStiService(existingService);
                    oldComponents.add(newComponent);
                }
            }
            // Lưu lại các thành phần đã cập nhật
            existingService.setComponents(oldComponents);

            STIService updatedService = stiServiceRepository.save(existingService);

            return ApiResponse.success("STI Service updated successfully", convertToResponse(updatedService, oldComponents));
        } catch (Exception e) {
            return ApiResponse.error("Error updating STI Service: " + e.getMessage());
        }
    }

    // Xóa dịch vụ STI
    public ApiResponse<String> deleteSTIService(Long id) {
        try {
            STIService existingService = stiServiceRepository.findById(id).orElse(null);
            if (existingService == null) {
                return ApiResponse.error("STI Service not found");
            }

            // chinh sửa trạng thái của dịch vụ thành không hoạt động
            existingService.setActive(false);

            // Lưu lại trạng thái đã chỉnh sửa
            stiServiceRepository.save(existingService);

            return ApiResponse.success("STI Service deleted successfully");
        } catch (Exception e) {
            return ApiResponse.error("Error deleting STI Service: " + e.getMessage());
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
        response.setActive(service.isActive());
        response.setCreatedAt(service.getCreatedAt());
        response.setUpdatedAt(service.getUpdatedAt());

        // Đếm số components
        if (service.getComponents() != null) {
            response.setComponentCount(service.getComponents().size());
        } else {
            response.setComponentCount(0);
        }

        // Lưu thông tin các thành phần của dịch vụ
        List<STIServiceResponse.ServiceComponent> serviceComponents = components.stream().map(c -> {
            STIServiceResponse.ServiceComponent component = new STIServiceResponse.ServiceComponent();
            component.setComponentId(c.getId());
            component.setComponentName(c.getTestName());
            component.setUnit(c.getUnit());
            component.setNormalRange(c.getReferenceRange());
            component.setDescription(c.getInterpretation());
            return component;
        }).collect(Collectors.toList());

        response.setComponents(serviceComponents);
        return response;
    }

}
