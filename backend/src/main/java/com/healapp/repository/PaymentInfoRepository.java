package com.healapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.healapp.model.PaymentInfo;

@Repository
public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, Long> {

    // Lấy tất cả thẻ của user (chỉ active)
    List<PaymentInfo> findByUserIdAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(Long userId);

    // Lấy thẻ mặc định của user
    Optional<PaymentInfo> findByUserIdAndIsDefaultTrueAndIsActiveTrue(Long userId);

    // Kiểm tra xem user đã có thẻ mặc định chưa
    boolean existsByUserIdAndIsDefaultTrueAndIsActiveTrue(Long userId);

    // Lấy thẻ theo ID và user ID (để đảm bảo user chỉ có thể truy cập thẻ của mình)
    Optional<PaymentInfo> findByPaymentInfoIdAndUserIdAndIsActiveTrue(Long paymentInfoId, Long userId);

    // Đếm số thẻ của user
    long countByUserIdAndIsActiveTrue(Long userId);

    // Reset tất cả thẻ về không mặc định
    @Modifying
    @Query("UPDATE PaymentInfo p SET p.isDefault = false WHERE p.userId = :userId AND p.isActive = true")
    void resetDefaultCards(@Param("userId") Long userId);

    // Kiểm tra xem số thẻ đã tồn tại chưa (cho user này)
    boolean existsByUserIdAndCardNumberAndIsActiveTrue(Long userId, String cardNumber);

    // Lấy thẻ theo số thẻ (để kiểm tra trùng lặp)
    Optional<PaymentInfo> findByUserIdAndCardNumberAndIsActiveTrue(Long userId, String cardNumber);
} 