package com.healapp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ControlPillsRequest;
import com.healapp.dto.ControlPillsResponse;
import com.healapp.dto.PillLogsRespone;
import com.healapp.dto.PillReminderDetailsResponse;
import com.healapp.model.ControlPills;
import com.healapp.model.NotificationPreference;
import com.healapp.model.NotificationType;
import com.healapp.model.PillLogs;
import com.healapp.model.PillType;
import com.healapp.model.UserDtls;
import com.healapp.repository.ControlPillsRepository;
import com.healapp.repository.NotificationPreferenceRepository;
import com.healapp.repository.PillLogsRepository;
import com.healapp.repository.UserRepository;

@Service
public class ControlPillsService {
   
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    @Autowired
    private ControlPillsRepository controlPillsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PillLogsRepository pillLogsRepository;

    @Autowired
    private NotificationPreferenceRepository notificationPreferenceRepository;


    //Thêm lịch uống thuốc
    @Transactional
    public ApiResponse<ControlPillsResponse> createControlPills(ControlPillsRequest request){
      try {
          Long userId = getCurrentUserId();
          Optional<UserDtls> user = userRepository.findById(userId);
          if (!user.isPresent()) {
              throw new RuntimeException("Không tìm thấy người dùng");
          }
  
          ControlPills con = new ControlPills();
          con.setUserId(user.get());

          // Tự động set số ngày uống/ngày nghỉ theo pillType
          if (request.getPillType() == PillType.TYPE_28) {
              con.setNumberDaysDrinking(28);
              con.setNumberDaysOff(0);
          } else if (request.getPillType() == PillType.TYPE_21_7) {
              con.setNumberDaysDrinking(21);
              con.setNumberDaysOff(7);
          } else {
              con.setNumberDaysDrinking(request.getNumberDaysDrinking());
              con.setNumberDaysOff(request.getNumberDaysOff());
          }

          con.setRemindTime(request.getRemindTime());
          con.setIsActive(true); 
          con.setStartDate(request.getStartDate());
          con.setPillType(request.getPillType());
  
          controlPillsRepository.save(con);

          // Lưu thời gian remind cho lịch uống thuốc
          // Lấy notificationPreference của người dùng này
          Optional<NotificationPreference> notificationPreference = notificationPreferenceRepository.findByUserIdAndType(userId, NotificationType.PILL_REMINDER);
            if (notificationPreference.isPresent()) {
                NotificationPreference preference = notificationPreference.get();
                preference.setRemindTime(request.getRemindTime());
                preference.setEnabled(true);
                notificationPreferenceRepository.save(preference);
            } else {
                // Nếu không có preference, tạo mới
                NotificationPreference newPreference = new NotificationPreference();
                newPreference.setUser(user.get());
                newPreference.setType(NotificationType.PILL_REMINDER);
                newPreference.setRemindTime(request.getRemindTime());
                newPreference.setEnabled(true);
                notificationPreferenceRepository.save(newPreference);
            }

          // Generate log cho toàn bộ chu kỳ đầu tiên (tất cả các ngày uống thuốc)
          for (int i = 0; i < con.getNumberDaysDrinking(); i++) {
              LocalDate logDate = con.getStartDate().plusDays(i);
              generatePillLogForSpecificDate(con, logDate);
          }

          ControlPillsResponse response = convertResponse(con);
  
          return ApiResponse.success("Thêm lịch uống thuốc thành công", response);
      } catch (Exception e) {
          e.printStackTrace();
          throw new RuntimeException("Đã xảy ra lỗi khi thêm lịch", e);
      }
  }
  
    

    

    //Cập nhật trạng thái uống thuốc
    public ApiResponse<PillLogsRespone> updateCheckIn(Long logId) {
        try {
            Optional<PillLogs> logOpt = pillLogsRepository.findById(logId);
            if (!logOpt.isPresent()) {
                return ApiResponse.error("Không tìm thấy log uống thuốc");
            }
    
            PillLogs log = logOpt.get();
            // Nếu đã check-in thì bỏ check-in, ngược lại thì check-in
            if (log.getStatus() != null && log.getStatus()) {
                // Bỏ check-in
                log.setStatus(false);
                log.setCheckIn(null);
            } else {
                // Check-in
                log.setStatus(true);
                log.setCheckIn(LocalDateTime.now(VIETNAM_ZONE));
            }
            log.setUpdatedAt(LocalDateTime.now(VIETNAM_ZONE));
            // Không cập nhật logDate khi bỏ check-in
    
            pillLogsRepository.save(log);
            return ApiResponse.success("Cập nhật trạng thái check-in thành công", responePillLogs(log));
        } catch (Exception e) {
            return ApiResponse.error("Lỗi khi cập nhật log uống thuốc");
        }
    }
    

