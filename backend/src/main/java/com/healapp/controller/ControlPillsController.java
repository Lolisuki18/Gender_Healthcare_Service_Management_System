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
import org.springframework.web.bind.annotation.RequestParam;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ControlPillsRequest;
import com.healapp.service.ControlPillsService;
import com.healapp.dto.ControlPillsResponse;
import com.healapp.dto.PillLogsRespone;
import com.healapp.dto.PillReminderDetailsResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.healapp.service.UserService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/contraceptive")
public class ControlPillsController {
     @Autowired
     private ControlPillsService controlPillsService;
     @Autowired
     private UserService userService;

     //Thêm lịch uống thuốc
     /*
      * 
      */
      @PostMapping
      @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
      public ResponseEntity<ApiResponse<ControlPillsResponse>> createControlPills(@RequestBody @Valid ControlPillsRequest request){
         ApiResponse<ControlPillsResponse> response = controlPillsService.createControlPills(request);
         return ResponseEntity.ok(response);
      }
      //Cập nhật trạng thái 
      @PutMapping("/{id}/checkIn")
      @PreAuthorize("hasRole('ROLE_CUSTOMER')or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
      public ResponseEntity<ApiResponse<PillLogsRespone>> updateCheckIn(@PathVariable("id") Long logId) {
          ApiResponse<PillLogsRespone> response = controlPillsService.updateCheckIn(logId);
          
          return ResponseEntity.ok(response);
      }
      //chỉnh sửa lịch uống thuốc 
      /*
       * 
       */
      @PutMapping("/{id}")
      @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
      public ResponseEntity<ApiResponse<ControlPillsResponse>> updateControlPills(@PathVariable Long id, @RequestBody @Valid ControlPillsRequest request) {
          ApiResponse<ControlPillsResponse>  response = controlPillsService.updateControlPills(id, request);
          
          return ResponseEntity.ok(response);
      }
      
    

      // Lấy lịch sử uống thuốc theo trạng thái
      @GetMapping("/{id}/logs-by-status")
      @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
      public ResponseEntity<ApiResponse<PillReminderDetailsResponse>> getPillLogsByStatus(
              @PathVariable("id") Long controlPillsId,
              @RequestParam("status") Boolean status) {
          ApiResponse<PillReminderDetailsResponse> response = controlPillsService.getPillLogsByStatus(controlPillsId, status);
          return ResponseEntity.ok(response);
      }
       //Xóa lịch uống thuốc
      @DeleteMapping("/{id}")
      @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
      public ResponseEntity<ApiResponse<String>> deleteControlPills(@PathVariable Long id) {
          ApiResponse<String> response = controlPillsService.deleteControlPills(id);
          return ResponseEntity.ok(response);
      }

    // lấy lịch uống thuốc đang hoạt động của người dùng hiện tại
    @GetMapping("/active")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<ControlPillsResponse>> getActiveControlPills() {
        ApiResponse<ControlPillsResponse> response = controlPillsService.getActiveControlPillsForCurrentUser();
        return ResponseEntity.ok(response);
    }

    // Lấy tất cả lịch uống thuốc của user hiện tại
    @GetMapping
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<List<ControlPillsResponse>>> getAllControlPillsForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long userId = userService.getUserIdFromUsername(username);
        ApiResponse<List<ControlPillsResponse>> response = controlPillsService.getAllControlPillsForUser(userId);
        return ResponseEntity.ok(response);
    }
}
