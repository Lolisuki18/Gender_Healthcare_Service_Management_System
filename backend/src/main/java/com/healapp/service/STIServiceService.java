package com.healapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.STIPackageResponse;
import com.healapp.dto.STIPackageResquest;
import com.healapp.dto.STIServiceRequest;
import com.healapp.dto.STIServiceResponse;
import com.healapp.model.PackageService;
import com.healapp.model.STIPackage;
import com.healapp.model.STIService;
import com.healapp.model.ServiceTestComponent;
import com.healapp.repository.PackageServiceRepository;
import com.healapp.repository.STIPackageRepository;
import com.healapp.repository.STIServiceRepository;

@Service
public class STIServiceService {
    @Autowired
    private STIServiceRepository stiServiceRepository;
    private STIPackageRepository stiPackageRepository;
    private PackageServiceRepository packageServiceRepository;

    // tạo mới dịch vụ STI
    // Thêm các thành phần xét nghiệm liên quan đến dịch vụ
    public ApiResponse<STIServiceResponse> createSTIService(STIServiceRequest request) {
        try{
            // Validate request
            if (request == null || request.getName() == null || request.getPrice() <= 0) {
                return ApiResponse.error("Invalid STI Service request");
            }

            STIService newService = new STIService();
            newService.setName(request.getName());
            newService.setDescription(request.getDescription());
            newService.setPrice(request.getPrice());
            newService.setActive(true);

            List<ServiceTestComponent> components = request.components.stream().map(c -> {
                ServiceTestComponent component = new ServiceTestComponent();
                component.setTestName(c.testName);
                component.setUnit(c.unit);
                component.setReferenceRange(c.referenceRange);
                component.setInterpretation(c.interpretation);
                component.setStiService(newService);
                return component;
            }).collect(Collectors.toList());

            newService.setComponents(components);

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
                    .map(service -> convertToResponse(service, service.getComponents()))
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

            List<ServiceTestComponent> components = service.getComponents();
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
    //lấy thông tin các gói 
    public ApiResponse<List<STIPackageResponse>> getAllSTIPackage() {
        try {
            List<STIPackage> packages = stiPackageRepository.findAll();
    
            List<STIPackageResponse> responseList = packages.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    
            return new ApiResponse<>(true, "STI Package retrieved successfully", responseList);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error retrieving STI Package: " + e.getMessage(), null);
        }
    }
    //STIPackageResponse cho package
    private STIPackageResponse mapToResponse(STIPackage pkg) {
        STIPackageResponse response = new STIPackageResponse();
        response.setId(pkg.getId());
        response.setName(pkg.getName());
        response.setDescription(pkg.getDescription());
        response.setPrice(pkg.getPrice());
        response.setActive(pkg.isActive());
        response.setCreatedAt(pkg.getCreatedAt());
        response.setUpdatedAt(pkg.getUpdatedAt());
        return response;
    }
    //Tạo gói dịch vụ xét nghiệm
    public ApiResponse<STIPackageResponse> createSTIPackage(STIPackageResquest resquest){
        try {
            // Validate input
            if (resquest == null || resquest.getName() == null || resquest.getPrice() <= 0){
                return ApiResponse.error("Invalid STI Package request");
            }
            //Tạo đối tượng stiPackage
            STIPackage newPackage = new STIPackage();
            newPackage.setName(resquest.getName());
            newPackage.setDescription(resquest.getDescription());
            newPackage.setPrice(resquest.getPrice());
            newPackage.setActive(true);
            //Lưa tạm gói vào database
            STIPackage savedPackage = stiPackageRepository.save(newPackage);
            //Gán cái dịch vụ vào gói 
            if (resquest.getStiService() != null && !resquest.getStiService().isEmpty()){
                List<STIService> services = stiServiceRepository.findAllById(resquest.getStiService());
                List<PackageService> packageServices = services.stream()
                .map(service -> {
                    PackageService ps = new PackageService();
                    ps.setStiPackage(savedPackage); //liên kết vưới package mới
                    ps.setStiService(service);      //Gắn từng dịch vụ tương ứng
                    ps.setCreatedAt(LocalDateTime.now());
                    return ps;
                })
                .collect(Collectors.toList());
            //Lưu cái 
            packageServiceRepository.saveAll(packageServices);
            }
            //Chuyển qua dto
            STIPackageResponse response = mapToResponse(savedPackage);

            return ApiResponse.success("STI Package created successfully"+ response);
        } catch (Exception e) {
            return ApiResponse.error("Error creating STI Service: " + e.getMessage());
        }

    }
    

}
