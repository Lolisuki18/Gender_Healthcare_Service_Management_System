package com.healapp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.AvailableTimeSlot;
import com.healapp.dto.ConsultationRequest;
import com.healapp.dto.ConsultationResponse;
import com.healapp.model.ConsultantProfile;
import com.healapp.model.Consultation;
import com.healapp.model.ConsultationStatus;
import com.healapp.model.UserDtls;
import com.healapp.repository.ConsultantProfileRepository;
import com.healapp.repository.ConsultationRepository;
import com.healapp.repository.UserRepository;

@Service
public class ConsultationService {

    private static final Logger log = LoggerFactory.getLogger(ConsultationService.class);

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private ConsultantProfileRepository consultantProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private static final List<String> TIME_SLOTS = Arrays.asList("8-10", "10-12", "13-15", "15-17");
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    public ApiResponse<List<AvailableTimeSlot>> getAvailableTimeSlots(Long consultantId, LocalDate date) {
        try {
            // Thêm kiểm tra ngày quá khứ
            // Sử dụng timezone Asia/Ho_Chi_Minh để tránh lỗi timezone
            LocalDate todayInVietnam = ZonedDateTime.now(VIETNAM_ZONE).toLocalDate();
            
            if (date.isBefore(todayInVietnam)) {
                return ApiResponse.error("Cannot check availability for past dates");
            }

            Optional<UserDtls> userOpt = userRepository.findById(consultantId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("Consultant not found");
            }
            UserDtls user = userOpt.get();
            if (!"CONSULTANT".equals(user.getRoleName())) {
                return ApiResponse.error("Selected user is not a consultant");
            }

            // Kiểm tra consultant có active không
            if (!user.getIsActive()) {
                return ApiResponse.error("This consultant is currently unavailable");
            }

            // Ngày bắt đầu và kết thúc tìm kiếm
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(23, 59, 59);

            // lấy lịch consultant trong ngày
            List<Consultation> existingConsultations = consultationRepository.findByConsultantAndTimeRange(consultantId,
                    startOfDay, endOfDay);

            // danh sách time slot
            List<AvailableTimeSlot> availableTimeSlots = new ArrayList<>();
            for (String slot : TIME_SLOTS) {
                String[] hours = slot.split("-");
                LocalTime slotStartTime = LocalTime.of(Integer.parseInt(hours[0]), 0);
                LocalTime slotEndTime = LocalTime.of(Integer.parseInt(hours[1]), 0);

                LocalDateTime slotStart = date.atTime(slotStartTime);
                LocalDateTime slotEnd = date.atTime(slotEndTime);

                boolean isAvailable = true;
                for (Consultation consultation : existingConsultations) {
                    // lịch != canceled && có time chồng chéo với slot => false
                    if (consultation.getStatus() != ConsultationStatus.CANCELED &&
                            consultation.getStartTime().isBefore(slotEnd) &&
                            consultation.getEndTime().isAfter(slotStart)) {
                        isAvailable = false;
                        break;
                    }
                }

                availableTimeSlots.add(new AvailableTimeSlot(slot, isAvailable));
            }

            return ApiResponse.success("Available time slots retrieved successfully", availableTimeSlots);

        } catch (Exception e) {
            return ApiResponse.error("Failed to get available time slots: " + e.getMessage());
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<ConsultationResponse> createConsultation(ConsultationRequest request, Long customerId) {
        try {
            log.info("Creating consultation for customer {} with consultant {} at {} {}",
                    customerId, request.getConsultantId(), request.getDate(), request.getTimeSlot());

            Optional<UserDtls> customerOpt = userRepository.findById(customerId);
            if (customerOpt.isEmpty()) {
                return ApiResponse.error("Customer not found");
            }

            Optional<UserDtls> consultantOpt = userRepository.findById(request.getConsultantId());
            if (consultantOpt.isEmpty()) {
                return ApiResponse.error("Consultant not found");
            }
            UserDtls customer = customerOpt.get();
            UserDtls consultant = consultantOpt.get();

            if (!"CONSULTANT".equals(consultant.getRoleName())) {
                return ApiResponse.error("Selected user is not a consultant");
            }

            // Kiểm tra consultant có active không
            if (!consultant.getIsActive()) {
                return ApiResponse.error("This consultant is currently unavailable");
            }

            if (customer.getId().equals(consultant.getId())) {
                return ApiResponse.error("You cannot select yourself as a consultant");
            }

            // Parse time slot lấy giờ bắt đầu và kết thúc
            String[] hours = request.getTimeSlot().split("-");
            LocalTime startTime = LocalTime.of(Integer.parseInt(hours[0]), 0);
            LocalTime endTime = LocalTime.of(Integer.parseInt(hours[1]), 0);

            LocalDateTime consultationStartTime = request.getDate().atTime(startTime);
            LocalDateTime consultationEndTime = request.getDate().atTime(endTime);

            if (!TIME_SLOTS.contains(request.getTimeSlot())) {
                return ApiResponse.error("Invalid time slot");
            }

            // Kiểm tra thời gian không được trong quá khứ
            // Sử dụng timezone Asia/Ho_Chi_Minh để tránh lỗi timezone
            ZonedDateTime nowInVietnam = ZonedDateTime.now(VIETNAM_ZONE);
            ZonedDateTime startTimeInVietnam = consultationStartTime.atZone(VIETNAM_ZONE);
            
            if (startTimeInVietnam.isBefore(nowInVietnam)) {
                return ApiResponse.error("Không thể đặt lịch trong quá khứ. Vui lòng chọn ngày khác.");
            }

            // Kiểm tra time slot có available không (atomic check)
            boolean isSlotAvailable = checkTimeSlotAvailability(consultant.getId(), consultationStartTime,
                    consultationEndTime);
            if (!isSlotAvailable) {
                log.warn("Time slot {} {} is not available for consultant {}",
                        request.getDate(), request.getTimeSlot(), consultant.getId());

                String conflictInfo = String.format(
                        "Khung giờ %s-%s ngày %s đã được đặt bởi khách hàng khác. " +
                                "Vui lòng chọn khung giờ khác hoặc liên hệ với tư vấn viên để được hỗ trợ.",
                        hours[0], hours[1],
                        request.getDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                return ApiResponse.error(conflictInfo);
            }

            // Tạo lịch tư vấn
            Consultation consultation = new Consultation();
            consultation.setCustomer(customer);
            consultation.setConsultant(consultant);
            consultation.setStartTime(consultationStartTime);
            consultation.setEndTime(consultationEndTime);
            consultation.setStatus(ConsultationStatus.PENDING);
            consultation.setNotes(request.getNotes());
            consultation.setReason(request.getReason());

            try {
                Consultation savedConsultation = consultationRepository.save(consultation);

                log.info("Successfully created consultation ID: {} for customer {} with consultant {} at {} {}",
                        savedConsultation.getConsultationId(), customerId, consultant.getId(),
                        request.getDate(), request.getTimeSlot());

                ConsultationResponse response = convertToResponse(savedConsultation);
                return ApiResponse.success("Đặt lịch tư vấn thành công!", response);
            } catch (DataIntegrityViolationException e) {
                // Xử lý trường hợp unique constraint violation (race condition)
                String errorMessage = e.getMessage();
                if (errorMessage != null && errorMessage.contains("idx_consultant_time_unique")) {
                    log.warn("Race condition detected for consultation booking: consultantId={}, date={}, timeSlot={}",
                            consultant.getId(), request.getDate(), request.getTimeSlot());

                    String conflictInfo = String.format(
                            "Khung giờ %s-%s ngày %s đã được đặt bởi khách hàng khác trong khi bạn đang đặt lịch. " +
                                    "Vui lòng chọn khung giờ khác hoặc thử lại sau.",
                            hours[0], hours[1],
                            request.getDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                    return ApiResponse.error(conflictInfo);
                } else {
                    // Xử lý các lỗi DataIntegrityViolationException khác
                    log.error(
                            "Data integrity violation for consultation booking: consultantId={}, date={}, timeSlot={}, error={}",
                            consultant.getId(), request.getDate(), request.getTimeSlot(), errorMessage);
                    return ApiResponse.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
                }
            }
        } catch (Exception e) {
            log.error("Failed to create consultation for customer {}: {}", customerId, e.getMessage(), e);
            return ApiResponse.error("Không thể đặt lịch tư vấn: " + e.getMessage());
        }
    }

    /**
     * Kiểm tra time slot có available không (atomic check)
     */
    private boolean checkTimeSlotAvailability(Long consultantId, LocalDateTime startTime, LocalDateTime endTime) {
        // Kiểm tra xem có consultation nào đã tồn tại trong khoảng thời gian này không
        List<Consultation> conflictingConsultations = consultationRepository.findByConsultantAndTimeRange(
                consultantId,
                startTime.toLocalDate().atStartOfDay(),
                startTime.toLocalDate().atTime(23, 59, 59));

        for (Consultation consultation : conflictingConsultations) {
            // Nếu có consultation khác (không phải CANCELED) và có thời gian chồng chéo
            if (consultation.getStatus() != ConsultationStatus.CANCELED &&
                    consultation.getStartTime().isBefore(endTime) &&
                    consultation.getEndTime().isAfter(startTime)) {
                return false;
            }
        }
        return true;
    }

    public ApiResponse<ConsultationResponse> updateConsultationStatus(Long consultationId,
            ConsultationStatus newStatus, Long userId, String reason) {
        try {
            Optional<Consultation> consultationOpt = consultationRepository.findById(consultationId);
            if (consultationOpt.isEmpty()) {
                return ApiResponse.error("Consultation not found");
            }

            Consultation consultation = consultationOpt.get();

            // Kiểm tra quyền cập nhật
            if (newStatus == ConsultationStatus.CONFIRMED) {
                if (!consultation.getConsultant().getId().equals(userId)) {
                    return ApiResponse.error("Only assigned consultant can confirm the consultation");
                }
                String meetUrl = generateJitsiMeetUrl(consultation.getConsultationId());
                consultation.setMeetUrl(meetUrl);

                try {
                    emailService.sendConsultationConfirmationAsync(consultation);
                } catch (Exception e) {
                    System.err.println("Failed to send email notification: " + e.getMessage());
                    e.printStackTrace();
                }
            } else if (newStatus == ConsultationStatus.CANCELED) {
                // customer or consultant can cancel
                if (!consultation.getCustomer().getId().equals(userId) &&
                        !consultation.getConsultant().getId().equals(userId)) {
                    return ApiResponse.error("You don't have permission to cancel this consultation");
                }
                // Lưu lý do huỷ nếu có
                if (reason != null && !reason.trim().isEmpty()) {
                    consultation.setReason(reason);
                }
            } else if (newStatus == ConsultationStatus.COMPLETED) {
                if (!consultation.getConsultant().getId().equals(userId)) {
                    return ApiResponse.error("Only assigned consultant can mark the consultation as completed");
                }

                // check time, cant complete before end time
                // Sử dụng timezone Asia/Ho_Chi_Minh để tránh lỗi timezone
                ZonedDateTime nowInVietnam = ZonedDateTime.now(VIETNAM_ZONE);
                ZonedDateTime endTimeInVietnam = consultation.getEndTime().atZone(VIETNAM_ZONE);
                
                if (nowInVietnam.isBefore(endTimeInVietnam)) {
                    return ApiResponse.error("Consultation cannot be marked as completed before its end time");
                }
            }

            consultation.setStatus(newStatus);
            Consultation updatedConsultation = consultationRepository.save(consultation);

            // Convert to response
            ConsultationResponse response = convertToResponse(updatedConsultation);

            return ApiResponse.success("Consultation status updated successfully", response);

        } catch (Exception e) {
            return ApiResponse.error("Failed to update consultation status: " + e.getMessage());
        }
    }

    public ApiResponse<List<ConsultationResponse>> getConsultationsByStatus(ConsultationStatus status, Long userId) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();
            List<Consultation> consultations;

            // Cập nhật: Sử dụng getRoleName() thay vì getRole()
            String userRole = user.getRoleName();
            if ("STAFF".equals(userRole) || "ADMIN".equals(userRole)) {
                // Admin và staff xem tất cả
                consultations = consultationRepository.findByStatus(status);
            } else if ("CONSULTANT".equals(userRole)) {
                // Consultant chỉ xem lịch tư vấn của mình
                consultations = consultationRepository.findByConsultantAndStatus(user, status);
            } else {
                // User thường chỉ xem lịch tư vấn mà họ đặt
                consultations = consultationRepository.findByCustomerAndStatus(user, status);
            }

            List<ConsultationResponse> responses = consultations.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success(
                    String.format("Retrieved %d consultations with status %s", responses.size(), status),
                    responses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve consultations: " + e.getMessage());
        }
    }

    public ApiResponse<List<ConsultationResponse>> getConsultationsForUser(Long userId) {
        try {
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            List<Consultation> consultations = consultationRepository.findByUserInvolved(userId);

            // Convert to response
            List<ConsultationResponse> responseList = consultations.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Consultations retrieved successfully", responseList);

        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve consultations: " + e.getMessage());
        }
    }

    public ApiResponse<List<ConsultationResponse>> getAllConsultations() {
        try {
            List<Consultation> consultations = consultationRepository.findAll();
            List<ConsultationResponse> responses = consultations.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Consultations retrieved successfully", responses);
        } catch (Exception e) {
            log.error("Error retrieving all consultations: {}", e.getMessage());
            return ApiResponse.error("Failed to retrieve consultations: " + e.getMessage());
        }
    }

    // Get consultation by ID
    public ApiResponse<ConsultationResponse> getConsultationById(Long consultationId) {
        try {
            Optional<Consultation> consultationOpt = consultationRepository.findById(consultationId);
            if (consultationOpt.isEmpty()) {
                return ApiResponse.error("Consultation not found");
            }

            ConsultationResponse response = convertToResponse(consultationOpt.get());
            return ApiResponse.success("Consultation retrieved successfully", response);
        } catch (Exception e) {
            log.error("Error retrieving consultation by ID {}: {}", consultationId, e.getMessage());
            return ApiResponse.error("Failed to retrieve consultation: " + e.getMessage());
        }
    }

    // Check if user is authorized to access consultation
    public boolean isUserAuthorized(Long consultationId, String username) {
        try {
            Optional<Consultation> consultationOpt = consultationRepository.findById(consultationId);
            if (consultationOpt.isEmpty()) {
                return false;
            }

            Consultation consultation = consultationOpt.get();
            Optional<UserDtls> currentUserOpt = userRepository.findByEmail(username);

            if (currentUserOpt.isEmpty()) {
                return false;
            }
            UserDtls currentUser = currentUserOpt.get();

            // User can access if they are the customer or the consultant
            return consultation.getCustomer().getId().equals(currentUser.getId()) ||
                    consultation.getConsultant().getId().equals(currentUser.getId());
        } catch (Exception e) {
            log.error("Error checking user authorization for consultation {}: {}", consultationId, e.getMessage());
            return false;
        }
    }

    private String generateJitsiMeetUrl(Long consultationId) {
        // Tạo UUID để đảm bảo tính duy nhất và bảo mật
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        return "https://meet.jit.si/Heal_Consultation_" + consultationId + "_" + uniqueId;
    }

    public ApiResponse<List<UserDtls>> getAllConsultantMembers() {
        try {
            // Cập nhật: Sử dụng findByRoleName thay vì findByRole
            List<UserDtls> consultantMembers = userRepository.findByRoleName("CONSULTANT");
            return ApiResponse.success("Consultant members retrieved successfully", consultantMembers);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve consultant members: " + e.getMessage());
        }
    }

    public ApiResponse<List<ConsultationResponse>> getConsultationsForConsultant(Long consultantId) {
        try {
            // Kiểm tra xem người dùng có vai trò CONSULTANT không
            Optional<UserDtls> consultantOpt = userRepository.findById(consultantId);
            if (consultantOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls consultant = consultantOpt.get();
            // Cập nhật: Sử dụng getRoleName() thay vì getRole()
            if (!"CONSULTANT".equals(consultant.getRoleName())) {
                return ApiResponse.error("User is not a consultant");
            }

            // Lấy danh sách consultation của consultant
            List<Consultation> consultations = consultationRepository.findByConsultant(consultant);

            List<ConsultationResponse> consultationResponses = consultations.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Consultations retrieved successfully", consultationResponses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve consultations: " + e.getMessage());
        }
    }

    public ApiResponse<ConsultationResponse> updateConsultationNotes(Long consultationId, String notes) {
        try {
            Optional<Consultation> consultationOpt = consultationRepository.findById(consultationId);
            if (consultationOpt.isEmpty()) {
                return ApiResponse.error("Consultation not found");
            }
            Consultation consultation = consultationOpt.get();
            consultation.setNotes(notes);
            Consultation updated = consultationRepository.save(consultation);
            ConsultationResponse response = convertToResponse(updated);
            return ApiResponse.success("Notes updated successfully", response);
        } catch (Exception e) {
            return ApiResponse.error("Failed to update notes: " + e.getMessage());
        }
    }

    public Map<String, Long> getAdminDashboardConsultationStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalConsultations", consultationRepository.count());
        stats.put("todayConsultations", consultationRepository.findAll().stream()
                .filter(c -> c.getStartTime().toLocalDate().equals(java.time.LocalDate.now())).count());
        return stats;
    }

    private ConsultationResponse convertToResponse(Consultation consultation) {
        ConsultationResponse response = new ConsultationResponse();
        response.setConsultationId(consultation.getConsultationId());
        response.setCustomerId(consultation.getCustomer().getId());
        response.setCustomerName(consultation.getCustomer().getFullName());
        response.setConsultantId(consultation.getConsultant().getId());
        response.setConsultantName(consultation.getConsultant().getFullName());

        try {
            Optional<ConsultantProfile> profileOpt = consultantProfileRepository
                    .findByUserId(consultation.getConsultant().getId());
            if (profileOpt.isPresent()) {
                ConsultantProfile profile = profileOpt.get();
                response.setConsultantQualifications(profile.getQualifications());
                response.setConsultantExperience(profile.getExperience());
            }
        } catch (Exception e) {
            System.err.println("Failed to retrieve consultant profile: " + e.getMessage());
            e.printStackTrace();
        }

        response.setStartTime(consultation.getStartTime());
        response.setEndTime(consultation.getEndTime());
        response.setStatus(consultation.getStatus());
        response.setMeetUrl(consultation.getMeetUrl());

        response.setCreatedAt(consultation.getCreatedAt());
        response.setUpdatedAt(consultation.getUpdatedAt());
        response.setNotes(consultation.getNotes());
        response.setReason(consultation.getReason());
        return response;
    }
}