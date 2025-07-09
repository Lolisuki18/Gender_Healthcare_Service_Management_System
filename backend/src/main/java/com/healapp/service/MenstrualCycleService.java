package com.healapp.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
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
import lombok.extern.slf4j.Slf4j;

@Slf4j
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

    @Autowired
    private EmailService emailService;
    

    // Tính ngày rụng trứng dựa trên chu kỳ kinh nguyệt
    public LocalDate calculateOvulationDate(MenstrualCycle menstrualCycle) {
        if (menstrualCycle == null || menstrualCycle.getStartDate() == null || menstrualCycle.getCycleLength() == null) {
            return null;
        }
        // Ngày rụng trứng thường xảy ra khoảng 14 ngày trước khi bắt đầu chu kỳ kinh nguyệt tiếp theo
        return menstrualCycle.getStartDate().plusDays(menstrualCycle.getCycleLength() - 14);
    }


    // Lấy chu kỳ kinh nguyệt gần nhất
    public MenstrualCycleResponse getLatestMenstrualCycle() {
        try {
            Long userId = getCurrentUserId();
            Optional<MenstrualCycle> latestCycle = menstrualCycleRepository.findTopByUserIdOrderByStartDateDesc(userId);
            if (!latestCycle.isPresent()) {
                return null;
            }
            return convertToResponse(latestCycle.get());
        } catch (Exception e) {
            return null;
        }
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
            menstrualCycle.setOvulationRemind(request.getOvulationRemind() != null ? request.getOvulationRemind() : false);
            menstrualCycle.setPregnancyRemind(request.getPregnancyRemind() != null ? request.getPregnancyRemind() : false);

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
            if (!user.isPresent()) {
                return ApiResponse.error("Người dùng không tồn tại");
            }

            // Lấy tất cả chu kỳ kinh nguyệt đã khai báo
            Optional<List<MenstrualCycle>> mcList = menstrualCycleRepository.findAllByUserId(user.get().getId());
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
            Optional<List<MenstrualCycle>> mcList = menstrualCycleRepository.findAllByUserId(user.get().getId());
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


    // Lấy thông tin chu kỳ kinh nguyệt theo ID
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

    // Lấy chu kỳ kinh nguyệt gần nhất trước ngày hiện tại
    public Optional<MenstrualCycle> getLatestCycleBeforeToday(Long userId, LocalDate today) {
        try {
            return menstrualCycleRepository.findLatestCycleBeforeToday(userId, today);
        } catch (Exception e) {
            log.error("Lỗi khi lấy chu kỳ kinh nguyệt gần nhất trước ngày hiện tại: " + e.getMessage());
            return Optional.empty();
        }
    }


    // Chỉnh sửa chu kỳ kinh nguyệt
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
            Boolean ovulationRemind = request.getOvulationRemind() != null ? request.getOvulationRemind() : menstrualCycle.getOvulationRemind();
            Boolean pregnancyRemind = request.getPregnancyRemind() != null ? request.getPregnancyRemind() : menstrualCycle.getPregnancyRemind();
            menstrualCycle.setOvulationRemind(ovulationRemind);
            menstrualCycle.setPregnancyRemind(pregnancyRemind);

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


    // Gửi email nhắc nhở về ngày rụng trứng
    // @Scheduled(cron = "0 0 7 * * ?") // Mỗi ngày lúc 7 giờ sáng
    // public ApiResponse<String> sendOvulationReminderEmail() {
    //     try {
    //         Optional<MenstrualCycle> menstrualCycleOpt = menstrualCycleRepository.findLatestCycleBeforeToday(getCurrentUserId(), LocalDate.now());
    //         if (menstrualCycleOpt.isEmpty()) {
    //             log.info("Không tìm thấy chu kỳ kinh nguyệt cho user: " + getCurrentUserId());
    //             return ApiResponse.error("Không tìm thấy chu kỳ kinh nguyệt cho user: " + getCurrentUserId());
    //         }
    //         MenstrualCycle menstrualCycle = menstrualCycleOpt.get();
    //         if (menstrualCycle.getOvulationRemind() == null || !menstrualCycle.getOvulationRemind()) {
    //             log.info("Nhắc nhở không được bật cho user: " + menstrualCycle.getUser().getId());
    //             return ApiResponse.error("Nhắc nhở không được bật cho user: " + menstrualCycle.getUser().getId());
    //         }
    //         LocalDate today = LocalDate.now();
    //         LocalDate ovulationDate = menstrualCycle.getOvulationDate();

    //         // Gửi nếu hôm nay là đúng 1 ngày trước rụng trứng
    //         if (today.isEqual(ovulationDate.minusDays(1))) {
    //             String email = menstrualCycle.getUser().getEmail();
    //             String fullName = menstrualCycle.getUser().getFullName();

    //             emailService.sendOvulationReminderAsync(email, fullName, ovulationDate);
    //             log.info("Đã gửi email nhắc nhở ngày rụng trứng cho user: " + menstrualCycle.getUser().getId());
    //         } else {
    //             log.info("Hôm nay không phải là 1 ngày trước rụng trứng, không gửi email cho user: " + menstrualCycle.getUser().getId());
    //         }
    //         return ApiResponse.success("Đã gửi email nhắc nhở ngày rụng trứng cho user: " + getCurrentUserId());

    //     } catch (Exception e) {
    //         log.error("Lỗi khi gửi email nhắc nhở ngày rụng trứng cho user: " + getCurrentUserId(), e);
    //         return ApiResponse.error("Lỗi khi gửi email nhắc nhở ngày rụng trứng: " + e.getMessage());
    //     }
    // }


    // Gửi email nhắc nhở về tỉ lệ mang thai cao
    // @Scheduled(cron = "0 0 7 * * ?")    // Mỗi ngày lúc 7 giờ sáng
    // public void sendReminderPregnancy() {
    //     LocalDate today = LocalDate.now();
    //     List<UserDtls> users = userRepository.findAll();

    //     for (UserDtls user : users) {
    //         try {
    //             Optional<MenstrualCycle> cycleOpt = menstrualCycleRepository.findLatestCycleBeforeToday(user.getId(), today);
    //             if (cycleOpt.isEmpty()) continue;

    //             MenstrualCycle cycle = cycleOpt.get();
    //             if(cycle.getPregnancyRemind() == null || !cycle.getPregnancyRemind()) {
    //                 log.info("Nhắc nhở không được bật cho user: " + user.getId());
    //                 continue;
    //             }
    //             LocalDate ovulationDate = cycle.getOvulationDate();

    //             List<PregnancyProbLog> logs = pregnancyProbLogRepository.findAllByMenstrualCycleId(cycle.getId()).orElse(List.of());
    //             if (logs.isEmpty()) continue;

    //             double probToday = 0.0;
    //             LocalDate start = today, end = today;

    //             for (PregnancyProbLog log : logs) {
    //                 if (log.getDate().isBefore(start)) start = log.getDate();
    //                 if (log.getDate().isAfter(end)) end = log.getDate();
    //                 if (log.getDate().isEqual(today)) probToday = log.getProbability().doubleValue();
    //             }

    //             if (today.isAfter(start) && today.isBefore(end)) {
    //                 int daysBeforeOvulation = (int) ChronoUnit.DAYS.between(ovulationDate, today);
    //                 emailService.sendOvulationWithPregnancyProbReminderAsync(
    //                     user.getEmail(), user.getFullName(),
    //                     daysBeforeOvulation, probToday, ovulationDate
    //                 );
    //             }

    //         } catch (Exception e) {
    //             // Chỉ log lỗi của user đó, không làm gián đoạn toàn bộ
    //             log.error("Lỗi khi gửi reminder cho user: " + user.getId(), e);
    //         }
    //     }
    // }


    // Tính chu kỳ trung bình
    public ApiResponse<Double> calculateAverageCycleLength(Long userId) {
        try {
            List<MenstrualCycle> cycles = menstrualCycleRepository.findAllByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chu kỳ kinh nguyệt cho người dùng"));

            if (cycles.isEmpty()) {
                return ApiResponse.error("Không có chu kỳ kinh nguyệt nào để tính toán");
            }

            double totalCycleLength = cycles.stream()
                .mapToDouble(MenstrualCycle::getCycleLength)
                .sum();

            double averageCycleLength = totalCycleLength / cycles.size();
            return ApiResponse.success("Tính chu kỳ trung bình thành công", averageCycleLength);
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi tính chu kỳ trung bình: " + e.getMessage());
        }
    }

    // Dự đoán chu kỳ kinh nguyệt tiếp theo
    // public ApiResponse<LocalDate> predictNextCycle() {
    //     try {
    //         Long userId = getCurrentUserId();
    //         Optional<MenstrualCycle> latestCycleOpt = menstrualCycleRepository.findLatestCycleBeforeToday(userId, LocalDate.now());

    //         if (!latestCycleOpt.isPresent()) {
    //             return ApiResponse.error("Không tìm thấy chu kỳ kinh nguyệt gần nhất");
    //         }

    //         MenstrualCycle latestCycle = latestCycleOpt.get();
    //         LocalDate nextCycleStartDate = latestCycle.getStartDate().plusDays(latestCycle.getCycleLength());

    //         return ApiResponse.success("Dự đoán chu kỳ kinh nguyệt tiếp theo thành công", nextCycleStartDate);
    //     } catch (Exception e) {
    //         return ApiResponse.error("Lỗi khi dự đoán chu kỳ kinh nguyệt tiếp theo: " + e.getMessage());
    //     }
    // }
    public ApiResponse<LocalDate> predictNextCycle(Long userId) {
        try {
            log.info("Predicting next cycle for userId: {}", userId);
            
            // Thử tìm chu kỳ gần nhất trước hôm nay
            Optional<MenstrualCycle> latestCycleOpt = menstrualCycleRepository.findLatestCycleBeforeToday(userId, LocalDate.now());
            
            if (!latestCycleOpt.isPresent()) {
                log.error("No menstrual cycle found for userId: {}", userId);
                return ApiResponse.error("Không tìm thấy chu kỳ kinh nguyệt nào để dự đoán. Vui lòng thêm ít nhất một chu kỳ.");
            }

            MenstrualCycle latestCycle = latestCycleOpt.get();
            log.info("Found latest cycle: startDate={}, cycleLength={}", latestCycle.getStartDate(), latestCycle.getCycleLength());
            
            LocalDate nextCycleStartDate = latestCycle.getStartDate().plusDays(latestCycle.getCycleLength());
            log.info("Predicted next cycle start date: {}", nextCycleStartDate);

            return ApiResponse.success("Dự đoán chu kỳ kinh nguyệt tiếp theo thành công", nextCycleStartDate);
        } catch (Exception e) {
            log.error("Error predicting next cycle for userId: {}", getCurrentUserId(), e);
            return ApiResponse.error("Lỗi khi dự đoán chu kỳ kinh nguyệt tiếp theo: " + e.getMessage());
        }
    }

    // Thay đổi trạng thái của nhắc nhở rụng trứng
    @Transactional
    public ApiResponse<MenstrualCycleResponse> toggleOvulationReminder(Long menstrualCycleId) {
        try {
            Optional<MenstrualCycle> optionalCycle = menstrualCycleRepository.findById(menstrualCycleId);
            if (!optionalCycle.isPresent()) {
                return ApiResponse.error("Chu kỳ kinh nguyệt không tồn tại");
            }

            MenstrualCycle menstrualCycle = optionalCycle.get();
            boolean currentStatus = menstrualCycle.getOvulationRemind() != null ? menstrualCycle.getOvulationRemind() : false;
            menstrualCycle.setOvulationRemind(!currentStatus);

            MenstrualCycle updatedCycle = menstrualCycleRepository.save(menstrualCycle);

            return ApiResponse.success("Thay đổi trạng thái nhắc nhở rụng trứng thành công", convertToResponse(updatedCycle));
        } catch (Exception e) {
            log.error("Error toggling ovulation reminder for menstrualCycleId: {}", menstrualCycleId, e);
            return ApiResponse.error("Lỗi khi thay đổi trạng thái nhắc nhở rụng trứng: " + e.getMessage());
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
        response.setOvulationDate(menstrualCycle.getOvulationDate());
        response.setOvulationRemind(null != menstrualCycle.getOvulationRemind() ? menstrualCycle.getOvulationRemind() : false);
        response.setPregnancyRemind(null != menstrualCycle.getPregnancyRemind() ? menstrualCycle.getPregnancyRemind() : false);
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
        response.setOvulationDate(menstrualCycle.getOvulationDate());
        response.setCycleLength(menstrualCycle.getCycleLength());
        response.setOvulationRemind(null != menstrualCycle.getOvulationRemind() ? menstrualCycle.getOvulationRemind() : false);
        response.setPregnancyRemind(null != menstrualCycle.getPregnancyRemind() ? menstrualCycle.getPregnancyRemind() : false);
        response.setPregnancyProbLogs(pregnancyProbLogs);
        return response;


    }


    protected Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }


}