    //chỉnh sửa lịch uống thuốc
    @Transactional
    public ApiResponse<ControlPillsResponse> updateControlPills(Long controlPillsId, ControlPillsRequest request){
        try {
            if( request.getStartDate() == null ||request.getRemindTime() == null){
               throw new RuntimeException("Thông tin lịch uống thuốc không hợp lệ");
            }
            Optional<ControlPills> optional = controlPillsRepository.findById(controlPillsId); 
            if(!optional.isPresent()){
              throw new RuntimeException("Lịch uống thuốc không hợp lệ ");
            }
            ControlPills controlPills = optional.get();
            LocalDate oldDate = controlPills.getStartDate();
            LocalDate newDate = request.getStartDate();

            controlPills.setNumberDaysDrinking(request.getNumberDaysDrinking());
            controlPills.setNumberDaysOff(request.getNumberDaysOff());
            controlPills.setStartDate(newDate);
            controlPills.setRemindTime(request.getRemindTime());
            controlPills.setPillType(request.getPillType());

            //nếu đổi ngày bắt đầu thì xóa các log cũ và tạo lại từ đầu
            if(!newDate.equals(oldDate) ){ 
                pillLogsRepository.deleteByControlPills(controlPills);
                
                // Generate lại log cho toàn bộ chu kỳ đầu tiên (tất cả các ngày uống thuốc)
                for (int i = 0; i < controlPills.getNumberDaysDrinking(); i++) {
                    LocalDate logDate = controlPills.getStartDate().plusDays(i);
                    generatePillLogForSpecificDate(controlPills, logDate);
                }
            }

        
            ControlPillsResponse response = convertResponse(controlPills);

            // Lưu thời gian remind cho lịch uống thuốc
          // Lấy notificationPreference của người dùng này
          Optional<NotificationPreference> notificationPreference = notificationPreferenceRepository.findByUserIdAndType(controlPills.getUserId().getId(), NotificationType.PILL_REMINDER);
            if (notificationPreference.isPresent()) {
                NotificationPreference preference = notificationPreference.get();
                preference.setRemindTime(request.getRemindTime());
                preference.setEnabled(true);
                notificationPreferenceRepository.save(preference);
            } else {
                // Nếu không có preference, tạo mới
                NotificationPreference newPreference = new NotificationPreference();
                newPreference.setUser(controlPills.getUserId());
                newPreference.setType(NotificationType.PILL_REMINDER);
                newPreference.setRemindTime(request.getRemindTime());
                newPreference.setEnabled(true);
                notificationPreferenceRepository.save(newPreference);
            }

          // Generate log cho toàn bộ chu kỳ đầu tiên (tất cả các ngày uống thuốc)
          for (int i = 0; i < controlPills.getNumberDaysDrinking(); i++) {
              LocalDate logDate = controlPills.getStartDate().plusDays(i);
              generatePillLogForSpecificDate(controlPills, logDate);
          }
            return ApiResponse.success("Đã cập nhật lịch uống thuốc thành công", response);
        } catch (Exception e) {
          e.printStackTrace();
            throw new RuntimeException("Đã xảy ra lỗi khi cập nhật thêm lịch", e);
         }
        }

    // Method to generate a single pill log for a specific date
    private void generatePillLogForSpecificDate(ControlPills con, LocalDate logDate) {
        boolean shouldLog = true;
        if (con.getPillType() == PillType.TYPE_21_7) {
            // Calculate cycleDay based on logDate relative to startDate
            long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(con.getStartDate(), logDate);
            int cycleDay = (int) (daysBetween % 28);
            if (cycleDay >= 21) { 
                shouldLog = false;
            }
        } else if (con.getPillType() == PillType.CUSTOM) {
            // Calculate cycleDay based on logDate relative to startDate
            long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(con.getStartDate(), logDate);
            int cycleDay = (int) (daysBetween % (con.getNumberDaysDrinking() + con.getNumberDaysOff()));
            if (cycleDay >= con.getNumberDaysDrinking()) {
                shouldLog = false;
            }
        }
        if (shouldLog) {
            // Kiểm tra log đã tồn tại chưa
            Optional<PillLogs> existingLog = pillLogsRepository.findByControlPillsAndLogDate(con, logDate);
            if (existingLog.isPresent()) {
                // Đã có log cho ngày này, không tạo mới
                return;
            }
            PillLogs log = new PillLogs();
            log.setControlPills(con);
            log.setCreatedAt(LocalDateTime.now(VIETNAM_ZONE));
            log.setUpdatedAt(LocalDateTime.now(VIETNAM_ZONE));
            log.setStatus(false);
            log.setLogDate(logDate);
            pillLogsRepository.save(log);
        }
    }

    // New method for daily log generation by scheduler
    @Transactional
    public void generateLogsForActivePills() {
        LocalDate today = LocalDate.now(VIETNAM_ZONE);
        List<ControlPills> activePills = controlPillsRepository.findByIsActive(true);

        for (ControlPills con : activePills) {
            // Check if a log for today already exists for this ControlPills entry
            Optional<PillLogs> existingLog = pillLogsRepository.findByControlPillsAndLogDate(con, today);
            if (!existingLog.isPresent()) {
                // Generate log for today if it doesn't exist
                generatePillLogForSpecificDate(con, today);
            }
        }
    }

    

