package com.healapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.ControlPillsRequest;
import com.healapp.service.ControlPillsService;
import com.healapp.dto.ControlPillsResponse;
import com.healapp.dto.PillLogsRequest;
import com.healapp.dto.PillLogsRespone;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;


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
     public ResponseEntity<ApiResponse<PillLogsRespone>> updateCheckIn(@PathVariable Long id) {
         ApiResponse<PillLogsRespone> response = controlPillsService.updateCheckIn(id);
         
         return ResponseEntity.ok(response);
     }
     //chỉnh sửa lịch uống thuốc 
     /*
      * 
      */
     @PutMapping("/{id}")
     public ResponseEntity<ApiResponse<ControlPillsResponse>> updateControlPills(@PathVariable Long id, @RequestBody @Valid ControlPillsRequest request) {
         ApiResponse<ControlPillsResponse>  response = controlPillsService.updateControlPills(id, request);
         
         return ResponseEntity.ok(response);
     }
     
     //Lấy ra lịch uống thuốc
     @GetMapping("/{id}")
      public ResponseEntity<ApiResponse<List<PillLogsRespone>>> getLogsByControlPillsId(@PathVariable Long id) {
         ApiResponse<List<PillLogsRespone>> response = controlPillsService.getPillLogs(id);
         return ResponseEntity.ok(response);
      }


}
