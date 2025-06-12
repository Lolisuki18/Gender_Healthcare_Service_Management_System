package com.healapp.service;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ConsultantProfileRequest;
import com.healapp.dto.ConsultantProfileResponse;
import com.healapp.dto.CreateConsultantAccRequest;
import com.healapp.model.ConsultantProfile;
import com.healapp.model.Role;
import com.healapp.model.UserDtls;
import com.healapp.repository.ConsultantProfileRepository;
import com.healapp.repository.RoleRepository;
import com.healapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConsultantService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConsultantProfileRepository consultantProfileRepository;

    @Autowired
    private RoleRepository roleRepository; // lấy tất cả Consultant profile
    // dùng ở AdminController để xem danh sách Consultant

    public ApiResponse<List<ConsultantProfileResponse>> getAllConsultantProfiles() {
        try {
            List<UserDtls> consultantUsers = userRepository.findByRoleName("CONSULTANT");
            List<ConsultantProfileResponse> responses = consultantUsers.stream()
                    .map(user -> {
                        Optional<ConsultantProfile> profileOpt = consultantProfileRepository.findByUser(user);
                        if (profileOpt.isPresent()) {
                            return convertToResponse(profileOpt.get());
                        } else {
                            ConsultantProfileResponse response = new ConsultantProfileResponse();
                            response.setUserId(user.getId());
                            response.setFullName(user.getFullName());
                            response.setUsername(user.getUsername());
                            response.setEmail(user.getEmail());
                            response.setPhone(user.getPhone());
                            response.setAvatar(user.getAvatar());
                            response.setActive(user.getIsActive());
                            response.setAddress(user.getAddress());
                            response.setGender(user.getGender());
                            return response;
                        }
                    })
                    .collect(Collectors.toList());

            return ApiResponse.success("Consultant profiles retrieved successfully", responses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve consultant profiles: " + e.getMessage());
        }
    } // lấy tất cả Consultant có chứa chuỗi query ở fullName hoặc email
    // dùng ở AdminController để xem danh sách Consultant

    public ApiResponse<List<ConsultantProfileResponse>> getAllConsultantProfilesByFilters(String query) {
        try {
            List<UserDtls> consultantList = userRepository
                    .findByRoleNameAndFullNameContainingOrEmailContaining("CONSULTANT", query);
            List<ConsultantProfileResponse> responses = consultantList.stream()
                    .map(user -> {
                        Optional<ConsultantProfile> profileOpt = consultantProfileRepository.findByUser(user);
                        if (profileOpt.isPresent()) {
                            return convertToResponse(profileOpt.get());
                        } else {
                            ConsultantProfileResponse response = new ConsultantProfileResponse();
                            response.setUserId(user.getId());
                            response.setFullName(user.getFullName());
                            response.setUsername(user.getUsername());
                            response.setEmail(user.getEmail());
                            response.setPhone(user.getPhone());
                            response.setAvatar(user.getAvatar());
                            response.setActive(user.getIsActive());
                            response.setAddress(user.getAddress());
                            response.setGender(user.getGender());
                            return response;
                        }
                    })
                    .collect(Collectors.toList());

            return ApiResponse.success("Consultant profiles retrieved successfully", responses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve consultant profiles: " + e.getMessage());
        }
    }

    // lấy Consultant profile theo userId
    // dùng ở AdminController để xem chi tiết Consultant theo userId
    public ApiResponse<ConsultantProfileResponse> getConsultantProfileById(Long userId) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();

            if (!"CONSULTANT".equals(user.getRoleName())) {
                return ApiResponse.error("User is not a consultant");
            }
            Optional<ConsultantProfile> profileOpt = consultantProfileRepository.findByUser(user);
            if (profileOpt.isEmpty()) {
                ConsultantProfileResponse response = new ConsultantProfileResponse();
                response.setUserId(user.getId());
                response.setFullName(user.getFullName());
                response.setUsername(user.getUsername());
                response.setEmail(user.getEmail());
                response.setPhone(user.getPhone());
                response.setAvatar(user.getAvatar());
                response.setActive(user.getIsActive());
                response.setAddress(user.getAddress());
                response.setGender(user.getGender());
                return ApiResponse.success("Consultant found but profile not complete", response);
            }

            return ApiResponse.success("Consultant profile retrieved successfully",
                    convertToResponse(profileOpt.get()));
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve consultant profile: " + e.getMessage());
        }
    }

    // lấy Consultant có status là true và lấy theo userId
    // dùng ở ConsultantController để Customer, Consultant, Staff xem profile
    // Consultant
    public ApiResponse<ConsultantProfileResponse> getActiveConsultantProfileById(Long userId) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            if (!userOpt.get().getRoleName().equals("CONSULTANT")) {
                return ApiResponse.error("User is not a consultant");
            }

            UserDtls user = userOpt.get();
            if (!user.getIsActive()) {
                return ApiResponse.error("User is not active");
            }
            Optional<ConsultantProfile> profileOpt = consultantProfileRepository.findByUser(user);
            if (profileOpt.isEmpty()) {
                ConsultantProfileResponse response = new ConsultantProfileResponse();
                response.setUserId(user.getId());
                response.setFullName(user.getFullName());
                response.setEmail(user.getEmail());
                response.setPhone(user.getPhone());
                response.setAvatar(user.getAvatar());
                response.setActive(user.getIsActive());
                response.setAddress(user.getAddress());
                response.setGender(user.getGender());
                return ApiResponse.success("Consultant found but profile not complete", response);
            }

            return ApiResponse.success("Consultant profile retrieved successfully",
                    convertToResponse(profileOpt.get()));
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve consultant profile: " + e.getMessage());
        }
    }

    // lấy tất cả Consultant có status là true
    // dùng ở ConsultantController để Customer, Consultant, Staff xem danh sách
    // Consultant
    public ApiResponse<List<ConsultantProfileResponse>> getAllActiveConsultants() {
        try {
            // Lấy danh sách Consultant có isActive = true
            List<UserDtls> consultantUsers = userRepository.findByRoleNameAndIsActive("CONSULTANT", true);

            if (consultantUsers.isEmpty()) {
                return ApiResponse.success("No active consultants found", List.of());
            } // Chuyển đổi sang ConsultantProfileResponse
            List<ConsultantProfileResponse> responses = consultantUsers.stream()
                    .map(user -> {
                        Optional<ConsultantProfile> profileOpt = consultantProfileRepository.findByUser(user);
                        if (profileOpt.isPresent()) {
                            return convertToResponse(profileOpt.get());
                        } else {
                            ConsultantProfileResponse response = new ConsultantProfileResponse();
                            response.setUserId(user.getId());
                            response.setFullName(user.getFullName());
                            response.setEmail(user.getEmail());
                            response.setUsername(user.getUsername());
                            response.setPhone(user.getPhone());
                            response.setAvatar(user.getAvatar());
                            response.setActive(user.getIsActive());
                            response.setAddress(user.getAddress());
                            response.setGender(user.getGender());
                            return response;
                        }
                    })
                    .collect(Collectors.toList());

            return ApiResponse.success("Active consultant profiles retrieved successfully", responses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve active consultant profiles: " + e.getMessage());
        }
    }

    // lấy tất cả Consultant có status là true và tên đầy đủ chứa name
    // dùng ở ConsultantController để Customer, Consultant, Staff tìm kiếm
    // Consultant theo tên
    public ApiResponse<List<ConsultantProfileResponse>> getAllActiveConsultantByFullNameContaining(String name) {
        try {
            // Lấy danh sách Consultant có isActive = true và tên đầy đủ chứa name
            List<UserDtls> consultantUsers = userRepository.findByRoleNameAndIsActiveAndFullNameContaining(true,
                    "CONSULTANT", name);

            if (consultantUsers.isEmpty()) {
                return ApiResponse.success("No consultants found with the given name", List.of());
            }

            // Chuyển đổi sang ConsultantProfileResponse
            List<ConsultantProfileResponse> responses = consultantUsers.stream()
                    .map(user -> {
                        Optional<ConsultantProfile> profileOpt = consultantProfileRepository.findByUser(user);
                        if (profileOpt.isPresent()) {
                            return convertToResponse(profileOpt.get());
                        } else {
                            ConsultantProfileResponse response = new ConsultantProfileResponse();
                            response.setUserId(user.getId());
                            response.setFullName(user.getFullName());
                            response.setEmail(user.getEmail());
                            response.setPhone(user.getPhone());
                            response.setAvatar(user.getAvatar());
                            return response;
                        }
                    })
                    .collect(Collectors.toList());

            return ApiResponse.success("Consultants retrieved successfully", responses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve consultants: " + e.getMessage());
        }
    }

    // tạo Consultant account chỉ nhập fullname và email
    @Transactional
    public ApiResponse<UserDtls> createConsultant(CreateConsultantAccRequest request) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            // Get CONSULTANT role by RoleName
            Role consultantRole = roleRepository.findByRoleName("CONSULTANT")
                    .orElseThrow(() -> new RuntimeException("Consultant role not found"));

            // Use password default is Aa@123456
            String password = "Aa@123456";

            // Create new user
            UserDtls consultant = new UserDtls();
            consultant.setFullName(request.getFullName());
            consultant.setEmail(request.getEmail());
            consultant.setUsername(request.getEmail()); // Use email as username
            consultant.setPassword(passwordEncoder.encode(password));
            consultant.setRole(consultantRole);
            consultant.setIsActive(true);

            // Save user
            UserDtls savedConsultant = userRepository.save(consultant);

            // Create empty ConsultantProfile
            ConsultantProfile consultantProfile = new ConsultantProfile();
            consultantProfile.setUser(savedConsultant);
            consultantProfile.setQualifications("");
            consultantProfile.setExperience("");
            consultantProfile.setBio("");
            consultantProfileRepository.save(consultantProfile);

            return ApiResponse.success("Consultant created successfully", savedConsultant);
        } catch (Exception e) {
            return ApiResponse.error("Failed to create consultant: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<ConsultantProfileResponse> updateConsultantProfile(Long userId,
            ConsultantProfileRequest request) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();

            if (!"CONSULTANT".equals(user.getRoleName())) {
                return ApiResponse.error("User must have CONSULTANT role to update profile. Please update role first.");
            }

            // Tìm profile của user, tạo mới nếu chưa có
            ConsultantProfile consultantProfile = consultantProfileRepository.findByUser(user)
                    .orElse(new ConsultantProfile());

            consultantProfile.setUser(user);
            consultantProfile.setQualifications(request.getQualifications());
            consultantProfile.setExperience(request.getExperience());
            consultantProfile.setBio(request.getBio());

            ConsultantProfile savedProfile = consultantProfileRepository.save(consultantProfile);

            return ApiResponse.success("Consultant profile updated successfully", convertToResponse(savedProfile));
        } catch (Exception e) {
            return ApiResponse.error("Failed to update consultant profile: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<String> removeConsultantRole(Long userId) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();

            if (!"CONSULTANT".equals(user.getRoleName())) {
                return ApiResponse.error("User is not a consultant");
            }

            // Xóa profile
            Optional<ConsultantProfile> profileOpt = consultantProfileRepository.findByUser(user);
            profileOpt.ifPresent(consultantProfileRepository::delete);

            // Cập nhật: Lấy role CUSTOMER từ database và set cho user
            Role userRole = roleRepository.findByRoleName("CUSTOMER")
                    .orElseThrow(() -> new RuntimeException("CUSTOMER role not found in database"));

            user.setRole(userRole);
            userRepository.save(user);

            return ApiResponse.success("Consultant role removed successfully", null);
        } catch (Exception e) {
            return ApiResponse.error("Failed to remove consultant role: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<String> changeAccountStatus(Long userId) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();
            // Cập nhật: Sử dụng getRoleName() thay vì getRole()
            if (!"CONSULTANT".equals(user.getRoleName())) {
                return ApiResponse.error("User is not a consultant");
            }

            // Cập nhật: chỉnh status về false
            user.setIsActive(false);
            userRepository.save(user);

            return ApiResponse.success("Consultant role removed successfully", null);
        } catch (Exception e) {
            return ApiResponse.error("Failed to remove consultant role: " + e.getMessage());
        }
    }

    private ConsultantProfileResponse convertToResponse(ConsultantProfile consultantProfile) {
        ConsultantProfileResponse response = new ConsultantProfileResponse();
        response.setProfileId(consultantProfile.getProfileId());
        response.setUserId(consultantProfile.getUser().getId());
        response.setUsername(consultantProfile.getUser().getUsername());
        response.setFullName(consultantProfile.getUser().getFullName());
        response.setEmail(consultantProfile.getUser().getEmail());
        response.setAddress(consultantProfile.getUser().getAddress());

        response.setPhone(consultantProfile.getUser().getPhone());
        response.setAvatar(consultantProfile.getUser().getAvatar());
        response.setActive(consultantProfile.getUser().getIsActive()); // ✅ THÊM DÒNG NÀY
        response.setQualifications(consultantProfile.getQualifications());
        response.setExperience(consultantProfile.getExperience());
        response.setBio(consultantProfile.getBio());
        response.setUpdatedAt(consultantProfile.getUpdatedAt());
        response.setGender(consultantProfile.getUser().getGender());
        return response;
    }
}