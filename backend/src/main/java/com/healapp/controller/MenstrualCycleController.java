package com.healapp.controller;


import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.MenstrualCycleRequest;
import com.healapp.dto.MenstrualCycleResponse;
import com.healapp.dto.PregnancyProbabilityResponse;
import com.healapp.model.MenstrualCycle;
import com.healapp.service.MenstrualCycleService;
import com.healapp.service.NotificationService;
import com.healapp.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/menstrual-cycle")
public class MenstrualCycleController {

    @Autowired
    private MenstrualCycleService menstrualCycleService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    /**
     * description: Khai báo chu kỳ kinh nguyệt
     * method: POST
     * path: /menstrual-cycle
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<MenstrualCycleResponse>> createMenstrualCycle(@RequestBody @Valid MenstrualCycleRequest request) {
        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.createMenstrualCycle(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * description: Lấy tất cả chu kỳ kinh nguyệt của người dùng
     * method: GET
     * path: /menstrual-cycle
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<List<MenstrualCycle>>> getAllMenstrualCycle(){
        Long userId = getCurrentUserId();
        ApiResponse<List<MenstrualCycle>> response = menstrualCycleService.getAllMenstrualCycle(userId);
        return ResponseEntity.ok(response);
    }

    /*
     * description: Lấy tất cả chu kỳ kinh nguyệt của người dùng cùng với tỉ lệ mang thai
     * method: GET
     * path: /menstrual-cycle/pregnancy-prob
     */
    @GetMapping("/pregnancy-prob")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<List<MenstrualCycleResponse>>> getAllMenstrualCycleWithPregnancyProb() {
        Long userId = getCurrentUserId();
        ApiResponse<List<MenstrualCycleResponse>> response = menstrualCycleService.getMenstrualCycleWithPregnancyProb(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * description: Lấy thông tin chu kỳ kinh nguyệt theo id
     * method: GET
     * path: /menstrual-cycle/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<MenstrualCycleResponse>> getMenstrualCycleById(@PathVariable Long id) {
        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.getMenstrualCycleById(id);
        return ResponseEntity.ok(response);
    }


    /**
     * description: Cập nhật chu kỳ kinh nguyệt
     * method: PUT
     * path: /menstrual-cycle/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<MenstrualCycleResponse>> updateMenstrualCycle(@PathVariable Long id, @Valid @RequestBody MenstrualCycleRequest request) {
        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.updateMenstrualCycle(id, request);
        return ResponseEntity.ok(response);
    }


    /**
     * description: Xóa chu kỳ kinh nguyệt
     * method: DELETE
     * path: /menstrual-cycle/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<Void>> deleteMenstrualCycle(@PathVariable Long id) {
        ApiResponse<Void> response = menstrualCycleService.deleteMenstrualCycle(id);
        return ResponseEntity.ok(response);
    }


    /*
     * description: thông báo ngày rụng trứng và tỉ lệ mang thai
     * method: POST
     * path: /menstrual-cycle/reminder
     */
    // @PostMapping("/reminder")
    // @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    // public ResponseEntity<ApiResponse<String>> sendOvulationReminder() {
    //     ApiResponse<String> response = notificationService.sendOvulationNotification();        
    //     return ResponseEntity.ok(response);

    //     // menstrualCycleService.sendReminderPregnancy();
    //     // return ResponseEntity.ok(new ApiResponse<>(true, "Gửi thông báo thành công"));
    // }


    /*
     * description: lấy chu kỳ trung bình của người dùng
     * method: GET
     * path: /menstrual-cycle/average
     */
    @GetMapping("/average")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<Double>> getAverageMenstrualCycle() {
        Long userId = getCurrentUserId();
        ApiResponse<Double> response = menstrualCycleService.calculateAverageCycleLength(userId);
        return ResponseEntity.ok(response);
    }

    /*
     * description: Lấy tỉ lệ mang thai cho một chu kỳ cụ thể
     * method: GET
     * path: /menstrual-cycle/{id}/pregnancy-prob
     */
    @GetMapping("/{id}/pregnancy-prob")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<List<PregnancyProbabilityResponse>>> getPregnancyProbabilityByCycle(@PathVariable Long id) {
        ApiResponse<List<PregnancyProbabilityResponse>> response = menstrualCycleService.getPregnancyProbabilityByCycle(id);
        return ResponseEntity.ok(response);
    }

    /*
     * description: Lấy tỉ lệ mang thai cho một ngày cụ thể trong chu kỳ
     * method: GET
     * path: /menstrual-cycle/{id}/pregnancy-prob/{date}
     */
    @GetMapping("/{id}/pregnancy-prob/{date}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<PregnancyProbabilityResponse>> getPregnancyProbabilityByDate(
            @PathVariable Long id, 
            @PathVariable String date) {
        ApiResponse<PregnancyProbabilityResponse> response = menstrualCycleService.getPregnancyProbabilityByDate(id, date);
        return ResponseEntity.ok(response);
    }

    /*
     * description: dự đoán chu kỳ kinh nguyệt tiếp theo
     * method: GET
     * path: /menstrual-cycle/predict
     */
    // @GetMapping("/predict")
    // @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_CONSULTANT')")
    // public ResponseEntity<ApiResponse<LocalDate>> predictNextCycle() {
    //     try {
    //         Long userId = getCurrentUserId();

    //         ApiResponse<LocalDate> response = menstrualCycleService.predictNextCycle(userId);
    //         return ResponseEntity.ok(response);
    //     } catch (Exception e) {
    //         return ResponseEntity.ok(ApiResponse.error("Lỗi server: " + e.getMessage()));
    //     }
    // }


    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }
    
}
