package com.healapp.controller;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.STIServiceRequest;
import com.healapp.dto.STIServiceResponse;
import com.healapp.dto.STITestRequest;
import com.healapp.dto.STITestResponse;
import com.healapp.dto.STITestStatusUpdateRequest;
import com.healapp.dto.TestResultRequest;
import com.healapp.dto.TestResultResponse;
import com.healapp.model.TestConclusion;
import com.healapp.service.STIServiceService;
import com.healapp.service.STITestService;
import com.healapp.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/sti-services")
public class STIServiceController {
    @Autowired
    private STIServiceService stiServiceService;

    @Autowired
    private UserService userService;

    @Autowired
    private STITestService stiTestService;

    /*
     * description: Tạo mới một dịch vụ xét nghiệm STI
     * path: /sti-services
     * method: POST
     * body:
     * {
     * String name *
     * String description
     * double price *
     * components {
     * String testName *
     * String unit *
     * String referenceRange *
     * String interpretation *
     * }
     * }
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STIServiceResponse>> createSTIService(
            @Valid @RequestBody STIServiceRequest request) {
        ApiResponse<STIServiceResponse> response = stiServiceService.createSTIService(request);
        return ResponseEntity.ok(response);
    }

    /*
     * description: Lấy thông tin tất cả dịch vụ xét nghiệm STI
     * path: /sti-services/staff
     * method: GET
     */
    @GetMapping("/staff")
    @PreAuthorize("hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<STIServiceResponse>>> getAllSTIServices() {
        ApiResponse<List<STIServiceResponse>> response = stiServiceService.getAllSTIServices();
        return ResponseEntity.ok(response);
    }

    /*
     * description: Lấy thông tin dịch vụ STI còn hoạt động
     * path: /sti-services
     * method: GET
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<STIServiceResponse>>> getActiveSTIServices() {
        ApiResponse<List<STIServiceResponse>> response = stiServiceService.getActiveSTIServices();
        return ResponseEntity.ok(response);
    }

    /*
     * description: Lấy thông tin một dịch vụ xét nghiệm STI theo ID
     * path: /sti-services/{serviceId}
     * method: GET
     */
    @GetMapping("/{serviceId}")
    public ResponseEntity<ApiResponse<STIServiceResponse>> getSTIServiceById(@PathVariable Long serviceId) {
        ApiResponse<STIServiceResponse> response = stiServiceService.getSTIServiceById(serviceId);
        return ResponseEntity.ok(response);
    }

    /*
     * description: Cập nhật thông tin một dịch vụ xét nghiệm STI
     * path: /sti-services/{serviceId}
     * method: PUT
     * body:
     * {
     * String name *
     * String description
     * double price *
     * components {
     * String testName *
     * String unit *
     * String referenceRange *
     * String interpretation *
     * boolean isActive
     * }
     * }
     */
    @PutMapping("/{serviceId}")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STIServiceResponse>> updateSTIService(@PathVariable Long serviceId,
            @Valid @RequestBody STIServiceRequest request) {
        ApiResponse<STIServiceResponse> response = stiServiceService.updateSTIService(serviceId, request);
        return ResponseEntity.ok(response);
    }

    /*
     * description: Xóa một dịch vụ xét nghiệm STI theo ID
     * path: /sti-services/{serviceId}
     * method: DELETE
     */
    @DeleteMapping("/{serviceId}")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<String>> deleteSTIService(@PathVariable Long serviceId) {
        ApiResponse<String> response = stiServiceService.deleteSTIService(serviceId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/book-test")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_CONSULTANT') or hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<STITestResponse>> bookSTITest(
            @Valid @RequestBody STITestRequest request) {

        Long customerId = getCurrentUserId();
        ApiResponse<STITestResponse> response = stiTestService.bookTest(request, customerId);
        return getResponseEntity(response);
    }

    @GetMapping("/my-tests")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_CONSULTANT') or hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<STITestResponse>>> getMySTITests() {

        Long customerId = getCurrentUserId();
        ApiResponse<List<STITestResponse>> response = stiTestService.getMyTests(customerId);
        return getResponseEntity(response);
    }

