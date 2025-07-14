package com.healapp.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.healapp.model.AuthProvider;
import com.healapp.model.Role;
import com.healapp.model.UserDtls;

@Repository
public interface UserRepository extends JpaRepository<UserDtls, Long> {

    Optional<UserDtls> findByUsername(String username);

    Optional<UserDtls> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<UserDtls> findByUsernameOrEmail(String username, String email);

    List<UserDtls> findByRole(Role role);

    @Query("SELECT u FROM UserDtls u WHERE u.role.roleName = :roleName")
    List<UserDtls> findByRoleName(@Param("roleName") String roleName);

    @Query("SELECT u FROM UserDtls u WHERE u.role.roleName = :roleName AND u.isActive = :isActive")
    List<UserDtls> findByRoleNameAndIsActive(@Param("roleName") String roleName, @Param("isActive") boolean isActive);

    @Query("SELECT u FROM UserDtls u WHERE u.role.roleName = :roleName AND (u.fullName LIKE CONCAT('%', :query, '%') OR u.email LIKE CONCAT('%', :query, '%'))")
    List<UserDtls> findByRoleNameAndFullNameContainingOrEmailContaining(@Param("roleName") String roleName,
            @Param("query") String query);

    @Query("SELECT u FROM UserDtls u WHERE u.role.roleName = :roleName AND u.isActive = :isActive AND u.fullName LIKE CONCAT('%', :name, '%')")
    List<UserDtls> findByRoleNameAndIsActiveAndFullNameContaining(@Param("isActive") Boolean isActive,
            @Param("roleName") String roleName, @Param("name") String name);

    Iterable<UserDtls> findByIsActive(Boolean isActive);

    Iterable<UserDtls> findByFullNameContainingIgnoreCase(String name);

    LocalDate findBirthDayById(Long id);

    Long countByRole(Role role);

    List<UserDtls> findByRoleAndIsActive(Role role, boolean isActive);

    @Query("SELECT u FROM UserDtls u WHERE u.role.roleName IN :roleNames")
    List<UserDtls> findByRoleNameIn(@Param("roleNames") List<String> roleNames);

    @Query("SELECT u FROM UserDtls u WHERE u.role.roleName = :roleName ORDER BY u.createdDate DESC")
    List<UserDtls> findByRoleNameOrderByCreatedDateDesc(@Param("roleName") String roleName);

    Optional<UserDtls> findByEmailAndProvider(String email, AuthProvider provider);
    
    // Tìm user active (không bị disable và không bị delete)
    Optional<UserDtls> findByEmailAndIsActiveTrueAndIsDeletedFalse(String email);
    Optional<UserDtls> findByUsernameAndIsActiveTrueAndIsDeletedFalse(String username);
    
    // Kiểm tra email/username/phone có tồn tại và đang hoạt động không
    boolean existsByEmailAndIsActiveTrueAndIsDeletedFalse(String email);
    boolean existsByUsernameAndIsActiveTrueAndIsDeletedFalse(String username);
    
    // Tìm tất cả user không bị xóa (cho admin quản lý)
    @Query("SELECT u FROM UserDtls u WHERE u.isDeleted = false ORDER BY u.createdDate DESC")
    List<UserDtls> findAllActiveAndDisabled();
    
    // Tìm user bị admin disable (có thể khôi phục)
    @Query("SELECT u FROM UserDtls u WHERE u.isActive = false AND u.isDeleted = false")
    List<UserDtls> findDisabledByAdmin();
    
    // Tìm user đã bị xóa bởi user (không thể khôi phục)
    @Query("SELECT u FROM UserDtls u WHERE u.isDeleted = true")
    List<UserDtls> findDeletedByUser();
}