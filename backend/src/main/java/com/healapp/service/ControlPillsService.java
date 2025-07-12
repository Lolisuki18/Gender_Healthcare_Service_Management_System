package com.healapp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ControlPillsRequest;
import com.healapp.dto.ControlPillsResponse;
import com.healapp.dto.PillLogsRespone;
import com.healapp.dto.PillReminderDetailsResponse;
import com.healapp.model.UserDtls;
import com.healapp.model.ControlPills;
import com.healapp.model.PillLogs;
import com.healapp.repository.ControlPillsRepository;
import com.healapp.repository.PillLogsRepository;
import com.healapp.repository.UserRepository;

@Service
public class ControlPillsService {
   
    @Autowired
    private ControlPillsRepository controlPillsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PillLogsRepository pillLogsRepository;

    // //Thêm lịch uống thuốc
    // public ApiResponse<ControlPillsResponse> createControlPills(ControlPillsRequest request){
    //    try {
    //       Long userId = getCurrentUserId();
    //       Optional<UserDtls> user = userRepository.findById(userId);
    //       if(!user.isPresent()){
    //         return ApiResponse.error("Không tìm thấy người dùng");
    //       }
    //       //Tạo 1 cái lịch 
    //       ControlPills con = new ControlPills();
    //       con.setUserId(user.get());
    //       con.setNumberDaysDrinking(request.getNumberDaysDrinking());
    //       con.setNumberDaysOff(request.getNumberDaysOff());
    //       con.setRemindTime(request.getRemindTime());
    //       con.setIsActive(request.getIsActive());
    //       con.setStartDate(request.getStartDate());
    //       //Lưu lại
    //       controlPillsRepository.save(con);
    //       //Tạo ra cái lịch uống thuốc cho 1 năm
    //       List<PillLogs> log = new ArrayList<>();
    //       LocalDate current = request.getStartDate(); //ngày bắt đầu chu kì thuốc
    //       int days = 0;
    //       int cycleLength = request.getNumberDaysDrinking() + request.getNumberDaysOff();

    //       while (days < 365) {
    //         //uống thuốc (active days)
    //         for(int i = 0; i < request.getNumberDaysDrinking() && days < 365; i++){
    //             PillLogs logs = new PillLogs();
    //             logs.setCheckIn(current.atTime(request.getRemindTime()));
    //             logs.setCreatedAt(LocalDateTime.now());
    //             logs.setStatus(false);//ban đầu là chưa uống
    //             logs.setControlPills(con);
    //             log.add(logs);
                
    //             current = current.plusDays(1);
    //             days ++;
    //         }
    //         //Cái ngày nghỉ uống thuốc
    //         current = current.plusDays(request.getNumberDaysOff());
    //         days += request.getNumberDaysOff();
    //       }
    //       pillLogsRepository.saveAll(log);
        
    //     return ApiResponse.success("Thêm lịch uống thuốc thành công", convertResponse(con));
    //    } catch (Exception e) {
    //       e.printStackTrace();
    //       return ApiResponse.error("Đã xảy ra lỗi khi thêm lịch");
    //    }
    // }
    // private ControlPillsResponse convertResponse(ControlPills con){
    //     ControlPillsResponse response = new ControlPillsResponse();
    //       response.setPillsId(con.getPillsId());
    //       response.setNumberDaysDrinking(con.getNumberDaysDrinking());
    //       response.setNumberDaysOff(con.getNumberDaysOff());
    //       response.setRemindTime(con.getRemindTime());
    //       response.setIsActive(con.getIsActive());
    //       response.setStartDate(con.getStartDate());
    //       response.setUpdatedAt(con.getUpdatedAt());
    //       return response;

    // }


    // protected Long getCurrentUserId() {
    //     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    //     String username = authentication.getName();
    //     return userService.getUserIdFromUsername(username);
    // }

