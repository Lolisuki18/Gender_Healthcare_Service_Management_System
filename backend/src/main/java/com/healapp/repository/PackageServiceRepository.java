package com.healapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healapp.model.PackageService;

@Repository
public interface PackageServiceRepository extends JpaRepository<PackageService, Long> {
    //Xóa tất cả liên kết theo package_id
    void deleteByStiPackage_PackageId(Long packageId);
    // Trả về danh sách các liên kết theo packageId
    List<PackageService> findByStiPackage_PackageId(Long packageId);
}
