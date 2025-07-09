package com.healapp.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.STITestRequest;
import com.healapp.dto.STITestResponse;
import com.healapp.dto.STITestStatusUpdateRequest;
import com.healapp.dto.TestResultResponse;
import com.healapp.model.PackageService;
import com.healapp.model.Payment;
import com.healapp.model.PaymentMethod;
import com.healapp.model.PaymentStatus;
import com.healapp.model.Role;
import com.healapp.model.STIPackage;
import com.healapp.model.STIService;
import com.healapp.model.STITest;
import com.healapp.model.STITestStatus;
import com.healapp.model.ServiceTestComponent;
import com.healapp.model.TestResult;
import com.healapp.model.UserDtls;
import com.healapp.repository.PackageServiceRepository;
import com.healapp.repository.STIPackageRepository;
import com.healapp.repository.STIServiceRepository;
import com.healapp.repository.STITestRepository;
import com.healapp.repository.ServiceTestComponentRepository;
import com.healapp.repository.TestResultRepository;
import com.healapp.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("STITestService Test")
class STITestServiceTest {

    @Mock
    private STITestRepository stiTestRepository;

    @Mock
    private STIServiceRepository stiServiceRepository;

    @Mock
    private STIPackageRepository stiPackageRepository;

    @Mock
    private ServiceTestComponentRepository testComponentRepository;

    @Mock
    private TestResultRepository testResultRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StripeService stripeService;

    @Mock
    private PaymentService paymentService;

    @Mock
    private PackageServiceRepository packageServiceRepository;

    @InjectMocks
    private STITestService stiTestService;

    private UserDtls customer;
    private UserDtls staff;
    private UserDtls admin;
    private UserDtls consultant;
    private Role customerRole;
    private Role staffRole;
    private Role adminRole;
    private Role consultantRole;
    private STIService stiService;
    private STIPackage stiPackage;
    private STITest stiTest;
    private ServiceTestComponent testComponent1;
    private ServiceTestComponent testComponent2;
    private TestResult testResult1;
    private TestResult testResult2;
    private Payment payment;
    private STITestRequest stiTestRequest;