    //Thêm lịch uống thuốc
    public ApiResponse<ControlPillsResponse> createControlPills(ControlPillsRequest request){
      try {
          Long userId = getCurrentUserId();
          Optional<UserDtls> user = userRepository.findById(userId);
          if (!user.isPresent()) {
              return ApiResponse.error("Không tìm thấy người dùng");
          }
  
          ControlPills con = new ControlPills();
          con.setUserId(user.get());
          con.setNumberDaysDrinking(request.getNumberDaysDrinking());
          con.setNumberDaysOff(request.getNumberDaysOff());
          con.setRemindTime(request.getRemindTime());
          con.setIsActive(request.getIsActive());
          con.setStartDate(request.getStartDate());
          con.setPlacebo(request.getPlacebo());
          
  
          controlPillsRepository.save(con);

          generatePillLogs(con);

          ControlPillsResponse response = convertResponse(con);
  
          return ApiResponse.success("Thêm lịch uống thuốc thành công", response);
      } catch (Exception e) {
          e.printStackTrace();
          return ApiResponse.error("Đã xảy ra lỗi khi thêm lịch");
      }
  }
  
    

    

    //Cập nhật trạng thái uống thuốc
    public ApiResponse<PillLogsRespone> updateCheckIn( Long logId){
    try {
        Optional<PillLogs> logOpt = pillLogsRepository.findById(logId);
        if (!logOpt.isPresent()) {
            return ApiResponse.error("Không tìm thấy log uống thuốc");
        }
        
        PillLogs log = logOpt.get();
        
        // Toggle status: if true -> false, if false -> true
        boolean newStatus = !Boolean.TRUE.equals(log.getStatus());
        log.setStatus(newStatus);

        if (newStatus) {
            log.setCheckIn(LocalDateTime.now());
            log.setUpdatedAt(LocalDateTime.now()); // Update updatedAt field when check-in
        } else {
            log.setCheckIn(null);
            log.setUpdatedAt(LocalDateTime.now()); // Update updatedAt field when uncheck-in
        }
        
        pillLogsRepository.save(log);
        
        PillLogsRespone response = responePillLogs(log);
        return ApiResponse.success("Cập nhật trạng thái check-in thành công", response);
    } catch (Exception e) {
        e.printStackTrace();
        return ApiResponse.error("Lỗi khi cập nhật trạng thái check-in");
    }
}

