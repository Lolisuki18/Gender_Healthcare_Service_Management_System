package com.healapp.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.MenstrualCycleRequest;
import com.healapp.dto.MenstrualCycleResponse;
import com.healapp.model.MenstrualCycle;
import com.healapp.model.PregnancyProbLog;
import com.healapp.model.UserDtls;
import com.healapp.repository.MenstrualCycleRepository;
import com.healapp.repository.PregnancyProbLogRepository;
import com.healapp.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class MenstrualCycleService {

    @Autowired
    private MenstrualCycleRepository menstrualCycleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PregnancyProbLogRepository pregnancyProbLogRepository;

    @Autowired
    private PregnancyProbLogService pregnancyProbLogService;

    @Autowired
    private UserService userService;
    

    // Tính ngày rụng trứng dựa trên chu kỳ kinh nguyệt
    public LocalDate calculateOvulationDate(MenstrualCycle menstrualCycle) {
        if (menstrualCycle == null || menstrualCycle.getStartDate() == null || menstrualCycle.getCycleLength() == null) {
            return null;
        }
        // Ngày rụng trứng thường xảy ra khoảng 14 ngày trước khi bắt đầu chu kỳ kinh nguyệt tiếp theo
        return menstrualCycle.getStartDate().plusDays(menstrualCycle.getCycleLength() - 14);
    }


    // Khai báo chu kỳ kinh nguyệt
    @Transactional
    public ApiResponse<MenstrualCycleResponse> createMenstrualCycle(MenstrualCycleRequest request) {
        try{
            // Kiểm tra người dùng có tồn tại hay không
            Optional<UserDtls> user = userRepository.findById(getCurrentUserId());
            if (!user.isPresent()) {
                return ApiResponse.error("Người dùng không tồn tại");
            }

            // Tạo mới chu kỳ kinh nguyệt
            MenstrualCycle menstrualCycle = new MenstrualCycle();
            menstrualCycle.setUser(user.get());
            menstrualCycle.setStartDate(request.getStartDate());
            menstrualCycle.setNumberOfDays(request.getNumberOfDays());
            menstrualCycle.setCycleLength(request.getCycleLength());
            menstrualCycle.setReminderEnabled(request.getReminderEnabled());

            // Tính ngày rụng trứng
            LocalDate ovulationDate = calculateOvulationDate(menstrualCycle);
            menstrualCycle.setOvulationDate(ovulationDate);

            // Lưu chu kỳ kinh nguyệt vào cơ sở dữ liệu
            MenstrualCycle savedCycle = menstrualCycleRepository.save(menstrualCycle);

            // Thêm log tỉ lệ mang thai cho chu kỳ kinh nguyệt mới
            pregnancyProbLogService.addPregnancyProbLog(savedCycle.getId());

            // Lưu lại chu kỳ kinh nguyệt đã lưu
            savedCycle = menstrualCycleRepository.save(savedCycle);

            // Chuyển đổi sang response
            MenstrualCycleResponse response = convertToResponse(savedCycle);
            return ApiResponse.success("Chu kỳ kinh nguyệt đã được lưu thành công", response);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lưu chu kỳ kinh nguyệt: " + e.getMessage());
        }
    }

    
    // Lấy tất cả chu kỳ kinh nguyệt của người dùng
    public ApiResponse<List<MenstrualCycle>> getAllMenstrualCycle(Long customerId){
        try {
            // Kiểm tra người dùng có tồn tại hay không
            Optional<UserDtls> user = userRepository.findById(customerId);
            if (user == null){
                return ApiResponse.error("Người dùng không tồn tại");
            }

            // Lấy tất cả chu kỳ kinh nguyệt đã khai báo
            Optional<List<MenstrualCycle>> mcList = menstrualCycleRepository.findAllById(user.get().getId());
            if (mcList == null){
                return ApiResponse.error("Không có chu kỳ kinh nguyệt nào được tìm thấy");
            }

            List<MenstrualCycle> result = mcList.get();
            return ApiResponse.success("Lấy tất cả chu kỳ kinh nguyệt thành công", result);
        } catch (Exception e){
            return ApiResponse.error("Lấy tất cả chu kỳ kinh nguyệt thất bại: " + e.getMessage());
        }
    }


    // Lấy chu kỳ kinh nguyệt có tỉ lệ mang thai
    public ApiResponse<List<MenstrualCycleResponse>> getMenstrualCycleWithPregnancyProb(Long customerId) {
        try {
            // Kiểm tra người dùng có tồn tại hay không
            Optional<UserDtls> user = userRepository.findById(customerId);
            if (!user.isPresent()) {
                return ApiResponse.error("Người dùng không tồn tại");
            }

            // Lấy tất cả chu kỳ kinh nguyệt đã khai báo
            Optional<List<MenstrualCycle>> mcList = menstrualCycleRepository.findAllById(user.get().getId());
            if (!mcList.isPresent() || mcList.get().isEmpty()) {
                return ApiResponse.error("Không có chu kỳ kinh nguyệt nào được tìm thấy");
            }

            List<MenstrualCycle> menstrualCycles = mcList.get();

            List<MenstrualCycleResponse> response = menstrualCycles.stream()
                .map(menstrualCycle -> {
                    Optional<List<PregnancyProbLog>> pregnancyProbLogs =
                        pregnancyProbLogRepository.findAllByMenstrualCycleId(menstrualCycle.getId());

                    return convertToResponse(menstrualCycle,
                        pregnancyProbLogs.isPresent() ? pregnancyProbLogs.get() : List.of());
                })
                .collect(Collectors.toList());


            return ApiResponse.success("Lấy tất cả chu kỳ kinh nguyệt với tỉ lệ mang thai thành công", response);

        } catch (Exception e) {
            return ApiResponse.error("Lấy chu kỳ kinh nguyệt thất bại: " + e.getMessage());
        }
    }


    // Lấy thông tin chu kỳ king nguyệt theo ID
    public ApiResponse<MenstrualCycleResponse> getMenstrualCycleById(Long menstrualCycleId) {
        try {
            Optional<MenstrualCycle> optionalCycle = menstrualCycleRepository.findById(menstrualCycleId);
            if (!optionalCycle.isPresent()) {
                return ApiResponse.error("Chu kỳ kinh nguyệt không tồn tại");
            }

            MenstrualCycle menstrualCycle = optionalCycle.get();
            MenstrualCycleResponse response = convertToResponse(menstrualCycle);

            // Lấy tỉ lệ mang thai liên quan đến chu kỳ kinh nguyệt
            Optional<List<PregnancyProbLog>> pregnancyProbLogs = pregnancyProbLogRepository.findAllByMenstrualCycleId(menstrualCycleId);
            if (pregnancyProbLogs.isPresent()) {
                response.setPregnancyProbLogs(pregnancyProbLogs.get());
            } else {
                response.setPregnancyProbLogs(List.of());
            }

            return ApiResponse.success("Lấy chu kỳ kinh nguyệt thành công", response);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi lấy chu kỳ kinh nguyệt: " + e.getMessage());
        }
    }


    // Chinh sửa chu kỳ kinh nguyệt
    @Transactional
    public ApiResponse<MenstrualCycleResponse> updateMenstrualCycle(Long menstrualCycleId, MenstrualCycleRequest request) {
        try {
            // Kiểm tra input null
            if (request.getStartDate() == null || request.getNumberOfDays() == null || request.getCycleLength() == null) {
                return ApiResponse.error("Thông tin chu kỳ kinh nguyệt không hợp lệ");
            }
            LocalDate startDate = request.getStartDate();
            if (startDate.isAfter(LocalDate.now())) {
                return ApiResponse.error("Ngày bắt đầu chu kỳ kinh nguyệt phải là ngày trong quá khứ");
            }
            if (request.getNumberOfDays() <= 0 || request.getCycleLength() <= 0) {
                return ApiResponse.error("Số ngày hành kinh và chu kỳ kinh nguyệt phải là số dương");
            }

            // Tìm chu kỳ theo ID
            Optional<MenstrualCycle> optionalCycle = menstrualCycleRepository.findById(menstrualCycleId);
            if (!optionalCycle.isPresent()) {
                return ApiResponse.error("Chu kỳ kinh nguyệt không tồn tại");
            }

            MenstrualCycle menstrualCycle = optionalCycle.get();

            // Cập nhật thông tin chu kỳ
            menstrualCycle.setStartDate(request.getStartDate());
            menstrualCycle.setNumberOfDays(request.getNumberOfDays());
            menstrualCycle.setCycleLength(request.getCycleLength());

            // Bảo vệ null cho Boolean
            Boolean reminderEnabled = request.getReminderEnabled() != null ? request.getReminderEnabled() : false;
            menstrualCycle.setReminderEnabled(reminderEnabled);

            // Tính và set ngày rụng trứng
            LocalDate ovulationDate = calculateOvulationDate(menstrualCycle);
            if (ovulationDate == null) {
                return ApiResponse.error("Không thể tính được ngày rụng trứng. Vui lòng kiểm tra dữ liệu.");
            }
            menstrualCycle.setOvulationDate(ovulationDate);

            // Xóa log cũ nếu có
            try {
                List<PregnancyProbLog> oldLogs = pregnancyProbLogRepository
                        .findAllByMenstrualCycleId(menstrualCycleId)
                        .orElse(List.of());

                if (!oldLogs.isEmpty()) {
                    pregnancyProbLogService.deletePregnancyProbLog(menstrualCycleId);
                }
            } catch (Exception ex) {
                ex.printStackTrace();
                return ApiResponse.error("Lỗi khi xóa log cũ: " + ex.getMessage());
            }

            // Thêm log mới
            try {
                pregnancyProbLogService.addPregnancyProbLog(menstrualCycleId);
            } catch (Exception ex) {
                ex.printStackTrace();
                return ApiResponse.error("Lỗi khi tạo log mới: " + ex.getMessage());
            }

            // Lưu thay đổi
            MenstrualCycle updatedCycle = menstrualCycleRepository.save(menstrualCycle);

            // Lấy log mới để trả về
            List<PregnancyProbLog> newPregnancyProbLogs = pregnancyProbLogRepository
                    .findAllByMenstrualCycleId(menstrualCycleId)
                    .orElse(List.of());

            // Chuyển đổi sang response
            MenstrualCycleResponse response = convertToResponse(updatedCycle, newPregnancyProbLogs);
            return ApiResponse.success("Cập nhật chu kỳ kinh nguyệt thành công", response);

        } catch (Exception e) {
            // e.printStackTrace();
            return ApiResponse.error("Lỗi khi cập nhật chu kỳ kinh nguyệt: " + e.getMessage());
        }
    }



    // Xóa chu kỳ kinh nguyệt
    @Transactional
    public ApiResponse<Void> deleteMenstrualCycle(Long menstrualCycleId) {
        try {
            Optional<MenstrualCycle> optionalCycle = menstrualCycleRepository.findById(menstrualCycleId);
            if (!optionalCycle.isPresent()) {
                return ApiResponse.error("Chu kỳ kinh nguyệt không tồn tại");
            }

            // Xóa các log tỉ lệ mang thai liên quan đến chu kỳ kinh nguyệt này
            pregnancyProbLogService.deletePregnancyProbLog(menstrualCycleId);

            // Xóa chu kỳ kinh nguyệt
            menstrualCycleRepository.delete(optionalCycle.get());

            return ApiResponse.success("Xóa chu kỳ kinh nguyệt thành công");
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi xóa chu kỳ kinh nguyệt: " + e.getMessage());
        }
    }



    /*
     * Chuyển đổi MenstrualCycle thành MenstrualCycleResponse không có tỉ lệ mang thai
     */
    public MenstrualCycleResponse convertToResponse(MenstrualCycle menstrualCycle) {
        MenstrualCycleResponse response = new MenstrualCycleResponse();
        response.setId(menstrualCycle.getId());
        response.setUserId(menstrualCycle.getUser().getId());
        response.setStartDate(menstrualCycle.getStartDate());
        response.setNumberOfDays(menstrualCycle.getNumberOfDays());
        response.setCycleLength(menstrualCycle.getCycleLength());
        response.setReminderEnabled(menstrualCycle.getReminderEnabled());
        return response;
    }

    /*
     * Chuyển đổi MenstrualCycle thành MenstrualCycleResponse có tỉ lệ mang thai
     */
    public MenstrualCycleResponse convertToResponse(MenstrualCycle menstrualCycle, List<PregnancyProbLog> pregnancyProbLogs) {
        MenstrualCycleResponse response = new MenstrualCycleResponse();
        response.setId(menstrualCycle.getId());
        response.setUserId(menstrualCycle.getUser().getId());
        response.setStartDate(menstrualCycle.getStartDate());
        response.setNumberOfDays(menstrualCycle.getNumberOfDays());
        response.setCycleLength(menstrualCycle.getCycleLength());
        response.setReminderEnabled(menstrualCycle.getReminderEnabled());
        response.setPregnancyProbLogs(pregnancyProbLogs);
        return response;


}


    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }
}