    @GetMapping("/tests/{testId}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_CONSULTANT') or hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<STITestResponse>> getSTITestDetails(@PathVariable Long testId) {

        Long userId = getCurrentUserId();
        ApiResponse<STITestResponse> response = stiTestService.getTestDetails(testId, userId);
        return getResponseEntity(response);
    }

    @PutMapping("/tests/{testId}/cancel")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_CONSULTANT') or hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<STITestResponse>> cancelSTITest(@PathVariable Long testId,
            @RequestBody java.util.Map<String, String> body) {
        Long userId = getCurrentUserId();
        String reason = body != null ? body.get("reason") : null;
        ApiResponse<STITestResponse> response = stiTestService.cancelTest(testId, userId, reason);
        return getResponseEntity(response);
    }

    @GetMapping("/staff/pending-tests")
    @PreAuthorize("hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<STITestResponse>>> getPendingTests() {
        ApiResponse<List<STITestResponse>> response = stiTestService.getPendingTests();
        return getResponseEntity(response);
    }

    @PutMapping("/staff/tests/{testId}/confirm")
    @PreAuthorize("hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<STITestResponse>> confirmTest(@PathVariable Long testId) {
        Long staffId = getCurrentUserId();

        STITestStatusUpdateRequest request = new STITestStatusUpdateRequest();
        request.setStatus(com.healapp.model.STITestStatus.CONFIRMED);

        ApiResponse<STITestResponse> response = stiTestService.updateTestStatus(testId, request, staffId);
        return getResponseEntity(response);
    }

    @GetMapping("/staff/confirmed-tests")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<List<STITestResponse>>> getConfirmedTests() {
        ApiResponse<List<STITestResponse>> response = stiTestService.getConfirmedTests();
        return getResponseEntity(response);
    }

    @PutMapping("/staff/tests/{testId}/sample")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STITestResponse>> sampleTest(@PathVariable Long testId) {
        Long staffId = getCurrentUserId();

        STITestStatusUpdateRequest request = new STITestStatusUpdateRequest();
        request.setStatus(com.healapp.model.STITestStatus.SAMPLED);

        ApiResponse<STITestResponse> response = stiTestService.updateTestStatus(testId, request, staffId);
        return getResponseEntity(response);
    }

    @GetMapping("/staff/my-tests")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<List<STITestResponse>>> getStaffTests() {
        Long staffId = getCurrentUserId();
        ApiResponse<List<STITestResponse>> response = stiTestService.getStaffTests(staffId);
        return getResponseEntity(response);
    }

    @PutMapping("/staff/tests/{testId}/result")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STITestResponse>> addTestResults(
            @PathVariable Long testId,
            @Valid @RequestBody STITestStatusUpdateRequest request) {

        Long staffId = getCurrentUserId();

        // Đảm bảo status là RESULTED
        request.setStatus(com.healapp.model.STITestStatus.RESULTED);

        ApiResponse<STITestResponse> response = stiTestService.updateTestStatus(testId, request, staffId);
        return getResponseEntity(response);
    }

    @PutMapping("/staff/tests/{testId}/complete")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STITestResponse>> completeTest(
            @PathVariable Long testId) {

        Long staffId = getCurrentUserId();

        STITestStatusUpdateRequest request = new STITestStatusUpdateRequest();
        request.setStatus(com.healapp.model.STITestStatus.COMPLETED);

        ApiResponse<STITestResponse> response = stiTestService.updateTestStatus(testId, request, staffId);
        return getResponseEntity(response);
    }

    /*
     * description: Cập nhật kết quả xét nghiệm cho test đang ở trạng thái RESULTED
     * path: /sti-services/staff/tests/{testId}/update-results
     * method: PUT
     * body: List<TestResultRequest>
     * {
     * "componentId": 1,
     * "resultValue": "120",
     * "normalRange": "100-140",
     * "unit": "mg/dL"
     * }
     */
    @PutMapping("/staff/tests/{testId}/update-results")
    @PreAuthorize("hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<STITestResponse>> updateTestResults(
            @PathVariable Long testId,
            @Valid @RequestBody List<TestResultRequest> resultRequests) {

        Long staffId = getCurrentUserId();
        ApiResponse<STITestResponse> response = stiTestService.updateTestResults(testId, resultRequests, staffId);
        return getResponseEntity(response);
    }

    /*
     * description: Thử thanh toán lại cho test có payment thất bại
     * path: /sti-services/tests/{testId}/retry-payment
     * method: POST
     * body: STITestRequest (chỉ cần paymentMethod và thông tin thẻ nếu là VISA)
     */
    @PostMapping("/tests/{testId}/retry-payment")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_CONSULTANT') or hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<STITestResponse>> retryPayment(
            @PathVariable Long testId,
            @Valid @RequestBody STITestRequest request) {

        Long userId = getCurrentUserId();
        ApiResponse<STITestResponse> response = stiTestService.retryPayment(testId, request, userId);
        return getResponseEntity(response);
    }

    @GetMapping("/tests/{testId}/results")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_CONSULTANT') or hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<TestResultResponse>>> getTestResults(@PathVariable Long testId) {
        Long userId = getCurrentUserId();
        ApiResponse<List<TestResultResponse>> response = stiTestService.getTestResults(testId, userId);
        return getResponseEntity(response);
    }

    @GetMapping("/conclusion-options")
    public ResponseEntity<ApiResponse<List<ConclusionOption>>> getConclusionOptions() {
        List<ConclusionOption> options = Stream.of(TestConclusion.values())
                .map(conclusion -> new ConclusionOption(conclusion.name(), conclusion.getDisplayName()))
                .collect(Collectors.toList());

        ApiResponse<List<ConclusionOption>> response = ApiResponse.success("Conclusion options retrieved successfully",
                options);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/tests/{testId}/consultant-notes")
    @PreAuthorize("hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<STITestResponse>> updateConsultantNotes(
            @PathVariable Long testId,
            @RequestBody java.util.Map<String, String> body) {
        String consultantNotes = body.get("consultantNotes");
        Long consultantId = getCurrentUserId();
        ApiResponse<STITestResponse> response = stiTestService.updateConsultantNotes(testId, consultantNotes,
                consultantId);
        return getResponseEntity(response);
    }

    @PutMapping("/tests/{testId}/assign-consultant")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<ApiResponse<STITestResponse>> assignConsultant(
            @PathVariable Long testId,
            @RequestBody java.util.Map<String, Long> body) {
        Long consultantId = body.get("consultantId");
        ApiResponse<STITestResponse> response = stiTestService.assignConsultant(testId, consultantId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/consultant/my-tests")
    @PreAuthorize("hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<ApiResponse<List<STITestResponse>>> getConsultantTests() {
        Long consultantId = getCurrentUserId();
        ApiResponse<List<STITestResponse>> response = stiTestService.getTestsForConsultant(consultantId);
        return getResponseEntity(response);
    }

    @GetMapping("/staff/canceled-tests")
    @PreAuthorize("hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<STITestResponse>>> getCanceledTests() {
        ApiResponse<List<STITestResponse>> response = stiTestService
                .getTestsByStatus(com.healapp.model.STITestStatus.CANCELED);
        return getResponseEntity(response);
    }

    // DTO class for conclusion options
    public static class ConclusionOption {
        private String value;
        private String label;

        public ConclusionOption(String value, String label) {
            this.value = value;
            this.label = label;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserIdFromUsername(username);
    }

    private <T> ResponseEntity<ApiResponse<T>> getResponseEntity(ApiResponse<T> response) {
        // Luôn trả về 200 OK, ngay cả khi có lỗi thanh toán
        // Frontend sẽ xử lý hiển thị thông báo phù hợp dựa trên response.success
        return ResponseEntity.ok(response);
    }

}
