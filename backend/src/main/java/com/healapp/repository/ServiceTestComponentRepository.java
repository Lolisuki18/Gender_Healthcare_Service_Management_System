package com.healapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.healapp.model.STIService;
import com.healapp.model.ServiceTestComponent;

public interface ServiceTestComponentRepository extends JpaRepository<ServiceTestComponent, Long> {
    List<ServiceTestComponent> findByStiService(STIService stiService);

    List<ServiceTestComponent> findByStiServiceServiceId(Long serviceId);

    // Tìm thành phần theo tên trong một dịch vụ
    Optional<ServiceTestComponent> findByStiServiceAndTestNameIgnoreCase(STIService stiService, String testName);

    // Kiểm tra tên thành phần đã tồn tại trong dịch vụ
    boolean existsByStiServiceAndTestNameIgnoreCase(STIService stiService, String testName);

    // Đếm số thành phần của một dịch vụ
    long countByStiService(STIService stiService);

    long countByStiServiceServiceId(Long serviceId);

    // Tìm kiếm thành phần theo từ khóa trong một dịch vụ
    @Query("SELECT c FROM ServiceTestComponent c WHERE c.stiService.serviceId = :serviceId AND " +
            "LOWER(c.testName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ServiceTestComponent> searchComponentsInService(@Param("serviceId") Long serviceId,
            @Param("keyword") String keyword);

    // Xóa tất cả thành phần của một dịch vụ
    void deleteByStiService(STIService stiService);

    void deleteByStiServiceServiceId(Long serviceId);

    // Cập nhật thông tin của ServiceTestComponent
    @Query("UPDATE ServiceTestComponent c SET c.testName = :testName, c.unit = :unit, " +
           "c.referenceRange = :referenceRange, c.interpretation = :interpretation " +
           "WHERE c.componentId = :componentId")
    @Modifying
    @Transactional
    void updateServiceTestComponent(
            @Param("testName") String testName,
            @Param("unit") String unit,
            @Param("referenceRange") String referenceRange,
            @Param("interpretation") String interpretation,
            @Param("componentId") Long componentId);
}
