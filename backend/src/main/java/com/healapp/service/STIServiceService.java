package com.healapp.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

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
        try {
            // Validate request
            if (request == null || request.getName() == null || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                return ApiResponse.error("Invalid STI Service request");
            }

            // Kiểm tra xem dịch vụ đã tồn tại chưa
            if (stiServiceRepository.existsByName(request.getName())) {
                return ApiResponse.error("STI Service with this name already exists");
            }

            STIService newService = new STIService();
            newService.setName(request.getName());
            newService.setDescription(request.getDescription());
            newService.setPrice(request.getPrice());
            newService.setIsActive(true); // Mặc định là hoạt động

            List<ServiceTestComponent> components = request.getComponents().stream().map(c -> {
                ServiceTestComponent component = new ServiceTestComponent();
                component.setTestName(c.getTestName());
                component.setUnit(c.getUnit());
                component.setReferenceRange(c.getReferenceRange());
                component.setInterpretation(c.getReferenceRange());
                component.setSampleType(c.getSampleType());
                component.setIsActive(true); // Mặc định là hoạt động
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

    // Lấy tông tin dịch vụ STI còn hoạt động
    public ApiResponse<List<STIServiceResponse>> getActiveSTIServices() {
        try {
            List<STIService> services = stiServiceRepository.findAll();
            if (services.isEmpty()) {
                return ApiResponse.error("No active STI Services found");
            }

            List<STIServiceResponse> responses = services.stream()
                    .filter(STIService::getIsActive) // Chỉ lấy các dịch vụ đang hoạt động
                    .map(service -> convertToResponse(service, service.getTestComponents().stream()
                            .filter(ServiceTestComponent::getIsActive)// chỉ lấy các thành phần xét nghiệm còn hoạt động
                            .collect(Collectors.toList())))
                    .collect(Collectors.toList());

            return ApiResponse.success("Active STI Services retrieved successfully", responses);
        } catch (Exception e) {
            return ApiResponse.error("Error retrieving active STI Services: " + e.getMessage());
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
            existingService.setIsActive(request.getIsActive());

            // Cập nhật các thành phần xét nghiệm liên quan đến dịch vụ
            List<ServiceTestComponent> oldComponents = existingService.getTestComponents();

            // Lấy danh sách các thành phần mới từ request
            for (ServiceTestComponentRequest componentRequest : request.getComponents()) {
                // Nếu componentId là null, thì thêm mới thành phần
                if (componentRequest.getComponentId() == null) {
                    ServiceTestComponent newComponent = new ServiceTestComponent();
                    newComponent.setTestName(componentRequest.getTestName());
                    newComponent.setUnit(componentRequest.getUnit());
                    newComponent.setReferenceRange(componentRequest.getReferenceRange());
                    newComponent.setInterpretation(componentRequest.getInterpretation());
                    newComponent.setSampleType(componentRequest.getSampleType());
                    newComponent.setIsActive(
                            componentRequest.getIsActive() == null ? true : componentRequest.getIsActive());
                    newComponent.setStiService(existingService);
                    oldComponents.add(newComponent);
                } else {
                    // Cập nhật thành phần đã tồn tại
                    ServiceTestComponent existingComponent = oldComponents.stream()
                            .filter(c -> c.getComponentId().equals(componentRequest.getComponentId()))
                            .findFirst()
                            .orElse(null);
                    if (existingComponent != null) {
                        existingComponent.setTestName(componentRequest.getTestName());
                        existingComponent.setUnit(componentRequest.getUnit());
                        existingComponent.setReferenceRange(componentRequest.getReferenceRange());
                        existingComponent.setInterpretation(componentRequest.getInterpretation());
                        existingComponent.setSampleType(componentRequest.getSampleType());
                        // Nếu isActive không được cung cấp thì giữ nguyên giá trị cũ
                        existingComponent
                                .setIsActive(componentRequest.getIsActive() == null ? existingComponent.getIsActive()
                                        : componentRequest.getIsActive());
                    }
                }
            }

            // Xóa các thành phần không còn trong request
            for (ServiceTestComponent component : oldComponents) {
                if (request.getComponents().stream().noneMatch(
                        c -> c.getComponentId() != null && c.getComponentId().equals(component.getComponentId()))) {
                    // Nếu không có trong request thì đánh dấu là không hoạt động
                    component.setIsActive(false);
                }
            }

            // Lưu lại các thành phần đã cập nhật
            existingService.setTestComponents(oldComponents);

            STIService updatedService = stiServiceRepository.save(existingService);

            return ApiResponse.success("STI Service updated successfully",
                    convertToResponse(updatedService, oldComponents));
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
            existingService.setIsActive(false);

            // Lưu lại trạng thái đã chỉnh sửa
            stiServiceRepository.save(existingService);

            return ApiResponse.success("STI Service deleted successfully");
        } catch (Exception e) {
            return ApiResponse.error("Error deleting STI Service: " + e.getMessage());
        }
    }

    public Map<String, Long> getAdminDashboardServiceStats() {
        Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("activeServices", stiServiceRepository.countByIsActiveTrue());
        return stats;
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
            component.setUnit(c.getUnit());
            component.setNormalRange(c.getReferenceRange());
            component.setDescription(c.getInterpretation());
            component.setSampleType(c.getSampleType());
            component.setActive(c.getIsActive());
            return component;
        }).collect(Collectors.toList());

        response.setComponents(serviceComponents);
        return response;
    }

}
