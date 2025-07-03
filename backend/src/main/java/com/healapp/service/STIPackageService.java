package com.healapp.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.STIPackageResponse;
import com.healapp.dto.STIPackageRequest;
import com.healapp.model.PackageService;
import com.healapp.model.STIPackage;
import com.healapp.model.STIService;
import com.healapp.repository.PackageServiceRepository;
import com.healapp.repository.STIPackageRepository;
import com.healapp.repository.STIServiceRepository;
import com.healapp.repository.ServiceTestComponentRepository;
import com.healapp.model.ServiceTestComponent;

import jakarta.transaction.Transactional;

@Service
public class STIPackageService {
    @Autowired
    private STIPackageRepository stiPackageRepository;
    @Autowired
    private PackageServiceRepository packageServiceRepository;
    @Autowired
    private STIServiceRepository stiServiceRepository;
    @Autowired
    private ServiceTestComponentRepository serviceTestComponentRepository;

    // Lấy tất cả các gói(ẩn hiện theo chức vụ)
    public ApiResponse<List<STIPackageResponse>> getAllSTIPackage(String role) {
        try {
            List<STIPackage> packages = stiPackageRepository.findAll();
            List<STIPackageResponse> responseList;

            boolean isStaff = "ROLE_STAFF".equals(role);

            // Nếu k phải staff thì chỉ hiện các gói đang hoạt động và các dịch vụ hoạt động
            if (!isStaff) {
                responseList = packages.stream()
                        .filter(STIPackage::getIsActive) // Lọc gói đang active
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());
            } else {
                // Staff thì thấy tất cả (không lọc)
                responseList = packages.stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());
            }

