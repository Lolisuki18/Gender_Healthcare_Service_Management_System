package com.healapp.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.STIPackageResponse;
import com.healapp.dto.STIPackageResquest;
import com.healapp.model.PackageService;
import com.healapp.model.STIPackage;
import com.healapp.model.STIService;
import com.healapp.repository.PackageServiceRepository;
import com.healapp.repository.STIPackageRepository;
import com.healapp.repository.STIServiceRepository;

@Service
public class STIPackageService {
    @Autowired
    private STIPackageRepository stiPackageRepository;
    @Autowired
    private PackageServiceRepository packageServiceRepository;
    @Autowired
    private STIServiceRepository stiServiceRepository;
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
        response.setId(pkg.getPackageId());
        response.setName(pkg.getPackageName());
        response.setDescription(pkg.getDescription());
        response.setPrice(pkg.getPackagePrice());
        response.setActive(pkg.getIsActive());
        response.setCreatedAt(pkg.getCreatedAt());
        response.setUpdatedAt(pkg.getUpdatedAt());
        return response;
    }
    //Tạo gói dịch vụ xét nghiệm
    public ApiResponse<STIPackageResponse> createSTIPackage(STIPackageResquest resquest){
        try {
            // Validate input
            if (resquest == null || resquest.getName() == null || resquest.getPrice().compareTo(BigDecimal.ZERO) <= 0){
                return ApiResponse.error("Invalid STI Package request");
            }
            //Tạo đối tượng stiPackage
            STIPackage newPackage = new STIPackage();
            newPackage.setPackageName(resquest.getName());
            newPackage.setDescription(resquest.getDescription());
            newPackage.setPackagePrice(resquest.getPrice());
            newPackage.setIsActive(true);
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