    @BeforeEach
    void setUp() {
        // Setup Role entities
        customerRole = new Role();
        customerRole.setRoleId(1L);
        customerRole.setRoleName("CUSTOMER");
        customerRole.setDescription("Regular customer role");

        staffRole = new Role();
        staffRole.setRoleId(2L);
        staffRole.setRoleName("STAFF");
        staffRole.setDescription("Staff role");

        adminRole = new Role();
        adminRole.setRoleId(3L);
        adminRole.setRoleName("ADMIN");
        adminRole.setDescription("Administrator role");

        consultantRole = new Role();
        consultantRole.setRoleId(4L);
        consultantRole.setRoleName("CONSULTANT");
        consultantRole.setDescription("Consultant role");

        // Setup UserDtls entities
        customer = new UserDtls();
        customer.setId(1L);
        customer.setUsername("customer");
        customer.setFullName("Customer User");
        customer.setEmail("customer@example.com");
        customer.setPhone("0123456789");
        customer.setRole(customerRole);

        staff = new UserDtls();
        staff.setId(2L);
        staff.setUsername("staff");
        staff.setFullName("Staff User");
        staff.setEmail("staff@example.com");
        staff.setRole(staffRole);

        admin = new UserDtls();
        admin.setId(3L);
        admin.setUsername("admin");
        admin.setFullName("Admin User");
        admin.setEmail("admin@example.com");
        admin.setRole(adminRole);

        consultant = new UserDtls();
        consultant.setId(4L);
        consultant.setUsername("consultant");
        consultant.setFullName("Consultant User");
        consultant.setEmail("consultant@example.com");
        consultant.setRole(consultantRole);

        // Setup ServiceTestComponent
        testComponent1 = new ServiceTestComponent();
        testComponent1.setComponentId(1L);
        testComponent1.setTestName("HIV");
        testComponent1.setUnit("");
        testComponent1.setReferenceRange("Âm tính");
        testComponent1.setInterpretation("Dương tính: Có khả năng nhiễm HIV");
        testComponent1.setSampleType("Máu");

        testComponent2 = new ServiceTestComponent();
        testComponent2.setComponentId(2L);
        testComponent2.setTestName("Giang mai");
        testComponent2.setUnit("");
        testComponent2.setReferenceRange("Âm tính");
        testComponent2.setInterpretation("Dương tính: Có khả năng nhiễm giang mai");
        testComponent2.setSampleType("Máu");

        // Setup STIService
        stiService = new STIService();
        stiService.setId(1L);
        stiService.setName("Gói xét nghiệm STI cơ bản");
        stiService.setDescription("Xét nghiệm các bệnh lây truyền qua đường tình dục");
        stiService.setPrice(new BigDecimal("500000"));
        stiService.setIsActive(true);
        stiService.setTestComponents(Arrays.asList(testComponent1, testComponent2));

        testComponent1.setStiService(stiService);
        testComponent2.setStiService(stiService);

        // Setup STIPackage
        stiPackage = new STIPackage();
        stiPackage.setPackageId(1L);
        stiPackage.setPackageName("Gói xét nghiệm STI toàn diện");
        stiPackage.setDescription("Gói xét nghiệm toàn diện các bệnh STI");
        stiPackage.setPackagePrice(new BigDecimal("1200000"));
        stiPackage.setIsActive(true);

        // Setup STITest
        stiTest = new STITest();
        stiTest.setTestId(1L);
        stiTest.setCustomer(customer);
        stiTest.setStiService(stiService);
        stiTest.setAppointmentDate(LocalDateTime.now().plusDays(1));
        stiTest.setCustomerNotes("Test notes");
        stiTest.setTotalPrice(new BigDecimal("500000"));
        stiTest.setStatus(STITestStatus.PENDING);
        stiTest.setCreatedAt(LocalDateTime.now());
        stiTest.setUpdatedAt(LocalDateTime.now());

        // Setup TestResult
        testResult1 = new TestResult();
        testResult1.setResultId(1L);
        testResult1.setStiTest(stiTest);
        testResult1.setTestComponent(testComponent1);
        testResult1.setStiService(stiService);
        testResult1.setResultValue("Âm tính");
        testResult1.setNormalRange("Âm tính");
        testResult1.setUnit("");
        testResult1.setCreatedAt(LocalDateTime.now());

        testResult2 = new TestResult();
        testResult2.setResultId(2L);
        testResult2.setStiTest(stiTest);
        testResult2.setTestComponent(testComponent2);
        testResult2.setStiService(stiService);
        testResult2.setResultValue("Âm tính");
        testResult2.setNormalRange("Âm tính");
        testResult2.setUnit("");
        testResult2.setCreatedAt(LocalDateTime.now());

        // Setup Payment
        payment = new Payment();
        payment.setPaymentId(1L);
        payment.setUserId(1L);
        payment.setServiceType("STI");
        payment.setServiceId(1L);
        payment.setAmount(new BigDecimal("500000"));
        payment.setPaymentMethod(PaymentMethod.COD);
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());

