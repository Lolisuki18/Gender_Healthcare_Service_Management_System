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
  
    

    

    //Cập nhật ttransg thái uống thuốc
    public ApiResponse<PillLogsRespone> updateCheckIn( Long id){
    try {
        
        Optional<ControlPills> controllOpt = controlPillsRepository.findById(id);
        if (!controllOpt.isPresent()) {
            return ApiResponse.error("Lịch uống thuốc không tồn tại");
        }
        ControlPills controlPills = controllOpt.get();
        LocalDate today = LocalDate.now();

        //Tìm ra log hôm nay của cái lịch uống thuốc 
        Optional<PillLogs> logOpt = pillLogsRepository.findByControlPillsAndLogDate(controlPills, today);
        if(!logOpt.isPresent()){
            return ApiResponse.error("Không tìm thấy log uống thuốc hôm nay");
        }
        
        PillLogs log = logOpt.get();
        if(log.getStatus() != null && log.getStatus()){
            return ApiResponse.error("Bạn đã check-in hôm nay");
        }
        //Cập nhật trang thái uống thuốc
        log.setStatus(true);
        log.setCheckIn(LocalDateTime.now());
        pillLogsRepository.save(log);
        
        PillLogsRespone response = responePillLogs(log);
        return ApiResponse.success("Check-in thành công", response);
    } catch (Exception e) {
        e.printStackTrace();
        return ApiResponse.error("Lỗi khi check-in");
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
        Boolean placebo = Boolean.TRUE.equals(con.getPlacebo());//cái thuốc giả
    
        while (totalDays > 0) {
            // Tạo các ngày uống thuốc
            for (int i = 0; i < drink && totalDays > 0; i++) {
                PillLogs log = new PillLogs();
                log.setControlPills(con);
                log.setCreatedAt(LocalDateTime.now());
                log.setStatus(false); // chưa uống
                log.setLogDate(currentDate);
                pillLogsRepository.save(log);
    
                currentDate = currentDate.plusDays(1);
                totalDays--;
            }
            if(placebo){
                for(int i = 0; i < off && totalDays > 0; i++){
                    PillLogs log = new PillLogs();
                    log.setControlPills(con);
                    log.setCreatedAt(LocalDateTime.now());
                    log.setStatus(false);
                    log.setLogDate(currentDate);
                    pillLogsRepository.save(log);
                    
                    currentDate = currentDate.plusDays(1);
                    totalDays --;
                }
            }else{
                currentDate = currentDate.plusDays(off);
                totalDays -= off;
            }
            
        }
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
    public ApiResponse<List<PillLogsRespone>> getPillLogs(Long controlPillsId) {
        try {
            Optional<ControlPills> controlOpt = controlPillsRepository.findById(controlPillsId);
            if (!controlOpt.isPresent()) {
                return ApiResponse.error("Không tìm thấy lịch uống thuốc");
            }
    
            List<PillLogs> logs = pillLogsRepository.findByControlPills(controlOpt.get());
            List<PillLogsRespone> responseList = logs.stream()
                    .map(this::responePillLogs)
                    .collect(Collectors.toList());
    
            return ApiResponse.success("Lấy danh sách log uống thuốc thành công", responseList);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Đã xảy ra lỗi khi lấy danh sách log uống thuốc");
        }
    }
    
    //Xóa lịch uống thuốc 
    public ApiResponse<String> deletePill(Long controlPillId){
        try {
            Long userId = getCurrentUserId();
            Optional<ControlPills> optionalControlPills = controlPillsRepository.findById(controlPillId);

            if (optionalControlPills.isEmpty()) {
                return ApiResponse.error("Lịch uống thuốc không tồn tại.");
            }

            ControlPills controlPills = optionalControlPills.get();

            if (!controlPills.getUserId().getId().equals(userId)) {
                return ApiResponse.error("Bạn không có quyền xóa lịch uống thuốc này.");
            }
            
            pillLogsRepository.deleteByControlPills(controlPills);
            controlPillsRepository.delete(controlPills);

            return ApiResponse.success("Xóa lịch uống thuốc thành công.", null);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Đã xảy ra lỗi khi xóa lịch uống thuốc: " + e.getMessage());
        }
    }



    // check user 
    protected Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }
}
