package com.healapp.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ControlPillsRequest;
import com.healapp.dto.ControlPillsResponse;
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

    //Thêm lịch uống thuốc
    public ApiResponse<ControlPillsResponse> createControlPills(ControlPillsRequest request){
       try {
          Long userId = getCurrentUserId();
          Optional<UserDtls> user = userRepository.findById(userId);
          if(!user.isPresent()){
            return ApiResponse.error("Không tìm thấy người dùng");
          }
          //Tạo 1 cái lịch 
          ControlPills con = new ControlPills();
          con.setUserId(user.get());
          con.setNumberDaysDrinking(request.getNumberDaysDrinking());
          con.setNumberDaysOff(request.getNumberDaysOff());
          con.setRemindTime(request.getRemindTime());
          con.setIsActive(request.getIsActive());
          con.setStartDate(request.getStartDate());
          //Lưu lại
          controlPillsRepository.save(con);
          //Tạo ra cái lịch uống thuốc cho 1 năm
          List<PillLogs> log = new ArrayList<>();
          LocalDate current = request.getStartDate(); //ngày bắt đầu chu kì thuốc
          int days = 0;
          int cycleLength = request.getNumberDaysDrinking() + request.getNumberDaysOff();

          while (days < 365) {
            //uống thuốc (active days)
            for(int i = 0; i < request.getNumberDaysDrinking() && days < 365; i++){
                PillLogs logs = new PillLogs();
                logs.setCheckIn(current.atTime(request.getRemindTime()));
                logs.setCreatedAt(LocalDateTime.now());
                logs.setStatus(false);//ban đầu là chưa uống
                logs.setControlPills(con);
                log.add(logs);
                
                current = current.plusDays(1);
                days ++;
            }
            //Cái ngày nghỉ uống thuốc
            current = current.plusDays(request.getNumberDaysOff());
            days += request.getNumberDaysOff();
          }
          pillLogsRepository.saveAll(log);
        
        return ApiResponse.success("Thêm lịch uống thuốc thành công", convertResponse(con));
       } catch (Exception e) {
          e.printStackTrace();
          return ApiResponse.error("Đã xảy ra lỗi khi thêm lịch");
       }
    }
    private ControlPillsResponse convertResponse(ControlPills con){
        ControlPillsResponse response = new ControlPillsResponse();
          response.setPillsId(con.getPillsId());
          response.setNumberDaysDrinking(con.getNumberDaysDrinking());
          response.setNumberDaysOff(con.getNumberDaysOff());
          response.setRemindTime(con.getRemindTime());
          response.setIsActive(con.getIsActive());
          response.setStartDate(con.getStartDate());
          response.setUpdatedAt(con.getUpdatedAt());
          return response;

    }


    protected Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }
}