        // Setup STITestRequest
        stiTestRequest = new STITestRequest();
        stiTestRequest.setServiceId(1L);
        stiTestRequest.setAppointmentDate(LocalDateTime.now().plusDays(1));
        stiTestRequest.setPaymentMethod("COD");
        stiTestRequest.setCustomerNotes("Test booking");
    }

    // Test bookTest method
    @Test
    @DisplayName("Đặt lịch xét nghiệm STI với service - Thành công")
    void bookTest_ServiceBooking_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(stiServiceRepository.findById(1L)).thenReturn(Optional.of(stiService));
        when(stiTestRepository.save(any(STITest.class))).thenReturn(stiTest);
        when(testResultRepository.save(any(TestResult.class))).thenReturn(testResult1);
        when(paymentService.processCODPayment(anyLong(), anyString(), anyLong(), any(BigDecimal.class), anyString()))
                .thenReturn(ApiResponse.success("Payment processed", payment));
        when(paymentService.getPaymentByService("STI", 1L)).thenReturn(Optional.of(payment));

        ApiResponse<STITestResponse> response = stiTestService.bookTest(stiTestRequest, 1L);

        assertTrue(response.isSuccess());
        assertTrue(response.getMessage().contains("STI test scheduled successfully"));
        assertNotNull(response.getData());
        assertEquals(1L, response.getData().getTestId());
        assertEquals("Gói xét nghiệm STI cơ bản", response.getData().getServiceName());

        verify(userRepository).findById(1L);
        verify(stiServiceRepository).findById(1L);
        verify(stiTestRepository).save(any(STITest.class));
        verify(paymentService).processCODPayment(anyLong(), anyString(), anyLong(), any(BigDecimal.class), anyString());
    }

    @Test
    @DisplayName("Đặt lịch xét nghiệm STI với package - Thành công")
    void bookTest_PackageBooking_Success() {
        stiTestRequest.setServiceId(null);
        stiTestRequest.setPackageId(1L);

        STITest packageTest = new STITest();
        packageTest.setTestId(2L);
        packageTest.setCustomer(customer);
        packageTest.setStiPackage(stiPackage);
        packageTest.setAppointmentDate(LocalDateTime.now().plusDays(1));
        packageTest.setTotalPrice(new BigDecimal("1200000"));
        packageTest.setStatus(STITestStatus.PENDING);

        // Mock packageServiceRepository để trả về danh sách dịch vụ cho package
        PackageService packageService = new PackageService();
        packageService.setId(1L);
        packageService.setStiPackage(stiPackage);
        packageService.setStiService(stiService);
        packageService.setCreatedAt(LocalDateTime.now());
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(stiPackageRepository.findByIdWithServicesAndComponents(1L)).thenReturn(Optional.of(stiPackage));
        when(stiTestRepository.save(any(STITest.class))).thenReturn(packageTest);
        when(testResultRepository.save(any(TestResult.class))).thenReturn(testResult1);
        when(paymentService.processCODPayment(anyLong(), anyString(), anyLong(), any(BigDecimal.class), anyString()))
                .thenReturn(ApiResponse.success("Payment processed", payment));
        when(paymentService.getPaymentByService("STI", 2L)).thenReturn(Optional.of(payment));
        when(packageServiceRepository.findByStiPackage_PackageId(1L)).thenReturn(Arrays.asList(packageService));

        ApiResponse<STITestResponse> response = stiTestService.bookTest(stiTestRequest, 1L);

        assertTrue(response.isSuccess());
        assertTrue(response.getMessage().contains("STI package test scheduled successfully"));
        assertNotNull(response.getData());

        verify(stiPackageRepository).findByIdWithServicesAndComponents(1L);
        verify(packageServiceRepository, times(2)).findByStiPackage_PackageId(1L);
    }

    @Test
    @DisplayName("Đặt lịch xét nghiệm STI - Request không hợp lệ")
    void bookTest_InvalidRequest() {
        stiTestRequest.setServiceId(1L);
        stiTestRequest.setPackageId(1L); // Both serviceId and packageId set

        ApiResponse<STITestResponse> response = stiTestService.bookTest(stiTestRequest, 1L);

        assertFalse(response.isSuccess());
        assertEquals("Must specify either serviceId or packageId, not both", response.getMessage());

        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Đặt lịch xét nghiệm STI - Customer không tồn tại")
    void bookTest_CustomerNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<STITestResponse> response = stiTestService.bookTest(stiTestRequest, 999L);

        assertFalse(response.isSuccess());
        assertEquals("Customer not found", response.getMessage());

        verify(userRepository).findById(999L);
        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Đặt lịch xét nghiệm STI - Service không tồn tại")
    void bookTest_ServiceNotFound() {
        stiTestRequest.setServiceId(999L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(stiServiceRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<STITestResponse> response = stiTestService.bookTest(stiTestRequest, 1L);

        assertFalse(response.isSuccess());
        assertEquals("STI service not found", response.getMessage());

        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Đặt lịch xét nghiệm STI - Service không hoạt động")
    void bookTest_ServiceNotActive() {
        stiService.setIsActive(false);

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(stiServiceRepository.findById(1L)).thenReturn(Optional.of(stiService));

        ApiResponse<STITestResponse> response = stiTestService.bookTest(stiTestRequest, 1L);

        assertFalse(response.isSuccess());
        assertEquals("STI service is not available", response.getMessage());

        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Đặt lịch xét nghiệm STI - Thời gian hẹn không hợp lệ")
    void bookTest_InvalidAppointmentDate() {
        stiTestRequest.setAppointmentDate(LocalDateTime.now().plusHours(1)); // Less than 2 hours

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));

        ApiResponse<STITestResponse> response = stiTestService.bookTest(stiTestRequest, 1L);

        assertFalse(response.isSuccess());
        assertEquals("Appointment must be at least 2 hours from now", response.getMessage());

        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Đặt lịch xét nghiệm STI - Phương thức thanh toán không hợp lệ")
    void bookTest_InvalidPaymentMethod() {
        stiTestRequest.setPaymentMethod("INVALID");

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));

        ApiResponse<STITestResponse> response = stiTestService.bookTest(stiTestRequest, 1L);

        assertFalse(response.isSuccess());
        assertEquals("Invalid payment method: INVALID", response.getMessage());

        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    // Test getPendingTests method
    @Test
    @DisplayName("Lấy danh sách test đang chờ - Thành công")
    void getPendingTests_Success() {
        List<STITest> pendingTests = Arrays.asList(stiTest);

        when(stiTestRepository.findByStatus(STITestStatus.PENDING)).thenReturn(pendingTests);
        when(paymentService.getPaymentByService("STI", 1L)).thenReturn(Optional.of(payment));

        ApiResponse<List<STITestResponse>> response = stiTestService.getPendingTests();

        assertTrue(response.isSuccess());
        assertEquals("Retrieved 1 pending STI tests", response.getMessage());
        assertEquals(1, response.getData().size());
        assertEquals(1L, response.getData().get(0).getTestId());

        verify(stiTestRepository).findByStatus(STITestStatus.PENDING);
    }

    // Test getConfirmedTests method
    @Test
    @DisplayName("Lấy danh sách test đã xác nhận - Thành công")
    void getConfirmedTests_Success() {
        stiTest.setStatus(STITestStatus.CONFIRMED);
        List<STITest> confirmedTests = Arrays.asList(stiTest);

        when(stiTestRepository.findByStatus(STITestStatus.CONFIRMED)).thenReturn(confirmedTests);
        when(paymentService.getPaymentByService("STI", 1L)).thenReturn(Optional.of(payment));

        ApiResponse<List<STITestResponse>> response = stiTestService.getConfirmedTests();

        assertTrue(response.isSuccess());
        assertEquals("Retrieved 1 confirmed STI tests", response.getMessage());
        assertEquals(1, response.getData().size());

        verify(stiTestRepository).findByStatus(STITestStatus.CONFIRMED);
    }

    // Test getStaffTests method
    @Test
    @DisplayName("Lấy danh sách test của staff - Thành công")
    void getStaffTests_Success() {
        List<STITest> staffTests = Arrays.asList(stiTest);

        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        when(stiTestRepository.findByStaffId(2L)).thenReturn(staffTests);
        when(paymentService.getPaymentByService("STI", 1L)).thenReturn(Optional.of(payment));

        ApiResponse<List<STITestResponse>> response = stiTestService.getStaffTests(2L);

        assertTrue(response.isSuccess());
        assertEquals("Retrieved 1 tests for staff", response.getMessage());
        assertEquals(1, response.getData().size());

        verify(stiTestRepository).findByStaffId(2L);
    }

    @Test
    @DisplayName("Lấy danh sách test của staff - Staff không tồn tại")
    void getStaffTests_StaffNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<List<STITestResponse>> response = stiTestService.getStaffTests(999L);

        assertFalse(response.isSuccess());
        assertEquals("Staff not found", response.getMessage());

        verify(userRepository).findById(999L);
        verifyNoInteractions(stiTestRepository);
    }

    @Test
    @DisplayName("Lấy danh sách test của staff - User không phải staff")
    void getStaffTests_UserNotStaff() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));

        ApiResponse<List<STITestResponse>> response = stiTestService.getStaffTests(1L);

        assertFalse(response.isSuccess());
        assertEquals("User is not a staff", response.getMessage());

        verify(userRepository).findById(1L);
        verifyNoInteractions(stiTestRepository);
    }

    // Test updateTestStatus method
    @Test
    @DisplayName("Cập nhật trạng thái test - Confirm thành công")
    void updateTestStatus_Confirm_Success() {
        STITestStatusUpdateRequest request = new STITestStatusUpdateRequest();
        request.setStatus(STITestStatus.CONFIRMED);

        payment.setPaymentStatus(PaymentStatus.COMPLETED);

        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        when(paymentService.getPaymentByService("STI", 1L)).thenReturn(Optional.of(payment));
        when(stiTestRepository.save(any(STITest.class))).thenReturn(stiTest);

        ApiResponse<STITestResponse> response = stiTestService.updateTestStatus(1L, request, 2L);

        assertTrue(response.isSuccess());
        assertEquals("STI test status updated to CONFIRMED", response.getMessage());

        ArgumentCaptor<STITest> testCaptor = ArgumentCaptor.forClass(STITest.class);
        verify(stiTestRepository).save(testCaptor.capture());
        assertEquals(STITestStatus.CONFIRMED, testCaptor.getValue().getStatus());
        assertEquals(staff, testCaptor.getValue().getStaff());
    }

    @Test
    @DisplayName("Cập nhật trạng thái test - Test không tồn tại")
    void updateTestStatus_TestNotFound() {
        STITestStatusUpdateRequest request = new STITestStatusUpdateRequest();
        request.setStatus(STITestStatus.CONFIRMED);

        when(stiTestRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<STITestResponse> response = stiTestService.updateTestStatus(999L, request, 2L);

        assertFalse(response.isSuccess());
        assertEquals("STI test not found", response.getMessage());

        verify(stiTestRepository).findById(999L);
        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Cập nhật trạng thái test - User không tồn tại")
    void updateTestStatus_UserNotFound() {
        STITestStatusUpdateRequest request = new STITestStatusUpdateRequest();
        request.setStatus(STITestStatus.CONFIRMED);

        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<STITestResponse> response = stiTestService.updateTestStatus(1L, request, 999L);

        assertFalse(response.isSuccess());
        assertEquals("User not found", response.getMessage());

        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    // Test getMyTests method
    @Test
    @DisplayName("Lấy danh sách test của customer - Thành công")
    void getMyTests_Success() {
        List<STITest> customerTests = Arrays.asList(stiTest);

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(stiTestRepository.findByCustomerIdOrderByCreatedAtDesc(1L)).thenReturn(customerTests);
        when(paymentService.getPaymentByService("STI", 1L)).thenReturn(Optional.of(payment));

        ApiResponse<List<STITestResponse>> response = stiTestService.getMyTests(1L);

        assertTrue(response.isSuccess());
        assertEquals("STI tests retrieved successfully", response.getMessage());
        assertEquals(1, response.getData().size());
        assertEquals(1L, response.getData().get(0).getTestId());

        verify(stiTestRepository).findByCustomerIdOrderByCreatedAtDesc(1L);
    }

    @Test
    @DisplayName("Lấy danh sách test của customer - Customer không tồn tại")
    void getMyTests_CustomerNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<List<STITestResponse>> response = stiTestService.getMyTests(999L);

        assertFalse(response.isSuccess());
        assertEquals("Customer not found", response.getMessage());

        verify(userRepository).findById(999L);
        verifyNoInteractions(stiTestRepository);
    }

    // Test getTestDetails method
    @Test
    @DisplayName("Lấy chi tiết test - Thành công")
    void getTestDetails_Success() {
        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));
        when(paymentService.getPaymentByService("STI", 1L)).thenReturn(Optional.of(payment));

        ApiResponse<STITestResponse> response = stiTestService.getTestDetails(1L, 1L);

        assertTrue(response.isSuccess());
        assertEquals("STI test details retrieved successfully", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(1L, response.getData().getTestId());
        assertEquals("Customer User", response.getData().getCustomerName());

        verify(stiTestRepository).findById(1L);
    }

    @Test
    @DisplayName("Lấy chi tiết test - Test không tồn tại")
    void getTestDetails_TestNotFound() {
        when(stiTestRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<STITestResponse> response = stiTestService.getTestDetails(999L, 1L);

        assertFalse(response.isSuccess());
        assertEquals("STI test not found", response.getMessage());

        verify(stiTestRepository).findById(999L);
    }

    @Test
    @DisplayName("Lấy chi tiết test - Không có quyền xem")
    void getTestDetails_NoPermission() {
        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));

        ApiResponse<STITestResponse> response = stiTestService.getTestDetails(1L, 999L);

        assertFalse(response.isSuccess());
        assertEquals("You can only view your own tests", response.getMessage());

        verify(stiTestRepository).findById(1L);
    }

    // Test getTestResults method @Test
    @DisplayName("Lấy kết quả test - Thành công")
    void getTestResults_Success() {
        stiTest.setStatus(STITestStatus.RESULTED);
        List<TestResult> results = Arrays.asList(testResult1, testResult2);

        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));
        when(testResultRepository.findByStiTest_TestId(1L)).thenReturn(results);

        ApiResponse<List<TestResultResponse>> response = stiTestService.getTestResults(1L, 1L);

        assertTrue(response.isSuccess());
        assertEquals("Retrieved 2 test results", response.getMessage());
        assertEquals(2, response.getData().size());
        assertEquals("HIV", response.getData().get(0).getComponentName());

        verify(testResultRepository).findByStiTest_TestId(1L);
    }

    @Test
    @DisplayName("Lấy kết quả test - Staff có quyền xem")
    void getTestResults_StaffAccess_Success() {
        stiTest.setStatus(STITestStatus.RESULTED);
        List<TestResult> results = Arrays.asList(testResult1, testResult2);

        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        when(testResultRepository.findByStiTest_TestId(1L)).thenReturn(results);

        ApiResponse<List<TestResultResponse>> response = stiTestService.getTestResults(1L, 2L); // Staff ID = 2L

        assertTrue(response.isSuccess());
        assertEquals("Retrieved 2 test results", response.getMessage());
    }

    @Test
    @DisplayName("Lấy kết quả test - Test chưa có kết quả")
    void getTestResults_ResultsNotAvailable() {
        // Test still in PENDING status
        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));

        ApiResponse<List<TestResultResponse>> response = stiTestService.getTestResults(1L, 1L);

        assertFalse(response.isSuccess());
        assertEquals("Test results are not available yet", response.getMessage());

        verify(stiTestRepository).findById(1L);
        verifyNoInteractions(testResultRepository);
    }

    // Test cancelTest method
    @Test
    @DisplayName("Hủy test - Thành công")
    void cancelTest_Success() {
        stiTest.setAppointmentDate(LocalDateTime.now().plusDays(2)); // More than 24 hours

        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));
        when(paymentService.getPaymentByService("STI", 1L)).thenReturn(Optional.of(payment));
        when(stiTestRepository.save(any(STITest.class))).thenReturn(stiTest);

        ApiResponse<STITestResponse> response = stiTestService.cancelTest(1L, 1L);

        assertTrue(response.isSuccess());
        assertTrue(response.getMessage().contains("STI test canceled successfully"));

        ArgumentCaptor<STITest> testCaptor = ArgumentCaptor.forClass(STITest.class);
        verify(stiTestRepository).save(testCaptor.capture());
        assertEquals(STITestStatus.CANCELED, testCaptor.getValue().getStatus());
    }

    @Test
    @DisplayName("Hủy test - Test không tồn tại")
    void cancelTest_TestNotFound() {
        when(stiTestRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<STITestResponse> response = stiTestService.cancelTest(999L, 1L);

        assertFalse(response.isSuccess());
        assertEquals("STI test not found", response.getMessage());

        verify(stiTestRepository).findById(999L);
        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Hủy test - Không có quyền hủy")
    void cancelTest_NoPermission() {
        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));

        ApiResponse<STITestResponse> response = stiTestService.cancelTest(1L, 999L);

        assertFalse(response.isSuccess());
        assertEquals("You can only cancel your own tests", response.getMessage());

        verify(stiTestRepository).findById(1L);
        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Hủy test - Trạng thái không cho phép hủy")
    void cancelTest_InvalidStatus() {
        stiTest.setStatus(STITestStatus.SAMPLED);

        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));

        ApiResponse<STITestResponse> response = stiTestService.cancelTest(1L, 1L);

        assertFalse(response.isSuccess());
        assertEquals("Cannot cancel test in current status: SAMPLED", response.getMessage());

        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Hủy test - Quá gần thời gian hẹn")
    void cancelTest_TooCloseToAppointment() {
        stiTest.setAppointmentDate(LocalDateTime.now().plusHours(12)); // Less than 24 hours

        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));

        ApiResponse<STITestResponse> response = stiTestService.cancelTest(1L, 1L);

        assertFalse(response.isSuccess());
        assertEquals("Cannot cancel test within 24 hours of appointment", response.getMessage());

        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    // Test updateConsultantNotes method
    @Test
    @DisplayName("Cập nhật ghi chú consultant - Thành công")
    void updateConsultantNotes_Success() {
        stiTest.setStatus(STITestStatus.SAMPLED);
        String notes = "Test notes from consultant";

        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));
        when(userRepository.findById(4L)).thenReturn(Optional.of(consultant));
        when(stiTestRepository.save(any(STITest.class))).thenReturn(stiTest);

        ApiResponse<STITestResponse> response = stiTestService.updateConsultantNotes(1L, notes, 4L);

        assertTrue(response.isSuccess());
        assertEquals("Consultant notes updated successfully", response.getMessage());

        ArgumentCaptor<STITest> testCaptor = ArgumentCaptor.forClass(STITest.class);
        verify(stiTestRepository).save(testCaptor.capture());
        assertEquals(notes, testCaptor.getValue().getConsultantNotes());
        assertEquals(consultant, testCaptor.getValue().getConsultant());
    }

    @Test
    @DisplayName("Cập nhật ghi chú consultant - Test không tồn tại")
    void updateConsultantNotes_TestNotFound() {
        when(stiTestRepository.findById(999L)).thenReturn(Optional.empty());

        ApiResponse<STITestResponse> response = stiTestService.updateConsultantNotes(999L, "notes", 4L);

        assertFalse(response.isSuccess());
        assertEquals("STI test not found", response.getMessage());

        verify(stiTestRepository).findById(999L);
        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Cập nhật ghi chú consultant - User không phải consultant")
    void updateConsultantNotes_UserNotConsultant() {
        stiTest.setStatus(STITestStatus.SAMPLED);

        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));

        ApiResponse<STITestResponse> response = stiTestService.updateConsultantNotes(1L, "notes", 1L);

        assertFalse(response.isSuccess());
        assertEquals("User is not a consultant", response.getMessage());

        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    @Test
    @DisplayName("Cập nhật ghi chú consultant - Trạng thái không hợp lệ")
    void updateConsultantNotes_InvalidStatus() {
        // Test in PENDING status
        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(stiTest));
        when(userRepository.findById(4L)).thenReturn(Optional.of(consultant));

        ApiResponse<STITestResponse> response = stiTestService.updateConsultantNotes(1L, "notes", 4L);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage()
                .contains("Consultant notes can only be updated for tests in SAMPLED, RESULTED, or COMPLETED status"));

        verify(stiTestRepository, never()).save(any(STITest.class));
    }

    // Test getTestsPendingConsultantNotes method
    @Test
    @DisplayName("Lấy danh sách test cần ghi chú consultant - Thành công")
    void getTestsPendingConsultantNotes_Success() {
        List<STITest> pendingTests = Arrays.asList(stiTest);

        when(stiTestRepository.findTestsPendingConsultantNotes()).thenReturn(pendingTests);
        when(paymentService.getPaymentByService("STI", 1L)).thenReturn(Optional.of(payment));

        ApiResponse<List<STITestResponse>> response = stiTestService.getTestsPendingConsultantNotes();

        assertTrue(response.isSuccess());
        assertEquals("Retrieved 1 tests pending consultant notes", response.getMessage());
        assertEquals(1, response.getData().size());

        verify(stiTestRepository).findTestsPendingConsultantNotes();
    }

    // Test getAllConsultantTests method
    @Test
    @DisplayName("Lấy tất cả test có thể truy cập bởi consultant - Thành công")
    void getAllConsultantTests_Success() {
        List<STITest> consultantTests = Arrays.asList(stiTest);

        when(stiTestRepository.findAllConsultantAccessibleTests()).thenReturn(consultantTests);
        when(paymentService.getPaymentByService("STI", 1L)).thenReturn(Optional.of(payment));

        ApiResponse<List<STITestResponse>> response = stiTestService.getAllConsultantTests();

        assertTrue(response.isSuccess());
        assertEquals("Retrieved 1 consultant accessible tests", response.getMessage());
        assertEquals(1, response.getData().size());

        verify(stiTestRepository).findAllConsultantAccessibleTests();
    }
}