    //Lấy ra thông tin của lịch uống thuốc
    public ApiResponse<PillReminderDetailsResponse> getPillLogsByStatus(Long controlPillsId, Boolean status) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ApiResponse.error("Người dùng chưa được xác thực.");
            }

            Optional<ControlPills> controlOpt = controlPillsRepository.findById(controlPillsId);
            if (!controlOpt.isPresent()) {
                return ApiResponse.error("Không tìm thấy lịch uống thuốc");
            }
    
            ControlPills controlPills = controlOpt.get();

            if (!controlPills.getUserId().getId().equals(currentUserId)) {
                return ApiResponse.error("Bạn không có quyền truy cập lịch uống thuốc này.");
            }

            List<PillLogs> logs = pillLogsRepository.findByControlPillsAndStatus(controlPills, status);
            
            ControlPillsResponse controlPillsResponse = convertResponse(controlPills);
            List<PillLogsRespone> pillLogsResponses = logs.stream()
                    .map(this::responePillLogs)
                    .collect(Collectors.toList());

            PillReminderDetailsResponse response = new PillReminderDetailsResponse(controlPillsResponse, pillLogsResponses);
    
            return ApiResponse.success("Lấy danh sách log uống thuốc thành công", response);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Đã xảy ra lỗi khi lấy danh sách log uống thuốc");
        }
    }

    //Xóa lịch uống thuốc 
    public ApiResponse<String> deleteControlPills(Long controlPillId){
        try {
            Long currentUserId = getCurrentUserId(); // Lấy ID của người dùng hiện tại
            if (currentUserId == null) {
                return ApiResponse.error("Người dùng chưa được xác thực.");
            }

            Optional<ControlPills> controlPillsOpt = controlPillsRepository.findById(controlPillId);
            if(!controlPillsOpt.isPresent()){
                return ApiResponse.error("Lịch uống thuốc không tồn tại");
            }
            
            ControlPills controlPills = controlPillsOpt.get();

            // Kiểm tra quyền sở hữu: đảm bảo lịch thuộc về người dùng hiện tại
            if (!controlPills.getUserId().getId().equals(currentUserId)) {
                return ApiResponse.error("Bạn không có quyền xóa lịch uống thuốc này.");
            }

            //Xóa đi mấy cái log trước vì nó 
            controlPills.setIsActive(false);
            controlPillsRepository.save(controlPills);
            return ApiResponse.success("Xóa lịch uống thuốc thành công");
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Lỗi khi xóa lịch uống thuốc");
        }
    }

    // Lấy lịch uống thuốc đang hoạt động của người dùng hiện tại
    public ApiResponse<ControlPillsResponse> getActiveControlPillsForCurrentUser() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ApiResponse.error("Người dùng chưa được xác thực.");
            }
            UserDtls currentUser = userRepository.findById(currentUserId)
                                                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng hiện tại."));

            Optional<List<ControlPills>> activePillsOptional = controlPillsRepository.findByUserIdAndIsActive(currentUser, true);
            
            if (activePillsOptional.isPresent() && !activePillsOptional.get().isEmpty()) {
                // Trả về lịch đầu tiên tìm thấy (giả định mỗi người dùng chỉ có 1 lịch active)
                ControlPills activePill = activePillsOptional.get().get(0);
                ControlPillsResponse response = convertResponse(activePill);
                return ApiResponse.success("Lấy lịch uống thuốc đang hoạt động thành công", response);
            } else {
                return ApiResponse.error("Không tìm thấy lịch uống thuốc đang hoạt động cho người dùng này.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Đã xảy ra lỗi khi lấy lịch uống thuốc đang hoạt động.");
        }
    }

    // Lấy tất cả lịch uống thuốc của user
    public ApiResponse<List<ControlPillsResponse>> getAllControlPillsForUser(Long userId) {
        List<ControlPills> list = controlPillsRepository.findByUserId_Id(userId);
        List<ControlPillsResponse> respList = list.stream().map(this::convertResponse).collect(Collectors.toList());
        return ApiResponse.success("Lấy danh sách lịch uống thuốc thành công", respList);
    }

   

    //convert cái response
    private ControlPillsResponse convertResponse(ControlPills con){
        ControlPillsResponse response = new ControlPillsResponse();
            response.setPillsId(con.getPillsId());
            response.setNumberDaysDrinking(con.getNumberDaysDrinking());
            response.setNumberDaysOff(con.getNumberDaysOff());
            response.setRemindTime(con.getRemindTime());
            response.setIsActive(con.getIsActive());
            response.setStartDate(con.getStartDate());
            response.setUpdatedAt(con.getUpdatedAt());
            response.setPillType(con.getPillType());
        return response;

}
    //convertResponse của cái pillLog
    private PillLogsRespone responePillLogs(PillLogs pill){
        PillLogsRespone res = new PillLogsRespone();
            res.setLogId(pill.getLogId());
            res.setCheckIn(pill.getCheckIn());
            res.setLogDate(pill.getLogDate());
            res.setCreatedAt(pill.getCreatedAt());
            res.setStatus(pill.getStatus());
        return res;
    }

    // check user 
    protected Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }

    
}
