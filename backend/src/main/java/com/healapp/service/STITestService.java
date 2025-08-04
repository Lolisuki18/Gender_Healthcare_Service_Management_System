package com.healapp.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.PaymentInfoResponse;
import com.healapp.dto.STITestRequest;
import com.healapp.dto.STITestResponse;
import com.healapp.dto.STITestStatusUpdateRequest;
import com.healapp.dto.TestResultRequest;
import com.healapp.dto.TestResultResponse;
import com.healapp.model.PackageService;
import com.healapp.model.Payment;
import com.healapp.model.PaymentMethod;
import com.healapp.model.PaymentStatus;
import com.healapp.model.STIPackage;
import com.healapp.model.STIService;
import com.healapp.model.STITest;
import com.healapp.model.STITestStatus;
import com.healapp.model.ServiceTestComponent;
import com.healapp.model.TestResult;
import com.healapp.model.TestServiceConsultantNote;
import com.healapp.model.UserDtls;
import com.healapp.repository.PackageServiceRepository;
import com.healapp.repository.PaymentRepository;
import com.healapp.repository.STIPackageRepository;
import com.healapp.repository.STIServiceRepository;
import com.healapp.repository.STITestRepository;
import com.healapp.repository.ServiceTestComponentRepository;
import com.healapp.repository.TestResultRepository;
import com.healapp.repository.TestServiceConsultantNoteRepository;
import com.healapp.repository.UserRepository;
import com.healapp.utils.TimezoneUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class STITestService {

    @Autowired
    private STITestRepository stiTestRepository;

    @Autowired
    private STIServiceRepository stiServiceRepository;

    @Autowired
    private STIPackageRepository stiPackageRepository;

    @Autowired
    private ServiceTestComponentRepository testComponentRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PackageServiceRepository packageServiceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentInfoService paymentInfoService;

    @Autowired
    private TestServiceConsultantNoteRepository testServiceConsultantNoteRepository;

    @Transactional
    public ApiResponse<STITestResponse> bookTest(STITestRequest request, Long customerId) {
        log.info("User {} booking STI test", customerId);

        try {
            log.info("Step 1: Validating request");
            // Validate request
            if (!request.isValid()) {
                log.warn("Invalid request for user {}: serviceId={}, packageId={}",
                        customerId, request.getServiceId(), request.getPackageId());
                return ApiResponse.error("Must specify either serviceId or packageId, not both");
            }
            log.info("Step 1: Request validation passed");

            log.info("Step 2: Finding customer");
            Optional<UserDtls> customerOpt = userRepository.findById(customerId);
            if (customerOpt.isEmpty()) {
                log.warn("Customer not found: {}", customerId);
                return ApiResponse.error("Customer not found");
            }
            UserDtls customer = customerOpt.get();
            log.info("Step 2: Customer found: {}", customer.getFullName());

            log.info("Step 3: Validating appointment date");
            if (request.getAppointmentDate().isBefore(LocalDateTime.now().plusHours(2))) {
                log.warn("Appointment date too soon: {}", request.getAppointmentDate());
                return ApiResponse.error("Appointment must be at least 2 hours from now");
            }
            log.info("Step 3: Appointment date validation passed");

            log.info("Step 4: Validating payment method");
            PaymentMethod paymentMethod;
            try {
                paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
                log.info("Step 4: Payment method validated: {}", paymentMethod);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid payment method: {}", request.getPaymentMethod());
                return ApiResponse.error("Invalid payment method: " + request.getPaymentMethod());
            }

            log.info("Step 5: Creating STI test object");
            STITest stiTest;
            BigDecimal totalPrice;
            if (request.isServiceBooking()) {
                // Service booking
                log.info("Step 5a: Booking service ID: {}", request.getServiceId());
                Optional<STIService> serviceOpt = stiServiceRepository.findById(request.getServiceId());
                if (serviceOpt.isEmpty()) {
                    log.warn("STI service not found: {}", request.getServiceId());
                    return ApiResponse.error("STI service not found");
                }
                STIService stiService = serviceOpt.get();
                log.info("Step 5a: STI service found: {}", stiService.getName());

                if (!stiService.getIsActive()) {
                    log.warn("STI service is not active: {}", stiService.getName());
                    return ApiResponse.error("STI service is not available");
                }
                log.info("Step 5a: STI service is active");

                // Validate có ít nhất 1 active component
                log.info("Step 5a: Validating active components");
                boolean hasActiveComponents = stiService.getTestComponents() != null
                        && stiService.getTestComponents().stream()
                                .anyMatch(component -> Boolean.TRUE.equals(component.getIsActive()));

                if (!hasActiveComponents) {
                    log.warn("STI service has no active components: {}", stiService.getName());
                    return ApiResponse.error("STI service has no active test components available");
                }
                log.info("Step 5a: Active components validation passed");

                totalPrice = stiService.getPrice();
                log.info("Step 5a: Service price: {}", totalPrice);
                stiTest = STITest.builder()
                        .customer(customer)
                        .stiService(stiService)
                        .appointmentDate(request.getAppointmentDate())
                        .customerNotes(request.getCustomerNotes())
                        .totalPrice(totalPrice)
                        .status(STITestStatus.PENDING)
                        .build();
                log.info("Step 5a: STI test object created for service");

            } else {
                // Package booking
                log.info("Step 5b: Booking package ID: {}", request.getPackageId());
                Optional<STIPackage> packageOpt = stiPackageRepository
                        .findByIdWithServicesAndComponents(request.getPackageId());
                if (packageOpt.isEmpty()) {
                    log.warn("STI package not found: {}", request.getPackageId());
                    return ApiResponse.error("STI package not found");
                }
                STIPackage stiPackage = packageOpt.get();
                log.info("Step 5b: STI package found: {}", stiPackage.getPackageName());

                if (!stiPackage.getIsActive()) {
                    log.warn("STI package is not active: {}", stiPackage.getPackageName());
                    return ApiResponse.error("STI package is not available");
                }
                log.info("Step 5b: STI package is active");

                // Validate có ít nhất 1 active component trong package
                log.info("Step 5b: Validating active components in package");
                List<PackageService> packageServices = packageServiceRepository
                        .findByStiPackage_PackageId(stiPackage.getPackageId());
                boolean hasActiveComponents = packageServices != null
                        && packageServices.stream()
                                .map(PackageService::getStiService)
                                .filter(service -> service != null && Boolean.TRUE.equals(service.getIsActive()))
                                .anyMatch(service -> service.getTestComponents() != null
                                        && service.getTestComponents().stream()
                                                .anyMatch(component -> Boolean.TRUE.equals(component.getIsActive())));

                if (!hasActiveComponents) {
                    log.warn("STI package has no active components: {}", stiPackage.getPackageName());
                    return ApiResponse.error("STI package has no active test components available");
                }
                log.info("Step 5b: Active components validation passed");

                totalPrice = stiPackage.getPackagePrice();
                log.info("Step 5b: Package price: {}", totalPrice);
                stiTest = STITest.builder()
                        .customer(customer)
                        .stiPackage(stiPackage)
                        .appointmentDate(request.getAppointmentDate())
                        .customerNotes(request.getCustomerNotes())
                        .totalPrice(totalPrice)
                        .status(STITestStatus.PENDING)
                        .build();
                log.info("Step 5b: STI test object created for package");
            }

            log.info("Step 6: Saving STI test to database");
            STITest savedTest;
            try {
                savedTest = stiTestRepository.save(stiTest);
                log.info("Step 6: STI Test saved successfully - ID: {} for user: {}", savedTest.getTestId(),
                        customerId);
            } catch (Exception e) {
                log.error("Step 6: Error saving STI test: {}", e.getMessage(), e);
                return ApiResponse.error("Error creating test booking: " + e.getMessage());
            }

            // Tạo TestResults
            log.info("Step 7: Creating test results");
            try {
                if (request.isPackageBooking()) {
                    createTestResultsForPackage(savedTest);
                    // Tạo note rỗng cho từng service trong package
                    List<PackageService> packageServices = packageServiceRepository.findByStiPackage_PackageId(savedTest.getStiPackage().getPackageId());
                    for (PackageService ps : packageServices) {
                        if (ps.getStiService() != null && Boolean.TRUE.equals(ps.getStiService().getIsActive())) {
                            TestServiceConsultantNote note = new TestServiceConsultantNote();
                            note.setStiTest(savedTest);
                            note.setService(ps.getStiService());
                            note.setNote("");
                            testServiceConsultantNoteRepository.save(note);
                        }
                    }
                } else {
                    createTestResultsForService(savedTest);
                }
                log.info("Step 7: Test results created successfully");
            } catch (Exception e) {
                log.error("Step 7: Error creating test results for test {}: {}", savedTest.getTestId(), e.getMessage(),
                        e);
                // Don't rollback the transaction, just log the error
            }

            // Xử lý thanh toán - không rollback nếu thất bại
            log.info("Step 8: Processing payment");
            ApiResponse<Payment> paymentResult = processPaymentForTest(savedTest, paymentMethod, request);
            log.info("Step 8: Payment processing completed - success: {}", paymentResult.isSuccess());

            log.info("Step 9: Converting to response");
            STITestResponse response;
            try {
                response = convertToResponse(savedTest);
                log.info("Step 9: Response conversion completed");
            } catch (Exception e) {
                log.error("Step 9: Error converting test to response: {}", e.getMessage(), e);
                return ApiResponse.error("Error processing test booking: " + e.getMessage());
            }

            if (!paymentResult.isSuccess()) {
                log.warn("Step 10: Payment failed for user {}: {}", customerId, paymentResult.getMessage());

                // Không rollback, trả về thông báo lỗi thanh toán nhưng test đã được tạo
                String errorMessage = "Đặt lịch thành công nhưng thanh toán thất bại: " + paymentResult.getMessage();
                if (paymentMethod == PaymentMethod.COD) {
                    errorMessage = "Đặt lịch thành công - Thanh toán khi nhận (chờ xác nhận)";
                }

                log.info("Step 10: Returning booking success with payment failure");
                return new ApiResponse<>(false, errorMessage, response);
            }

            Payment payment = paymentResult.getData();
            log.info("Step 10: Payment successful - Test ID: {}, Payment ID: {}, Status: {}",
                    savedTest.getTestId(), payment.getPaymentId(), payment.getPaymentStatus());

            String message = request.isPackageBooking() ? "STI package test scheduled successfully"
                    : "STI test scheduled successfully";
            if (paymentMethod == PaymentMethod.COD) {
                message += " - Payment on delivery (pending confirmation)";
            } else if (payment.getPaymentStatus() == PaymentStatus.COMPLETED) {
                message += " - Payment processed";
            } else if (paymentMethod == PaymentMethod.QR_CODE && payment.getPaymentStatus() == PaymentStatus.PENDING) {
                message += " - QR code generated, awaiting payment";
            }

            log.info("Step 10: Returning booking success with payment success");
            return ApiResponse.success(message, response);
        } catch (Exception e) {
            log.error("FATAL ERROR in bookTest for user {}: {}", customerId, e.getMessage(), e);
            return ApiResponse.error("An unexpected error occurred while booking the test: " + e.getMessage());
        }
    }

    private ApiResponse<Payment> processPaymentForTest(STITest stiTest, PaymentMethod paymentMethod,
            STITestRequest request) {
        log.info("Processing payment for test {} with method {}", stiTest.getTestId(), paymentMethod);

        String description;
        if (stiTest.getStiService() != null) {
            description = "STI Test: " + stiTest.getStiService().getName();
        } else if (stiTest.getStiPackage() != null) {
            description = "STI Package: " + stiTest.getStiPackage().getPackageName();
        } else {
            description = "STI Test";
        }
        log.info("Payment description: {}", description);

        ApiResponse<Payment> paymentResult;

        try {
            switch (paymentMethod) {
                case COD:
                    paymentResult = paymentService.processCODPayment(
                            stiTest.getCustomer().getId(),
                            "STI",
                            stiTest.getTestId(),
                            stiTest.getTotalPrice(),
                            description);
                    break;

                case VISA:
                    paymentResult = processVisaPaymentWithValidation(stiTest, request);
                    break;

                case QR_CODE:
                    paymentResult = processQRPaymentWithValidation(stiTest, request, description);
                    break;

                default:
                    // Tạo payment failed cho unsupported method
                    try {
                        Payment failedPayment = createFailedPayment(stiTest, paymentMethod, description,
                                "Unsupported payment method: " + paymentMethod);
                        return new ApiResponse<>(false, "Unsupported payment method: " + paymentMethod, failedPayment);
                    } catch (Exception e) {
                        log.error("Error creating failed payment record for unsupported method: {}", e.getMessage(), e);
                        return new ApiResponse<>(false, "Unsupported payment method: " + paymentMethod, null);
                    }
            }

            // Kiểm tra kết quả thanh toán
            if (!paymentResult.isSuccess()) {
                // Nếu đã có payment record (từ PaymentService), trả về luôn
                if (paymentResult.getData() != null) {
                    log.info("Payment failed but payment record already exists - Payment ID: {}",
                            paymentResult.getData().getPaymentId());
                    return paymentResult;
                }

                // Chỉ tạo payment failed mới nếu chưa có payment record
                try {
                    Payment failedPayment = createFailedPayment(stiTest, paymentMethod, description,
                            paymentResult.getMessage());
                    return new ApiResponse<>(false, paymentResult.getMessage(), failedPayment);
                } catch (Exception e) {
                    log.error("Error creating failed payment record: {}", e.getMessage(), e);
                    return new ApiResponse<>(false, paymentResult.getMessage(), null);
                }
            }

            return paymentResult;

        } catch (Exception e) {
            log.error("Unexpected error processing payment: {}", e.getMessage(), e);
            // Tạo payment failed cho unexpected errors
            try {
                Payment failedPayment = createFailedPayment(stiTest, paymentMethod, description,
                        "Payment processing failed: " + e.getMessage());
                return new ApiResponse<>(false, "Payment processing failed: " + e.getMessage(), failedPayment);
            } catch (Exception createPaymentException) {
                log.error("Error creating failed payment record for unexpected error: {}",
                        createPaymentException.getMessage(), createPaymentException);
                return new ApiResponse<>(false, "Payment processing failed: " + e.getMessage(), null);
            }
        }
    }

    /**
     * Tạo payment record với trạng thái FAILED
     */
    private Payment createFailedPayment(STITest stiTest, PaymentMethod paymentMethod, String description,
            String failureReason) {
        Payment failedPayment = Payment.builder()
                .user(stiTest.getCustomer()) // Sửa: truyền UserDtls thay vì id
                .serviceType("STI")
                .serviceId(stiTest.getTestId())
                .paymentMethod(paymentMethod)
                .paymentStatus(PaymentStatus.FAILED)
                .amount(stiTest.getTotalPrice())
                .currency("VND")
                .description(description)
                .notes("Payment failed: " + failureReason)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Lưu payment failed vào database
        Payment savedPayment = paymentRepository.save(failedPayment);
        log.info("Created failed payment record ID: {} for test ID: {}, reason: {}",
                savedPayment.getPaymentId(), stiTest.getTestId(), failureReason);

        return savedPayment;
    }

    private ApiResponse<Payment> processVisaPaymentWithValidation(STITest stiTest, STITestRequest request) {
        String cardNumber, expiryMonth, expiryYear, cvc, cardHolderName;

        // Kiểm tra xem có sử dụng thẻ đã lưu không
        if (request.getSavedCardId() != null) {
            // Sử dụng thẻ đã lưu
            ApiResponse<PaymentInfoResponse> savedCardResponse = paymentInfoService.getPaymentInfoForPayment(
                    request.getSavedCardId(), stiTest.getCustomer().getId());

            if (!savedCardResponse.isSuccess()) {
                return ApiResponse.error("Saved card not found or invalid: " + savedCardResponse.getMessage());
            }

            PaymentInfoResponse savedCard = savedCardResponse.getData();
            cardNumber = savedCard.getCardNumber();
            expiryMonth = savedCard.getExpiryMonth();
            expiryYear = savedCard.getExpiryYear();
            cvc = savedCard.getCvv();
            cardHolderName = savedCard.getCardHolderName();

            // Validate saved card data
            if (cvc == null || cvc.trim().length() < 3) {
                return ApiResponse.error("Invalid saved card CVC - must be 3 or 4 digits");
            }
        } else {
            // Sử dụng thông tin thẻ mới nhập
            // Validate VISA fields
            if (request.getCardNumber() == null || request.getCardNumber().trim().length() != 16) {
                return ApiResponse.error("Invalid card number - must be 16 digits");
            }

            if (request.getExpiryMonth() == null || request.getExpiryYear() == null) {
                return ApiResponse.error("Card expiry date is required");
            }

            try {
                int month = Integer.parseInt(request.getExpiryMonth());
                int year = Integer.parseInt(request.getExpiryYear());

                if (month < 1 || month > 12) {
                    return ApiResponse.error("Invalid expiry month");
                }

                if (year < LocalDateTime.now().getYear()) {
                    return ApiResponse.error("Card has expired");
                }
            } catch (NumberFormatException e) {
                return ApiResponse.error("Invalid expiry date format");
            }

            if (request.getCvc() == null || request.getCvc().trim().length() < 3) {
                return ApiResponse.error("Invalid CVC - must be 3 or 4 digits");
            }

            if (request.getCardHolderName() == null || request.getCardHolderName().trim().isEmpty()) {
                return ApiResponse.error("Card holder name is required");
            }

            cardNumber = request.getCardNumber().trim();
            expiryMonth = request.getExpiryMonth().trim();
            expiryYear = request.getExpiryYear().trim();
            cvc = request.getCvc().trim();
            cardHolderName = request.getCardHolderName().trim();
        }

        // Process Stripe payment
        String description;
        if (stiTest.getStiService() != null) {
            description = "STI Test: " + stiTest.getStiService().getName();
        } else if (stiTest.getStiPackage() != null) {
            description = "STI Package: " + stiTest.getStiPackage().getPackageName();
        } else {
            description = "STI Test";
        }

        ApiResponse<Payment> stripeResult = paymentService.processStripePayment(
                stiTest.getCustomer().getId(),
                "STI",
                stiTest.getTestId(),
                stiTest.getTotalPrice(),
                description,
                cardNumber,
                expiryMonth,
                expiryYear,
                cvc,
                cardHolderName);

        // Cải thiện thông báo lỗi Stripe
        if (!stripeResult.isSuccess()) {
            String errorMessage = stripeResult.getMessage();
            if (errorMessage.contains("Sending credit card numbers directly to the Stripe API")) {
                errorMessage = "Thông tin thẻ không hợp lệ. Vui lòng kiểm tra lại thông tin thẻ hoặc thử phương thức thanh toán khác.";
            } else if (errorMessage.contains("card was declined")) {
                errorMessage = "Thẻ bị từ chối. Vui lòng kiểm tra lại thông tin thẻ hoặc liên hệ ngân hàng.";
            } else if (errorMessage.contains("insufficient funds")) {
                errorMessage = "Thẻ không đủ số dư. Vui lòng kiểm tra lại số dư thẻ.";
            } else if (errorMessage.contains("expired")) {
                errorMessage = "Thẻ đã hết hạn. Vui lòng sử dụng thẻ khác.";
            } else if (errorMessage.contains("invalid")) {
                errorMessage = "Thông tin thẻ không hợp lệ. Vui lòng kiểm tra lại.";
            }

            return new ApiResponse<>(false, errorMessage, stripeResult.getData());
        }

        return stripeResult;
    }

    private ApiResponse<Payment> processQRPaymentWithValidation(STITest stiTest, STITestRequest request,
            String description) {
        log.info("Generating new QR payment for test: {}", stiTest.getTestId());
        return paymentService.generateQRPayment(
                stiTest.getCustomer().getId(),
                "STI",
                stiTest.getTestId(),
                stiTest.getTotalPrice(),
                description);
    }

    public ApiResponse<List<STITestResponse>> getPendingTests() {
        try {
            List<STITest> pendingTests = stiTestRepository.findByStatus(STITestStatus.PENDING);
            List<STITestResponse> responseList = pendingTests.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Retrieved " + responseList.size() + " pending STI tests", responseList);
        } catch (Exception e) {
            log.error("Error retrieving pending STI tests: {}", e.getMessage(), e);
            return ApiResponse.error("Error retrieving pending tests: " + e.getMessage());
        }
    }

    public ApiResponse<List<STITestResponse>> getConfirmedTests() {
        try {
            List<STITest> confirmedTests = stiTestRepository.findByStatus(STITestStatus.CONFIRMED);
            List<STITestResponse> responseList = confirmedTests.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Retrieved " + responseList.size() + " confirmed STI tests", responseList);
        } catch (Exception e) {
            return ApiResponse.error("Error retrieving confirmed tests: " + e.getMessage());
        }
    }

    public ApiResponse<List<STITestResponse>> getStaffTests(Long staffId) {
        try {
            Optional<UserDtls> staffOpt = userRepository.findById(staffId);
            if (staffOpt.isEmpty()) {
                return ApiResponse.error("Staff not found");
            }

            UserDtls staff = staffOpt.get();
            String roleName = staff.getRole() != null ? staff.getRole().getRoleName() : null;
            if (!"STAFF".equals(roleName)) {
                return ApiResponse.error("User is not a staff");
            }

            List<STITest> staffTests = stiTestRepository.findByStaffId(staffId);
            List<STITestResponse> responseList = staffTests.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Retrieved " + responseList.size() + " tests for staff", responseList);
        } catch (Exception e) {
            return ApiResponse.error("Error retrieving staff tests: " + e.getMessage());
        }
    }

    // ========== CONSULTANT METHODS ==========
    public ApiResponse<List<STITestResponse>> getTestsPendingConsultantNotes() {
        try {
            // Lấy các test có trạng thái SAMPLED, RESULTED, hoặc COMPLETED
            // và chưa có consultantNotes (null hoặc empty)
            List<STITest> tests = stiTestRepository.findTestsPendingConsultantNotes();

            List<STITestResponse> responses = tests.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Retrieved " + responses.size() + " tests pending consultant notes", responses);
        } catch (Exception e) {
            log.error("Error retrieving tests pending consultant notes: {}", e.getMessage(), e);
            return ApiResponse.error("Error retrieving tests: " + e.getMessage());
        }
    }

    public ApiResponse<List<STITestResponse>> getAllConsultantTests() {
        try {
            // Lấy tất cả tests có trạng thái từ SAMPLED trở đi (có thể consultant xem được)
            List<STITest> tests = stiTestRepository.findAllConsultantAccessibleTests();

            List<STITestResponse> responses = tests.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ApiResponse.success("Retrieved " + responses.size() + " consultant accessible tests", responses);
        } catch (Exception e) {
            log.error("Error retrieving consultant tests: {}", e.getMessage(), e);
            return ApiResponse.error("Error retrieving tests: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<STITestResponse> updateTestStatus(Long testId, STITestStatusUpdateRequest request, Long userId) {
        try {
            log.info("Updating test {} to status {} by user {}", testId, request.getStatus(), userId);

            Optional<STITest> testOpt = stiTestRepository.findById(testId);
            if (testOpt.isEmpty()) {
                return ApiResponse.error("STI test not found");
            }

            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();
            STITest test = testOpt.get();

            String userRole = user.getRole() != null ? user.getRole().getRoleName() : null;
            log.info("Current test status: {}, User role: {}", test.getStatus(), userRole);

            if (!validateStatusTransition(test, request.getStatus(), userRole)) {
                return ApiResponse.error("Invalid status transition for your role");
            }

            // CONFIRMED status
            if (request.getStatus() == STITestStatus.CONFIRMED
                    && ("STAFF".equals(userRole) || "ADMIN".equals(userRole))) {

                if (!validatePaymentForConfirmation(test)) {
                    return ApiResponse.error("Cannot confirm test - payment not completed or invalid");
                }

                test.setStatus(STITestStatus.CONFIRMED);
                test.setStaff(user);
            } // SAMPLED status
            else if (request.getStatus() == STITestStatus.SAMPLED
                    && ("STAFF".equals(userRole) || "ADMIN".equals(userRole))) {
                test.setStatus(STITestStatus.SAMPLED);
                if (test.getConsultant() == null) {
                    test.setConsultant(user);
                }
            } // RESULTED status
            else if (request.getStatus() == STITestStatus.RESULTED
                    && ("STAFF".equals(userRole) || "ADMIN".equals(userRole))) {
                // Allow partial results when transitioning to RESULTED
                if (request.getResults() != null && !request.getResults().isEmpty()) {
                    if (!validateAndSaveTestResults(test, request.getResults(), userId, false)) {
                        return ApiResponse.error("Some test results could not be saved. Please check and try again.");
                    }
                }

                test.setStatus(STITestStatus.RESULTED);
                test.setResultDate(LocalDateTime.now());
            } // COMPLETED status
            else if (request.getStatus() == STITestStatus.COMPLETED
                    && ("STAFF".equals(userRole) || "ADMIN".equals(userRole))) {
                // Validate that all required test results are completed when transitioning to
                // COMPLETED
                if (!validateAllTestResultsCompleted(test)) {
                    return ApiResponse
                            .error("Cannot complete test - all test results must be filled before completion");
                }

                test.setStatus(STITestStatus.COMPLETED);
            }

            STITest updatedTest = stiTestRepository.save(test);
            STITestResponse response = convertToResponse(updatedTest);

            return ApiResponse.success("STI test status updated to " + request.getStatus(), response);
        } catch (Exception e) {
            log.error("Error updating test status: {}", e.getMessage(), e);
            return ApiResponse.error("Error updating test status: " + e.getMessage());
        }
    }

    private boolean validatePaymentForConfirmation(STITest test) {
        try {
            Optional<Payment> paymentOpt = paymentService.getPaymentByService("STI", test.getTestId());

            if (paymentOpt.isEmpty()) {
                log.warn("No payment found for test ID: {}", test.getTestId());
                return false;
            }

            Payment payment = paymentOpt.get();

            // COD có thể confirm mà không cần payment completed ngay
            if (payment.getPaymentMethod() == PaymentMethod.COD) {
                return true; // COD payments can be confirmed regardless of status
            }

            // VISA và QR_CODE cần payment completed
            if (payment.getPaymentStatus() != PaymentStatus.COMPLETED) {
                log.warn("Cannot confirm test {} - payment status: {}",
                        test.getTestId(), payment.getPaymentStatus());
                return false;
            }

            return true;
        } catch (Exception e) {
            log.error("Error validating payment for test {}: {}", test.getTestId(), e.getMessage());
            return false;
        }
    }

    private boolean validateAndSaveTestResults(STITest test, List<TestResultRequest> resultRequests, Long userId,
            boolean requireAllResults) {
        List<ServiceTestComponent> serviceComponents;

        // Get components based on whether this is a service or package test
        if (test.getStiService() != null) {
            // Individual service test
            serviceComponents = test.getStiService().getTestComponents();
        } else if (test.getStiPackage() != null) {
            // Package test - get all components from all services in the package
            serviceComponents = new ArrayList<>();
            List<PackageService> packageServices = packageServiceRepository
                    .findByStiPackage_PackageId(test.getStiPackage().getPackageId());
            for (PackageService ps : packageServices) {
                STIService service = ps.getStiService();
                if (service.getTestComponents() != null) {
                    serviceComponents.addAll(service.getTestComponents());
                }
            }
        } else {
            log.error("Test {} has neither service nor package", test.getTestId());
            return false;
        }

        List<Long> serviceComponentIds = serviceComponents.stream()
                .map(ServiceTestComponent::getComponentId)
                .collect(Collectors.toList());

        // Check if all required results are provided (only when requireAllResults is
        // true)
        if (requireAllResults && resultRequests.size() < serviceComponentIds.size()) {
            List<Long> missingComponentIds = new ArrayList<>(serviceComponentIds);
            missingComponentIds.removeAll(resultRequests.stream()
                    .map(TestResultRequest::getComponentId)
                    .collect(Collectors.toList()));

            log.warn("Missing results for components: {} in test ID: {}", missingComponentIds, test.getTestId());
            return false;
        }

        boolean allResultsSaved = true;
        for (TestResultRequest resultReq : resultRequests) {
            try {
                if (!serviceComponentIds.contains(resultReq.getComponentId())) {
                    String serviceInfo = test.getStiService() != null ? "service " + test.getStiService().getId()
                            : "package " + test.getStiPackage().getPackageId();
                    log.error("Component ID {} does not belong to {}",
                            resultReq.getComponentId(), serviceInfo);
                    allResultsSaved = false;
                    continue;
                }
                Optional<ServiceTestComponent> componentOpt = testComponentRepository
                        .findById(resultReq.getComponentId());
                if (componentOpt.isEmpty()) {
                    log.error("Component ID {} not found", resultReq.getComponentId());
                    allResultsSaved = false;
                    continue;
                }

                ServiceTestComponent component = componentOpt.get();

                // Tìm existing TestResult cho component này trong test này
                Optional<TestResult> existingResultOpt = testResultRepository
                        .findByStiTest_TestIdAndTestComponent_ComponentId(test.getTestId(), resultReq.getComponentId());

                TestResult testResult;
                if (existingResultOpt.isPresent()) {
                    // UPDATE existing result
                    testResult = existingResultOpt.get();
                    log.info("Updating existing TestResult ID {} for component {} in test {}",
                            testResult.getResultId(), resultReq.getComponentId(), test.getTestId());
                } else {
                    // CREATE new result
                    testResult = new TestResult();
                    testResult.setStiTest(test);
                    testResult.setTestComponent(component);
                    testResult.setCreatedAt(LocalDateTime.now()); // Set stiService for package tests
                    if (test.getStiPackage() != null) {
                        testResult.setStiService(component.getStiService());
                    }

                    log.info("Creating new TestResult for component {} in test {}",
                            resultReq.getComponentId(), test.getTestId());
                }

                // Update/Set result values
                testResult.setResultValue(resultReq.getResultValue());
                testResult.setNormalRange(resultReq.getNormalRange());
                testResult.setUnit(resultReq.getUnit());
                testResult.setConclusion(resultReq.getConclusion());
                testResult.setReviewedBy(userId);
                testResult.setReviewedAt(LocalDateTime.now());

                testResultRepository.save(testResult);
            } catch (Exception e) {
                log.error("Error saving result for component {}: {}",
                        resultReq.getComponentId(), e.getMessage());
                allResultsSaved = false;
            }
        }

        return allResultsSaved;
    }

    /**
     * Validate that all required test results are completed for the test
     */
    private boolean validateAllTestResultsCompleted(STITest test) {
        try {
            List<ServiceTestComponent> requiredComponents = new ArrayList<>();

            // Get all required components
            if (test.getStiService() != null) {
                // Individual service test
                if (test.getStiService().getTestComponents() != null) {
                    requiredComponents.addAll(test.getStiService().getTestComponents().stream()
                            .filter(component -> Boolean.TRUE.equals(component.getIsActive()))
                            .collect(Collectors.toList()));
                }
            } else if (test.getStiPackage() != null) {
                // Package test - get all components from all services in the package
                List<PackageService> packageServices = packageServiceRepository
                        .findByStiPackage_PackageId(test.getStiPackage().getPackageId());
                for (PackageService ps : packageServices) {
                    STIService service = ps.getStiService();
                    if (service != null && Boolean.TRUE.equals(service.getIsActive())
                            && service.getTestComponents() != null) {
                        requiredComponents.addAll(service.getTestComponents().stream()
                                .filter(component -> Boolean.TRUE.equals(component.getIsActive()))
                                .collect(Collectors.toList()));
                    }
                }
            }

            if (requiredComponents.isEmpty()) {
                log.warn("No required components found for test ID: {}", test.getTestId());
                return true; // No components required, so it's considered complete
            }

            // Get existing test results
            List<TestResult> existingResults = testResultRepository.findByStiTest_TestId(test.getTestId());
            Set<Long> completedComponentIds = existingResults.stream()
                    .filter(result -> result.getResultValue() != null && !result.getResultValue().trim().isEmpty())
                    .map(result -> result.getTestComponent().getComponentId())
                    .collect(Collectors.toSet());

            // Check if all required components have results
            Set<Long> requiredComponentIds = requiredComponents.stream()
                    .map(ServiceTestComponent::getComponentId)
                    .collect(Collectors.toSet());

            Set<Long> missingComponentIds = new HashSet<>(requiredComponentIds);
            missingComponentIds.removeAll(completedComponentIds);

            if (!missingComponentIds.isEmpty()) {
                log.warn("Test {} cannot be completed - missing results for components: {}",
                        test.getTestId(), missingComponentIds);
                return false;
            }

            log.info("Test {} has all required results completed", test.getTestId());
            return true;

        } catch (Exception e) {
            log.error("Error validating test results completion for test {}: {}", test.getTestId(), e.getMessage(), e);
            return false;
        }
    }

    private boolean validateStatusTransition(STITest test, STITestStatus newStatus, String userRole) {
        STITestStatus currentStatus = test.getStatus();

        if ("STAFF".equals(userRole)) {
            if (currentStatus == STITestStatus.PENDING && newStatus == STITestStatus.CONFIRMED) {
                return true;
            }
            if (currentStatus == STITestStatus.CONFIRMED && newStatus == STITestStatus.SAMPLED) {
                return true;
            }
            if (currentStatus == STITestStatus.SAMPLED && newStatus == STITestStatus.RESULTED) {
                return true;
            }
            if (currentStatus == STITestStatus.RESULTED && newStatus == STITestStatus.COMPLETED) {
                return true;
            }
        } else if ("ADMIN".equals(userRole)) {
            return true;
        } else if ("CUSTOMER".equals(userRole) || "CONSULTANT".equals(userRole)) {
            if (currentStatus == STITestStatus.PENDING && newStatus == STITestStatus.CANCELED) {
                return true;
            }
        }

        return false;
    }

    public ApiResponse<List<STITestResponse>> getMyTests(Long customerId) {
        try {
            Optional<UserDtls> customerOpt = userRepository.findById(customerId);
            if (customerOpt.isEmpty()) {
                return ApiResponse.error("Customer not found");
            }

            List<STITest> tests = stiTestRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
            List<STITestResponse> responses = tests.stream()
                    .map(this::convertToResponse)
                    .toList();

            return ApiResponse.success("STI tests retrieved successfully", responses);
        } catch (Exception e) {
            log.error("Error retrieving STI tests for customer {}: {}", customerId, e.getMessage(), e);
            return ApiResponse.error("Failed to retrieve STI tests: " + e.getMessage());
        }
    }

    public ApiResponse<STITestResponse> getTestDetails(Long testId, Long userId) {
        try {
            Optional<STITest> testOpt = stiTestRepository.findById(testId);
            if (testOpt.isEmpty()) {
                return ApiResponse.error("STI test not found");
            }

            STITest stiTest = testOpt.get();

            if (!stiTest.getCustomer().getId().equals(userId)) {
                return ApiResponse.error("You can only view your own tests");
            }

            STITestResponse response = convertToResponse(stiTest);
            return ApiResponse.success("STI test details retrieved successfully", response);
        } catch (Exception e) {
            log.error("Error retrieving STI test details: {}", e.getMessage(), e);
            return ApiResponse.error("Failed to retrieve STI test details: " + e.getMessage());
        }
    }

    public ApiResponse<?> getTestResults(Long testId, Long userId) {
        try {
            Optional<STITest> testOpt = stiTestRepository.findById(testId);
            if (testOpt.isEmpty()) {
                return ApiResponse.error("STI test not found");
            }

            STITest stiTest = testOpt.get();
            boolean hasAccess = false;
            if (stiTest.getCustomer().getId().equals(userId)) {
                hasAccess = true;
            } else if (stiTest.getConsultant() != null && stiTest.getConsultant().getId().equals(userId)) {
                hasAccess = true;
            } else {
                Optional<UserDtls> userOpt = userRepository.findById(userId);
                if (userOpt.isPresent()) {
                    String userRole = userOpt.get().getRole() != null ? userOpt.get().getRole().getRoleName() : null;
                    if ("STAFF".equals(userRole) || "ADMIN".equals(userRole) || "CONSULTANT".equals(userRole)) {
                        hasAccess = true;
                    }
                }
            }

            if (!hasAccess) {
                return ApiResponse.error("You don't have permission to view these test results");
            }

            if (stiTest.getStatus() != STITestStatus.RESULTED && stiTest.getStatus() != STITestStatus.COMPLETED) {
                return ApiResponse.error("Test results are not available yet");
            }

            List<TestResult> results = testResultRepository.findByStiTest_TestId(testId);
            List<TestResultResponse> responseList = results.stream()
                    .map(this::convertToTestResultResponse)
                    .collect(Collectors.toList());

            // Nếu là package, trả về thêm note từng service
            if (stiTest.getStiPackage() != null) {
                List<TestServiceConsultantNote> notes = testServiceConsultantNoteRepository.findByStiTest(stiTest);
                List<STITestResponse.TestServiceConsultantNoteDTO> noteDTOs = notes.stream().map(n -> {
                    STITestResponse.TestServiceConsultantNoteDTO dto = new STITestResponse.TestServiceConsultantNoteDTO();
                    dto.setId(n.getId());
                    dto.setServiceId(n.getService() != null ? n.getService().getId() : null);
                    dto.setServiceName(n.getService() != null ? n.getService().getName() : null);
                    dto.setNote(n.getNote());
                    dto.setConsultantId(n.getConsultant() != null ? n.getConsultant().getId() : null);
                    dto.setConsultantName(n.getConsultant() != null ? n.getConsultant().getFullName() : null);
                    return dto;
                }).collect(Collectors.toList());
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("results", responseList);
                data.put("testServiceConsultantNotes", noteDTOs);
                return ApiResponse.success("Retrieved " + responseList.size() + " test results", data);
            }

            return ApiResponse.success("Retrieved " + responseList.size() + " test results", responseList);
        } catch (Exception e) {
            log.error("Error retrieving test results: {}", e.getMessage(), e);
            return ApiResponse.error("Failed to retrieve test results: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<STITestResponse> cancelTest(Long testId, Long userId, String reason) {
        try {
            Optional<STITest> testOpt = stiTestRepository.findById(testId);
            if (testOpt.isEmpty()) {
                return ApiResponse.error("STI test not found");
            }

            STITest stiTest = testOpt.get();

            // Lấy role của user
            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }
            UserDtls user = userOpt.get();
            String roleName = user.getRole() != null ? user.getRole().getRoleName() : null;

            boolean isStaffOrAdmin = "STAFF".equals(roleName) || "ADMIN".equals(roleName);

            // Nếu không phải staff/admin thì chỉ cho phép customer tự huỷ test của mình và chỉ khi status là PENDING
            if (!isStaffOrAdmin) {
                if (!stiTest.getCustomer().getId().equals(userId)) {
                    return ApiResponse.error("You can only cancel your own tests");
                }
                if (!STITestStatus.PENDING.equals(stiTest.getStatus())) {
                    return ApiResponse.error("Customers can only cancel tests before confirmation. Current status: " + stiTest.getStatus());
                }
            } else {
                // Staff/Admin có thể huỷ bất kỳ test nào, chỉ cần test chưa COMPLETED/CANCELED
                if (STITestStatus.CANCELED.equals(stiTest.getStatus()) || STITestStatus.COMPLETED.equals(stiTest.getStatus())) {
                    return ApiResponse.error("Cannot cancel test in current status: " + stiTest.getStatus());
                }
            }

            String refundMessage = "";
            Optional<Payment> paymentOpt = paymentService.getPaymentByService("STI", testId);

            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();

                // REFUND CHO CẢ VISA VÀ QR_CODE ĐÃ COMPLETED
                if ((payment.getPaymentMethod() == PaymentMethod.VISA
                        || payment.getPaymentMethod() == PaymentMethod.QR_CODE)
                        && payment.getPaymentStatus() == PaymentStatus.COMPLETED) {

                    ApiResponse<Payment> refundResult = paymentService.processRefund(
                            payment.getPaymentId(), "User cancellation");

                    if (!refundResult.isSuccess()) {
                        return ApiResponse.error("Failed to process refund: " + refundResult.getMessage());
                    }

                    // Differentiate refund messages
                    if (payment.getPaymentMethod() == PaymentMethod.VISA) {
                        refundMessage = " - VISA payment refunded automatically";
                        log.info(" VISA refund processed for cancelled test - Test ID: {}, Payment ID: {}",
                                testId, payment.getPaymentId());
                    } else if (payment.getPaymentMethod() == PaymentMethod.QR_CODE) {
                        refundMessage = " - QR Code payment refunded (manual processing required)";
                        log.info(" QR Code refund marked for cancelled test - Test ID: {}, Payment ID: {}, QR Ref: {}",
                                testId, payment.getPaymentId(), payment.getQrPaymentReference());
                    }
                } else if (payment.getPaymentMethod() == PaymentMethod.COD) {
                    // Chuyển COD thành REFUNDED khi hủy
                    payment.setPaymentStatus(PaymentStatus.REFUNDED);
                    payment.setRefundedAt(LocalDateTime.now());
                    payment.setNotes((payment.getNotes() != null ? payment.getNotes() + "; " : "") +
                            "COD payment refunded due to test cancellation");
                    paymentRepository.save(payment);
                    
                    refundMessage = " - COD payment refunded";
                    log.info(" COD payment refunded for cancelled test - Test ID: {}, Payment ID: {}",
                            testId, payment.getPaymentId());
                } else if (payment.getPaymentStatus() != PaymentStatus.COMPLETED) {
                    log.info("⏳ Payment not completed - No refund needed - Test ID: {}, Status: {}",
                            testId, payment.getPaymentStatus());
                }
            }

            // Lưu lý do hủy nếu có
            if (reason != null && !reason.trim().isEmpty()) {
                stiTest.setCancelReason(reason.trim());
            }
            stiTest.setStatus(STITestStatus.CANCELED);
            stiTest.setUpdatedAt(LocalDateTime.now());
            STITest canceledTest = stiTestRepository.save(stiTest);

            STITestResponse response = convertToResponse(canceledTest);

            String successMessage = "STI test canceled successfully" + refundMessage;
            return ApiResponse.success(successMessage, response);

        } catch (Exception e) {
            log.error("Error canceling STI test: {}", e.getMessage(), e);
            return ApiResponse.error("Failed to cancel STI test: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<STITestResponse> updateConsultantNotes(Long testId, String consultantNotes, Long consultantId) {
        try {
            Optional<STITest> testOpt = stiTestRepository.findById(testId);
            if (testOpt.isEmpty()) {
                return ApiResponse.error("STI test not found");
            }

            STITest stiTest = testOpt.get();

            Optional<UserDtls> consultantOpt = userRepository.findById(consultantId);
            if (consultantOpt.isEmpty()) {
                return ApiResponse.error("Consultant not found");
            }

            UserDtls consultant = consultantOpt.get();
            String roleName = consultant.getRole() != null ? consultant.getRole().getRoleName() : null;
            if (!"CONSULTANT".equals(roleName)) {
                return ApiResponse.error("User is not a consultant");
            }

            if (stiTest.getStatus() != STITestStatus.SAMPLED
                    && stiTest.getStatus() != STITestStatus.RESULTED
                    && stiTest.getStatus() != STITestStatus.COMPLETED) {
                return ApiResponse.error(
                        "Consultant notes can only be updated for tests in SAMPLED, RESULTED, or COMPLETED status");
            }

            if (stiTest.getConsultant() == null) {
                stiTest.setConsultant(consultant);
            }

            stiTest.setConsultantNotes(consultantNotes);
            stiTest.setUpdatedAt(LocalDateTime.now());

            STITest updatedTest = stiTestRepository.save(stiTest);
            STITestResponse response = convertToResponse(updatedTest);
            return ApiResponse.success("Consultant notes updated successfully", response);
        } catch (Exception e) {
            log.error("Error updating consultant notes for test {}: {}", testId, e.getMessage(), e);
            return ApiResponse.error("Failed to update consultant notes: " + e.getMessage());
        }
    }

    private String generateQRCodeUrl(Payment payment) {
        try {
            // Use VietQR format but with MB Bank info (keep original working format)
            String baseUrl = "https://img.vietqr.io/image";
            String bankId = "970422"; // MB Bank code
            String accountNo = "0349079940"; // MB Bank account
            String accountName = "NGUYEN VAN CUONG"; // MB Bank account name

            String url = String.format("%s/%s-%s-compact.png?amount=%s&addInfo=%s&accountName=%s",
                    baseUrl,
                    bankId,
                    accountNo,
                    payment.getAmount().toString(),
                    java.net.URLEncoder.encode(payment.getQrPaymentReference(),
                            java.nio.charset.StandardCharsets.UTF_8),
                    java.net.URLEncoder.encode(accountName, java.nio.charset.StandardCharsets.UTF_8));

            return url;
        } catch (Exception e) {
            log.error("Error generating QR URL: {}", e.getMessage());
            return null;
        }
    }

    private STITestResponse convertToResponse(STITest stiTest) {
        STITestResponse response = new STITestResponse();

        // Test information
        response.setTestId(stiTest.getTestId());
        response.setCustomerId(stiTest.getCustomer().getId());
        response.setCustomerName(stiTest.getCustomer().getFullName());
        response.setCustomerEmail(stiTest.getCustomer().getEmail());
        response.setCustomerPhone(stiTest.getCustomer().getPhone()); // Service information
        if (stiTest.getStiService() != null) {
            response.setServiceId(stiTest.getStiService().getId());
            response.setPackageId(null);
            response.setServiceName(stiTest.getStiService().getName());
            response.setServiceDescription(stiTest.getStiService().getDescription());
        } else if (stiTest.getStiPackage() != null) {
            response.setServiceId(null);
            response.setPackageId(stiTest.getStiPackage().getPackageId());
            response.setServiceName(stiTest.getStiPackage().getPackageName());
            response.setServiceDescription(stiTest.getStiPackage().getDescription());
        }
        response.setTotalPrice(stiTest.getTotalPrice());

        // Staff information
        if (stiTest.getStaff() != null) {
            response.setStaffId(stiTest.getStaff().getId());
            response.setStaffName(stiTest.getStaff().getFullName());
        }

        // Consultant information
        if (stiTest.getConsultant() != null) {
            response.setConsultantId(stiTest.getConsultant().getId());
            response.setConsultantName(stiTest.getConsultant().getFullName());
        }

        // Appointment information
        response.setAppointmentDate(TimezoneUtils.convertUtcToVietnam(stiTest.getAppointmentDate()));
        response.setStatus(stiTest.getStatus().name());

        // ========== PAYMENT INFORMATION ==========
        try {
            Optional<Payment> latestPaymentOpt = paymentService.getPaymentByService("STI", stiTest.getTestId());
            if (latestPaymentOpt.isPresent()) {
                Payment payment = latestPaymentOpt.get();

                response.setPaymentId(payment.getPaymentId());
                response.setPaymentMethod(payment.getPaymentMethod().name());
                response.setPaymentStatus(payment.getPaymentStatus().name());
                response.setPaidAt(TimezoneUtils.convertUtcToVietnam(payment.getPaidAt()));
                response.setPaymentTransactionId(payment.getTransactionId());

                // Add payment failure information
                if (payment.getPaymentStatus() == PaymentStatus.FAILED) {
                    response.setPaymentFailureReason(payment.getNotes());
                    response.setCanRetryPayment(true);
                } else if (payment.getPaymentStatus() == PaymentStatus.PENDING) {
                    response.setCanRetryPayment(true);
                } else {
                    response.setCanRetryPayment(false);
                }

                // Stripe payment specific
                if (payment.getPaymentMethod() == PaymentMethod.VISA) {
                    response.setStripePaymentIntentId(payment.getStripePaymentIntentId());
                    response.setStripeReceiptUrl(payment.getStripeReceiptUrl());
                }

                // QR payment specific
                if (payment.getPaymentMethod() == PaymentMethod.QR_CODE) {
                    response.setQrPaymentReference(payment.getQrPaymentReference());
                    response.setQrExpiresAt(TimezoneUtils.convertUtcToVietnam(payment.getExpiresAt()));

                    if (payment.getQrPaymentReference() != null) {
                        response.setQrCodeUrl(generateQRCodeUrl(payment));
                    }
                }

            } else {
                response.setPaymentMethod("UNKNOWN");
                response.setPaymentStatus("PENDING");
                response.setCanRetryPayment(false);
                log.debug("No payment found for STI test ID: {}", stiTest.getTestId());
            }
        } catch (Exception e) {
            log.error("Error retrieving payment information for test {}: {}", stiTest.getTestId(), e.getMessage());
            response.setPaymentMethod("UNKNOWN");
            response.setPaymentStatus("ERROR");
            response.setCanRetryPayment(false);
        }

        // Additional information
        response.setCustomerNotes(stiTest.getCustomerNotes());
        response.setConsultantNotes(stiTest.getConsultantNotes());
        response.setResultDate(TimezoneUtils.convertUtcToVietnam(stiTest.getResultDate()));
        response.setCancelReason(stiTest.getCancelReason());
        response.setCreatedAt(TimezoneUtils.convertUtcToVietnam(stiTest.getCreatedAt()));
        response.setUpdatedAt(TimezoneUtils.convertUtcToVietnam(stiTest.getUpdatedAt()));

        // Bổ sung lý do huỷ nếu có
        response.setCancelReason(stiTest.getCancelReason());

        // Bổ sung note từng service nếu là package
        if (stiTest.getStiPackage() != null) {
            List<TestServiceConsultantNote> notes = testServiceConsultantNoteRepository.findByStiTest(stiTest);
            List<STITestResponse.TestServiceConsultantNoteDTO> noteDTOs = notes.stream().map(n -> {
                STITestResponse.TestServiceConsultantNoteDTO dto = new STITestResponse.TestServiceConsultantNoteDTO();
                dto.setId(n.getId());
                dto.setServiceId(n.getService() != null ? n.getService().getId() : null);
                dto.setServiceName(n.getService() != null ? n.getService().getName() : null);
                dto.setNote(n.getNote());
                dto.setConsultantId(n.getConsultant() != null ? n.getConsultant().getId() : null);
                dto.setConsultantName(n.getConsultant() != null ? n.getConsultant().getFullName() : null);
                return dto;
            }).collect(Collectors.toList());
            response.setTestServiceConsultantNotes(noteDTOs);
        }

        return response;
    }

    private TestResultResponse convertToTestResultResponse(TestResult result) {
        TestResultResponse response = new TestResultResponse();
        response.setResultId(result.getResultId());
        response.setTestId(result.getStiTest().getTestId());
        response.setComponentId(result.getTestComponent().getComponentId());
        response.setComponentName(result.getTestComponent().getTestName());
        response.setResultValue(result.getResultValue());
        response.setNormalRange(result.getNormalRange());
        response.setUnit(result.getUnit());
        response.setConclusion(result.getConclusion());
        response.setConclusionDisplayName(
                result.getConclusion() != null ? result.getConclusion().getDisplayName() : null);
        response.setReviewedBy(result.getReviewedBy());
        response.setReviewedAt(TimezoneUtils.convertUtcToVietnam(result.getReviewedAt()));

        if (result.getReviewedBy() != null) {
            userRepository.findById(result.getReviewedBy())
                    .ifPresent(user -> response.setReviewerName(user.getFullName()));
        }
        // Sửa logic lấy serviceId và packageId
        if (result.getStiService() != null) {
            response.setServiceId(result.getStiService().getId());
        } else if (result.getStiTest() != null && result.getStiTest().getStiService() != null) {
            response.setServiceId(result.getStiTest().getStiService().getId());
        }
        if (result.getStiTest() != null && result.getStiTest().getStiPackage() != null) {
            response.setPackageId(result.getStiTest().getStiPackage().getPackageId());
        }
        return response;
    }

    /**
     * Tạo TestResults cho Service booking
     */
    private void createTestResultsForService(STITest stiTest) {
        if (stiTest.getStiService() == null || stiTest.getStiService().getTestComponents() == null) {
            return;
        }

        int activeComponentsCount = 0;
        for (ServiceTestComponent component : stiTest.getStiService().getTestComponents()) {
            // Chỉ tạo TestResult cho các component active
            if (Boolean.TRUE.equals(component.getIsActive())) {
                TestResult result = new TestResult();
                result.setStiTest(stiTest);
                result.setTestComponent(component);
                result.setStiService(stiTest.getStiService()); // Same as parent service
                testResultRepository.save(result);
                activeComponentsCount++;
            }
        }
        log.info("Created {} test results for service booking: {} (from {} total components, {} active)",
                activeComponentsCount, stiTest.getTestId(),
                stiTest.getStiService().getTestComponents().size(), activeComponentsCount);
    }

    /**
     * Tạo TestResults cho Package booking
     */
    private void createTestResultsForPackage(STITest stiTest) {
        if (stiTest.getStiPackage() == null) {
            return;
        }
        // Lấy danh sách dịch vụ qua bảng trung gian
        List<PackageService> packageServices = packageServiceRepository
                .findByStiPackage_PackageId(stiTest.getStiPackage().getPackageId());
        if (packageServices == null || packageServices.isEmpty()) {
            // Không có service nào trong gói này
            return;
        }

        int totalResults = 0;
        for (PackageService ps : packageServices) {
            STIService service = ps.getStiService();
            if (service == null || !Boolean.TRUE.equals(service.getIsActive())) {
                continue;
            }

            List<ServiceTestComponent> components = service.getTestComponents();
            if (components != null) {
                for (ServiceTestComponent component : components) {
                    if (Boolean.TRUE.equals(component.getIsActive())) {
                        TestResult result = new TestResult();
                        result.setStiTest(stiTest);
                        result.setTestComponent(component);
                        result.setStiService(service); // Track which service this component belongs to
                        testResultRepository.save(result);
                        totalResults++;
                    }
                }
            }
        }

        log.info("Created {} test results for package booking: {}", totalResults, stiTest.getTestId());
    }

    /**
     * Lấy TestResults được group theo service (cho package)
     */
    public ApiResponse<List<ServiceTestGroup>> getTestResultsGroupedByService(Long testId, Long userId) {
        try {
            Optional<STITest> testOpt = stiTestRepository.findById(testId);
            if (testOpt.isEmpty()) {
                return ApiResponse.error("Test not found");
            }

            STITest stiTest = testOpt.get();

            // Kiểm tra quyền
            if (!canAccessTest(stiTest, userId)) {
                return ApiResponse.error("Access denied");
            }

            List<TestResult> results = testResultRepository
                    .findByStiTestTestIdOrderBySourceServiceNameAscTestComponentTestNameAsc(testId);

            // Group by STI service
            Map<STIService, List<TestResult>> groupedResults = results.stream()
                    .collect(Collectors.groupingBy(TestResult::getStiService));

            List<ServiceTestGroup> serviceGroups = new ArrayList<>();
            for (Map.Entry<STIService, List<TestResult>> entry : groupedResults.entrySet()) {
                STIService service = entry.getKey();
                List<TestResult> serviceResults = entry.getValue();

                ServiceTestGroup group = new ServiceTestGroup();
                group.setServiceId(service.getId());
                group.setServiceName(service.getName());
                group.setServiceDescription(service.getDescription());

                List<TestResultResponse> resultResponses = serviceResults.stream()
                        .map(this::convertTestResultToResponse)
                        .collect(Collectors.toList());
                group.setTestResults(resultResponses);

                serviceGroups.add(group);
            }

            return ApiResponse.success("Test results retrieved successfully", serviceGroups);

        } catch (Exception e) {
            log.error("Error retrieving grouped test results: {}", e.getMessage(), e);
            return ApiResponse.error("Failed to retrieve test results: " + e.getMessage());
        }
    }

    /**
     * DTO class for grouped service results
     */
    public static class ServiceTestGroup {

        private Long serviceId;
        private String serviceName;
        private String serviceDescription;
        private List<TestResultResponse> testResults;

        // Getters and setters
        public Long getServiceId() {
            return serviceId;
        }

        public void setServiceId(Long serviceId) {
            this.serviceId = serviceId;
        }

        public String getServiceName() {
            return serviceName;
        }

        public void setServiceName(String serviceName) {
            this.serviceName = serviceName;
        }

        public String getServiceDescription() {
            return serviceDescription;
        }

        public void setServiceDescription(String serviceDescription) {
            this.serviceDescription = serviceDescription;
        }

        public List<TestResultResponse> getTestResults() {
            return testResults;
        }

        public void setTestResults(List<TestResultResponse> testResults) {
            this.testResults = testResults;
        }
    }

    private TestResultResponse convertTestResultToResponse(TestResult result) {
        TestResultResponse response = new TestResultResponse();
        response.setResultId(result.getResultId());
        response.setTestId(result.getStiTest().getTestId());
        response.setComponentId(result.getTestComponent().getComponentId());
        response.setTestName(result.getTestComponent().getTestName());
        response.setReferenceRange(result.getTestComponent().getReferenceRange());
        response.setResultValue(result.getResultValue());
        response.setNormalRange(result.getNormalRange());
        response.setUnit(result.getUnit());
        response.setConclusion(result.getConclusion());
        response.setReviewedBy(result.getReviewedBy());
        response.setReviewedAt(TimezoneUtils.convertUtcToVietnam(result.getReviewedAt()));
        response.setCreatedAt(TimezoneUtils.convertUtcToVietnam(result.getCreatedAt()));
        response.setUpdatedAt(TimezoneUtils.convertUtcToVietnam(result.getUpdatedAt()));
        return response;
    }

    /**
     * Kiểm tra quyền truy cập test
     */
    private boolean canAccessTest(STITest stiTest, Long userId) {
        // Customer có thể truy cập test của mình
        if (stiTest.getCustomer().getId().equals(userId)) {
            return true;
        }

        // Staff và Admin có thể truy cập tất cả test
        Optional<UserDtls> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            UserDtls user = userOpt.get();
            if (user.getRole() != null) {
                String roleName = user.getRole().getRoleName();
                return "ADMIN".equals(roleName) || "STAFF".equals(roleName);
            }
        }

        return false;
    }

    /**
     * Update test results for tests in RESULTED status
     * Allows staff to modify existing results before completing the test
     */
    @Transactional
    public ApiResponse<STITestResponse> updateTestResults(Long testId, List<TestResultRequest> resultRequests,
            Long userId) {
        try {
            log.info("Updating test results for test {} by user {}", testId, userId);

            Optional<STITest> testOpt = stiTestRepository.findById(testId);
            if (testOpt.isEmpty()) {
                return ApiResponse.error("STI test not found");
            }

            STITest test = testOpt.get();

            // Check if test is in RESULTED status
            if (test.getStatus() != STITestStatus.RESULTED) {
                return ApiResponse.error("Test results can only be updated when test is in RESULTED status");
            }

            Optional<UserDtls> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            UserDtls user = userOpt.get();
            String userRole = user.getRole() != null ? user.getRole().getRoleName() : null;

            // Only STAFF and ADMIN can update test results
            if (!"STAFF".equals(userRole) && !"ADMIN".equals(userRole)) {
                return ApiResponse.error("Only staff and admin can update test results");
            }

            if (resultRequests == null || resultRequests.isEmpty()) {
                return ApiResponse.error("Test results are required");
            }

            // Validate and save the updated results
            if (!validateAndSaveTestResults(test, resultRequests, userId, false)) {
                return ApiResponse.error("Some test results could not be updated. Please check and try again.");
            }

            // Update the result date
            test.setResultDate(LocalDateTime.now());
            test.setUpdatedAt(LocalDateTime.now());

            STITest updatedTest = stiTestRepository.save(test);
            STITestResponse response = convertToResponse(updatedTest);

            return ApiResponse.success("Test results updated successfully", response);
        } catch (Exception e) {
            log.error("Error updating test results for test {}: {}", testId, e.getMessage(), e);
            return ApiResponse.error("Error updating test results: " + e.getMessage());
        }
    }

    /**
     * Retry payment for a test with failed payment
     * Allows users to retry payment with different payment method or card details
     */
    @Transactional
    public ApiResponse<STITestResponse> retryPayment(Long testId, STITestRequest request, Long userId) {
        try {
            log.info("Retrying payment for test {} by user {}", testId, userId);

            Optional<STITest> testOpt = stiTestRepository.findById(testId);
            if (testOpt.isEmpty()) {
                return ApiResponse.error("STI test not found");
            }

            STITest test = testOpt.get();

            // Check if user owns this test
            if (!test.getCustomer().getId().equals(userId)) {
                return ApiResponse.error("You can only retry payment for your own tests");
            }

            // Check if test is in PENDING status (can only retry for pending tests)
            if (test.getStatus() != STITestStatus.PENDING) {
                return ApiResponse.error("Payment can only be retried for tests in PENDING status");
            }

            // Get existing failed payment
            Optional<Payment> existingPaymentOpt = paymentService.getPaymentByService("STI", testId);
            if (existingPaymentOpt.isEmpty()) {
                return ApiResponse.error("No payment record found for this test");
            }

            Payment existingPayment = existingPaymentOpt.get();

            // Check if payment is failed or pending (can retry)
            if (existingPayment.getPaymentStatus() != PaymentStatus.FAILED &&
                    existingPayment.getPaymentStatus() != PaymentStatus.PENDING) {
                return ApiResponse
                        .error("Payment cannot be retried - current status: " + existingPayment.getPaymentStatus());
            }

            // Validate payment method
            PaymentMethod paymentMethod;
            try {
                paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ApiResponse.error("Invalid payment method: " + request.getPaymentMethod());
            }

            // Process new payment
            ApiResponse<Payment> paymentResult = processPaymentForTest(test, paymentMethod, request);

            if (!paymentResult.isSuccess()) {
                log.warn("Payment retry failed for test {}: {}", testId, paymentResult.getMessage());
                return new ApiResponse<>(false, "Payment retry failed: " + paymentResult.getMessage(),
                        convertToResponse(test));
            }

            Payment newPayment = paymentResult.getData();
            log.info("Payment retry successful - Test ID: {}, New Payment ID: {}, Status: {}",
                    test.getTestId(), newPayment.getPaymentId(), newPayment.getPaymentStatus());

            STITestResponse response = convertToResponse(test);

            String message = "Payment retry successful";
            if (paymentMethod == PaymentMethod.COD) {
                message += " - Payment on delivery (pending confirmation)";
            } else if (newPayment.getPaymentStatus() == PaymentStatus.COMPLETED) {
                message += " - Payment processed";
            } else if (paymentMethod == PaymentMethod.QR_CODE
                    && newPayment.getPaymentStatus() == PaymentStatus.PENDING) {
                message += " - QR code generated, awaiting payment";
            }

            return ApiResponse.success(message, response);

        } catch (Exception e) {
            log.error("Error retrying payment for test {}: {}", testId, e.getMessage(), e);
            return ApiResponse.error("Error retrying payment: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<STITestResponse> assignConsultant(Long testId, Long consultantId) {
        Optional<STITest> testOpt = stiTestRepository.findById(testId);
        if (testOpt.isEmpty())
            return ApiResponse.error("Test not found");
        Optional<UserDtls> consultantOpt = userRepository.findById(consultantId);
        if (consultantOpt.isEmpty())
            return ApiResponse.error("Consultant not found");
        STITest test = testOpt.get();
        test.setConsultant(consultantOpt.get());
        stiTestRepository.save(test);
        return ApiResponse.success("Consultant assigned", convertToResponse(test));
    }

    public ApiResponse<List<STITestResponse>> getTestsForConsultant(Long consultantId) {
        try {
            Optional<UserDtls> consultantOpt = userRepository.findById(consultantId);
            if (consultantOpt.isEmpty()) {
                return ApiResponse.error("Consultant not found");
            }
            UserDtls consultant = consultantOpt.get();
            String roleName = consultant.getRole() != null ? consultant.getRole().getRoleName() : null;
            if (!"CONSULTANT".equals(roleName)) {
                return ApiResponse.error("User is not a consultant");
            }
            List<STITest> tests = stiTestRepository.findByConsultantId(consultantId);
            List<STITestResponse> responses = tests.stream().map(this::convertToResponse).toList();
            return ApiResponse.success("Consultant tests retrieved successfully", responses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve consultant tests: " + e.getMessage());
        }
    }

    public ApiResponse<List<STITestResponse>> getTestsByStatus(STITestStatus status) {
        List<STITest> tests = stiTestRepository.findByStatus(status);
        List<STITestResponse> responses = tests.stream()
                .map(this::convertToResponse)
                .collect(java.util.stream.Collectors.toList());
        return ApiResponse.success("Retrieved tests by status: " + status, responses);
    }

    /**
     * Lấy tất cả STI tests cho admin
     */
    public ApiResponse<List<STITestResponse>> getAllSTITests() {
        try {
            List<STITest> tests = stiTestRepository.findAll();
            List<STITestResponse> responses = tests.stream()
                    .map(this::convertToResponse)
                    .collect(java.util.stream.Collectors.toList());
            return ApiResponse.success("All STI tests retrieved successfully", responses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve all STI tests: " + e.getMessage());
        }
    }

    public void updateConsultantNoteForService(Long stiTestId, Long serviceId, Long consultantId, String note) {
        STITest stiTest = stiTestRepository.findById(stiTestId).orElseThrow(() -> new RuntimeException("STI Test not found"));
        STIService service = stiServiceRepository.findById(serviceId).orElseThrow(() -> new RuntimeException("Service not found"));
        TestServiceConsultantNote consultantNote = testServiceConsultantNoteRepository.findByStiTestAndService(stiTest, service)
            .stream().findFirst().orElseThrow(() -> new RuntimeException("Consultant note not found"));
        if (consultantId != null) {
            UserDtls consultant = userRepository.findById(consultantId).orElse(null);
            consultantNote.setConsultant(consultant);
        }
        consultantNote.setNote(note);
        testServiceConsultantNoteRepository.save(consultantNote);
    }
}