    //chỉnh sửa lịch uống thuốc
    public ApiResponse<ControlPillsResponse> updateControlPills(Long controlPillsId, ControlPillsRequest request){
        try {
            if( request.getStartDate() == null ||request.getRemindTime() == null){
               return ApiResponse.error("Thông tin lịch uống thuốc không hợp lệ");
            }
            Optional<ControlPills> optional = controlPillsRepository.findById(controlPillsId); 
            if(!optional.isPresent()){
              return ApiResponse.error("Lịch uống thuốc không hợp lệ ");
            }
            ControlPills controlPills = optional.get();
            LocalDate oldDate = controlPills.getStartDate();
            LocalDate newDate = request.getStartDate();

            controlPills.setNumberDaysDrinking(request.getNumberDaysDrinking());
            controlPills.setNumberDaysOff(request.getNumberDaysOff());
            controlPills.setStartDate(newDate);
            controlPills.setRemindTime(request.getRemindTime());
            controlPills.setPlacebo(request.getPlacebo());

            //nếu đổi ngày bắt đầu thì xóa ccas log từ ngày đổi trở 
            if(!newDate.equals(oldDate) ){
                pillLogsRepository.deleteLogsAfterToday(controlPillsId);
                generatePillLogs(controlPills);//tạo lại log cho 1 năm mới từ stardate
            }

        
            ControlPillsResponse response = convertResponse(controlPills);
            return ApiResponse.success("Đã cập nhật lịch uống thuốc thành công", response);
        } catch (Exception e) {
          e.printStackTrace();
            return ApiResponse.error("Đã xảy ra lỗi khi cập nhật thêm lịch");
         }
        }
    //tạo ra log cho 1 năm lịch uống thuốc
    private void generatePillLogs(ControlPills con) {
        LocalDate currentDate = con.getStartDate();
        int totalDays = 365;
        int drink = con.getNumberDaysDrinking();
        int off = con.getNumberDaysOff();
        Boolean placebo = Boolean.TRUE.equals(con.getPlacebo());
        List<PillLogs> logsToSave = new ArrayList<>();
    
        while (totalDays > 0) {
            // Kiểm tra xem đã có log cho ngày này chưa
            Optional<PillLogs> existingLog = pillLogsRepository.findByControlPillsAndLogDate(con, currentDate);
            
            // Tạo các ngày uống thuốc
            for (int i = 0; i < drink && totalDays > 0; i++) {
                PillLogs log;
                Optional<PillLogs> innerExistingLog = pillLogsRepository.findByControlPillsAndLogDate(con, currentDate);
                if (innerExistingLog.isPresent()) {
                    log = innerExistingLog.get();
                    // Cập nhật trạng thái và các trường khác nếu cần
                    log.setStatus(false); // Đảm bảo trạng thái ban đầu là chưa uống
                    log.setUpdatedAt(LocalDateTime.now());
                } else {
                    log = new PillLogs();
                    log.setControlPills(con);
                    log.setCreatedAt(LocalDateTime.now());
                    log.setUpdatedAt(LocalDateTime.now());
                    log.setStatus(false); // chưa uống
                    log.setLogDate(currentDate);
                }
                logsToSave.add(log);
    
                currentDate = currentDate.plusDays(1);
                totalDays--;
            }
            if(placebo){
                for(int i = 0; i < off && totalDays > 0; i++){
                    PillLogs log;
                    Optional<PillLogs> innerExistingLog = pillLogsRepository.findByControlPillsAndLogDate(con, currentDate);
                    if (innerExistingLog.isPresent()) {
                        log = innerExistingLog.get();
                        log.setStatus(false); // Đảm bảo trạng thái ban đầu là chưa uống
                        log.setUpdatedAt(LocalDateTime.now());
                    } else {
                        log = new PillLogs();
                        log.setControlPills(con);
                        log.setCreatedAt(LocalDateTime.now());
                        log.setUpdatedAt(LocalDateTime.now());
                        log.setStatus(false);
                        log.setLogDate(currentDate);
                    }
                    logsToSave.add(log);
                    
                    currentDate = currentDate.plusDays(1);
                    totalDays --;
                }
            }else{
                // Nếu không dùng giả dược, chỉ cần tăng ngày cho ngày nghỉ
                currentDate = currentDate.plusDays(off);
                totalDays -= off;
            }
        }
        pillLogsRepository.saveAll(logsToSave);
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
      response.setPlacebo(con.getPlacebo());
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
    //Lấy ra thông tin của lịch uống thuốc
    public ApiResponse<PillReminderDetailsResponse> getPillLogs(Long controlPillsId) {
        try {
            Optional<ControlPills> controlOpt = controlPillsRepository.findById(controlPillsId);
            if (!controlOpt.isPresent()) {
                return ApiResponse.error("Không tìm thấy lịch uống thuốc");
            }
    
            ControlPills controlPills = controlOpt.get();
            List<PillLogs> logs = pillLogsRepository.findByControlPills(controlPills);
            
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
            Optional<ControlPills> controlPills = controlPillsRepository.findById(controlPillId);
            if(!controlPills.isPresent()){
                return ApiResponse.error("Lịch uống thuốc không tồn tại");
            }
            //Xóa đi mấy cái log trước vì nó 
            pillLogsRepository.deleteByControlPills(controlPills.get());
            //xau đó mưới xóa đc cái này
            controlPillsRepository.delete(controlPills.get());
            return ApiResponse.success("Xóa lịch uống thuốc thành công");
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Lỗi khi xóa lịch uống thuốc");
        }
    }



    // check user 
    protected Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }

    // Lấy lịch uống thuốc đang hoạt động của người dùng hiện tại
    public ApiResponse<PillReminderDetailsResponse> getActivePillScheduleForCurrentUser() {
        try {
            Long userId = getCurrentUserId();
            if (userId == null) {
                return ApiResponse.error("Người dùng chưa được xác thực.");
            }
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ApiResponse.error("Không tìm thấy người dùng.");
            }
            UserDtls currentUser = userOpt.get();

            // Lấy danh sách các lịch đang hoạt động (thường chỉ có một)
            Optional<List<ControlPills>> activeSchedulesOpt = controlPillsRepository.findByUserIdAndIsActive(currentUser, true);

            if (activeSchedulesOpt.isEmpty() || activeSchedulesOpt.get().isEmpty()) {
                return ApiResponse.error("Không tìm thấy lịch uống thuốc đang hoạt động cho người dùng này.");
            }
            
            // Lấy lịch đầu tiên trong danh sách (giả định chỉ có một lịch hoạt động)
            ControlPills activeSchedule = activeSchedulesOpt.get().get(0);

            return getPillLogs(activeSchedule.getPillsId());

        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Lỗi khi lấy lịch uống thuốc đang hoạt động: " + e.getMessage());
        }
    }
}
