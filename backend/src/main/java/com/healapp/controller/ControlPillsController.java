package com.healapp.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ControlPillsRequest;
import com.healapp.service.ControlPillsService;
import com.healapp.dto.ControlPillsResponse;
import com.healapp.dto.PillLogsRespone;
import com.healapp.dto.PillReminderDetailsResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/contraceptive")
public class ControlPillsController {
     @Autowired
     private ControlPillsService controlPillsService;

     //Thêm lịch uống thuốc
     /*
      * 
      */
      @PostMapping
      @PreAuthorize("hasRole('ROLE_CUSTOMER')")
      public ResponseEntity<ApiResponse<ControlPillsResponse>> createControlPills(@RequestBody @Valid ControlPillsRequest request){
         ApiResponse<ControlPillsResponse> response = controlPillsService.createControlPills(request);
         return ResponseEntity.ok(response);
      }
      //Cập nhật trạng thái 
      @PutMapping("/{id}/checkIn")
      @PreAuthorize("hasRole('ROLE_CUSTOMER')")
      public ResponseEntity<ApiResponse<PillLogsRespone>> updateCheckIn(@PathVariable("id") Long logId) {
          ApiResponse<PillLogsRespone> response = controlPillsService.updateCheckIn(logId);
          
          return ResponseEntity.ok(response);
      }
      //chỉnh sửa lịch uống thuốc 
      /*
       * 
       */
      @PutMapping("/{id}")
      @PreAuthorize("hasRole('ROLE_CUSTOMER')")
      public ResponseEntity<ApiResponse<ControlPillsResponse>> updateControlPills(@PathVariable Long id, @RequestBody @Valid ControlPillsRequest request) {
          ApiResponse<ControlPillsResponse>  response = controlPillsService.updateControlPills(id, request);
          
          return ResponseEntity.ok(response);
      }
      
      //Lấy ra lịch uống thuốc
      @GetMapping("/{id}")
      @PreAuthorize("hasRole('ROLE_CUSTOMER')")
       public ResponseEntity<ApiResponse<PillReminderDetailsResponse>> getLogsByControlPillsId(@PathVariable Long id) {
          ApiResponse<PillReminderDetailsResponse> response = controlPillsService.getPillLogs(id);
          return ResponseEntity.ok(response);
       }
       //Xóa lịch uống thuốc
      @DeleteMapping("/{id}")
      @PreAuthorize("hasRole('ROLE_CUSTOMER')")
      public ResponseEntity<ApiResponse<String>> deleteControlPills(@PathVariable Long id) {
          ApiResponse<String> response = controlPillsService.deleteControlPills(id);
          return ResponseEntity.ok(response);
      }

    // Endpoint mới để lấy lịch uống thuốc đang hoạt động của người dùng hiện tại
    @GetMapping("/active")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<ApiResponse<PillReminderDetailsResponse>> getActivePillSchedule() {
        ApiResponse<PillReminderDetailsResponse> response = controlPillsService.getActivePillScheduleForCurrentUser();
        return ResponseEntity.ok(response);
    }
}