            return new ApiResponse<>(true, "STI Package retrieved successfully", responseList);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error retrieving STI Package: " + e.getMessage(), null);
        }
    }

    // Tạo gói dịch vụ xét nghiệm
    public ApiResponse<STIPackageResponse> createSTIPackage(STIPackageRequest resquest) {
        try {
            // Validate input
            if (resquest == null || resquest.getName() == null || resquest.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                return ApiResponse.error("Invalid STI Package request");
            }
            // Tạo đối tượng stiPackage
            // Tạo đối tượng STI Package
            STIPackage newPackage = new STIPackage();
            newPackage.setPackageName(resquest.getName());
            newPackage.setDescription(resquest.getDescription());
            newPackage.setPackagePrice(resquest.getPrice());
            newPackage.setIsActive(true);

            // Lưu STI Package trước để có packageId
            STIPackage savedPackage = stiPackageRepository.save(newPackage);

            // Nếu có dịch vụ, thì tạo liên kết package_services
            if (resquest.getStiService() != null && !resquest.getStiService().isEmpty()) {
                List<STIService> services = stiServiceRepository.findAllById(resquest.getStiService());
                // Chỉ lấy các service có isActive = true
                List<STIService> activeServices = services.stream()
                        .filter(STIService::getIsActive)
                        .collect(Collectors.toList());
                List<PackageService> packageServices = activeServices.stream()
                        .map(service -> {
                            PackageService ps = new PackageService();
                            ps.setStiPackage(savedPackage);
                            ps.setStiService(service);
                            ps.setCreatedAt(LocalDateTime.now());
                            return ps;
                        })
                        .collect(Collectors.toList());

                packageServiceRepository.saveAll(packageServices);
            }

            // Trả về kết quả
            STIPackageResponse response = mapToResponse(savedPackage);
            return ApiResponse.success("STI Package created successfully", response);

        } catch (Exception e) {
            return ApiResponse.error("Error creating STI Service: " + e.getMessage());
        }
    }

    // Lấy thông tin gói bằng id
    public ApiResponse<STIPackageResponse> getSTIPackageById(Long id) {
        try {
            STIPackage stiPackage = stiPackageRepository.findById(id).orElse(null);

            if (stiPackage == null) {
                return new ApiResponse<>(false, "STI Package not found", null);
            }

            STIPackageResponse response = mapToResponse(stiPackage);
            return new ApiResponse<>(true, "STI Package retrieved successfully", response);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error retrieving STI Package: " + e.getMessage(), null);
        }
    }

    // Cập nhật thông tin của gói dịch vụ STI
    @Transactional
    public ApiResponse<STIPackageResponse> updateSTIPackage(Long id, STIPackageRequest request) {
        try {
            STIPackage updatePackage = stiPackageRepository.findById(id).orElse(null);
            if (updatePackage == null) {
                return ApiResponse.error("STI Package not found!");
            }
            // Cho phép cập nhật trạng thái isActive kể cả khi package đang inactive
            // Cập nhật thông tin cơ bản
            updatePackage.setPackageName(request.getName());
            updatePackage.setDescription(request.getDescription());
            updatePackage.setPackagePrice(request.getPrice());
            updatePackage.setIsActive(request.getIsActive());

            // Lưu trước để đảm bảo có ID
            STIPackage savedPackage = stiPackageRepository.save(updatePackage);

            // Cập nhật danh sách dịch vụ
            if (request.getStiService() != null && !request.getStiService().isEmpty()) {
                // Xóa toàn bộ liên kết cũ
                List<PackageService> oldLinks = packageServiceRepository
                        .findByStiPackage_PackageId(savedPackage.getPackageId());
                packageServiceRepository.deleteAllInBatch(oldLinks);
                // Tạo lại danh sách mới
                List<STIService> services = stiServiceRepository.findAllById(request.getStiService())
                        .stream()
                        .filter(STIService::getIsActive)
                        .distinct()
                        .collect(Collectors.toList());

                List<PackageService> newLinks = services.stream()
                        .map(service -> {
                            PackageService ps = new PackageService();
                            ps.setStiPackage(savedPackage);
                            ps.setStiService(service);
                            ps.setCreatedAt(LocalDateTime.now());
                            return ps;
                        })
                        .collect(Collectors.toList());

                packageServiceRepository.saveAll(newLinks);
            }

            // Trả kết quả
            STIPackageResponse response = mapToResponse(savedPackage);
            return ApiResponse.success("STI Package updated successfully", response);
        } catch (Exception e) {
            return ApiResponse.error("Error updating STI Package: " + e.getMessage());
        }
    }

    // Xóa gói dịch vụ theo id
    public ApiResponse<String> deleteSTIPackage(Long id) {
        try {
            STIPackage delePackage = stiPackageRepository.findById(id).orElse(null);
            if (delePackage == null) {
                return ApiResponse.error("STI Package not found");
            }
            // Xóa mềm chuyển trạng thái thành false
            delePackage.setIsActive(false);

            // Lưu lại trạng thái đã chỉnh sửa
            stiPackageRepository.save(delePackage);

            return ApiResponse.success("STI Package deleted successfully");
        } catch (Exception e) {
            return ApiResponse.error("Error deleting STI Package.");
        }
    }

    // STIPackageResponse cho package
    private STIPackageResponse mapToResponse(STIPackage pkg) {
        STIPackageResponse response = new STIPackageResponse();
        response.setId(pkg.getPackageId());
        response.setName(pkg.getPackageName());
        response.setDescription(pkg.getDescription());
        response.setPrice(pkg.getPackagePrice());
        response.setActive(pkg.getIsActive());
        response.setCreatedAt(pkg.getCreatedAt());
        response.setUpdatedAt(pkg.getUpdatedAt());

        // Lấy dịch vụ từ bảng trung gian package_services
        List<PackageService> packageServices = packageServiceRepository.findByStiPackage_PackageId(pkg.getPackageId());

        List<STIPackageResponse.STIServiceResponse> serviceResponses = packageServices.stream()
                .map(PackageService::getStiService)
                .filter(service -> Boolean.TRUE.equals(service.getIsActive()))
                .map(service -> {
                    STIPackageResponse.STIServiceResponse dto = new STIPackageResponse.STIServiceResponse();
                    dto.setId(service.getId());
                    dto.setName(service.getName());
                    dto.setDescription(service.getDescription());
                    dto.setPrice(service.getPrice());
                    dto.setActive(service.getIsActive());
                    // Lấy component cho service này, chỉ lấy component đang hoạt động
                    List<ServiceTestComponent> components = serviceTestComponentRepository
                            .findByStiServiceId(service.getId());
                    List<STIPackageResponse.ComponentResponse> componentResponses = components.stream()
                            .filter(c -> Boolean.TRUE.equals(c.getIsActive()))
                            .map(c -> {
                                STIPackageResponse.ComponentResponse cr = new STIPackageResponse.ComponentResponse();
                                cr.setId(c.getComponentId());
                                cr.setTestName(c.getTestName());
                                cr.setUnit(c.getUnit());
                                cr.setReferenceRange(c.getReferenceRange());
                                cr.setInterpretation(c.getInterpretation());
                                cr.setActive(Boolean.TRUE.equals(c.getIsActive()));
                                return cr;
                            }).collect(Collectors.toList());
                    dto.setComponents(componentResponses);
                    return dto;
                })
                .collect(Collectors.toList());

        response.setServices(serviceResponses);
        return response;
    }

}
