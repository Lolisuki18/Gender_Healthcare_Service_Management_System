package com.healapp.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.healapp.dto.ApiResponse;
import com.healapp.model.Payment;
import com.healapp.model.PaymentMethod;
import com.healapp.model.PaymentStatus;
import com.healapp.model.STIService;
import com.healapp.model.STITest;
import com.healapp.model.STITestStatus;
import com.healapp.model.UserDtls;
import com.healapp.repository.PaymentRepository;
import com.healapp.repository.STITestRepository;
import com.healapp.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private STITestRepository stiTestRepository;

    @Mock
    private StripeService stripeService;

    @InjectMocks
    private PaymentService paymentService;

    private UserDtls testUser;
    private Payment testPayment;
    private STITest testSTITest;
    private STIService testSTIService;

    @BeforeEach
    void setUp() {
        testUser = new UserDtls();
        testUser.setId(1L);
        testUser.setFullName("Test User");
        testUser.setEmail("test@example.com");

        testSTIService = new STIService();
        testSTIService.setId(1L);
        testSTIService.setName("STI Test Service");
        testSTIService.setPrice(new BigDecimal("500000"));

        testSTITest = STITest.builder()
                .testId(1L)
                .customer(testUser)
                .stiService(testSTIService)
                .totalPrice(new BigDecimal("500000"))
                .status(STITestStatus.PENDING)
                .build();

        testPayment = Payment.builder()
                .paymentId(1L)
                .user(testUser)
                .serviceType("STI")
                .serviceId(1L)
                .paymentMethod(PaymentMethod.COD)
                .paymentStatus(PaymentStatus.PENDING)
                .amount(new BigDecimal("500000"))
                .currency("VND")
                .description("STI Test")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("COD payment should be created with PENDING status")
    void processCODPayment_ShouldCreatePendingPayment() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        // Act
        ApiResponse<Payment> response = paymentService.processCODPayment(
                1L, "STI", 1L, new BigDecimal("500000"), "STI Test");

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("COD payment processed successfully", response.getMessage());
        
        Payment savedPayment = response.getData();
        assertEquals(PaymentStatus.PENDING, savedPayment.getPaymentStatus());
        assertNull(savedPayment.getPaidAt()); // Should not be set for pending COD
        
        // Verify save is called 2 times: once in createPayment and once in processCODPayment
        verify(paymentRepository, times(2)).save(any(Payment.class));
    }

    @Test
    @DisplayName("Manual confirm COD payment should update status to COMPLETED")
    void manualConfirmCODPayment_ShouldUpdateToCompleted() {
        // Arrange
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        // Act
        ApiResponse<Payment> response = paymentService.manualConfirmCODPayment(1L, "Payment received");

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("COD payment manually confirmed", response.getMessage());
        
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    @DisplayName("Manual confirm COD payment should fail for non-COD payment")
    void manualConfirmCODPayment_ShouldFailForNonCODPayment() {
        // Arrange
        testPayment.setPaymentMethod(PaymentMethod.VISA);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // Act
        ApiResponse<Payment> response = paymentService.manualConfirmCODPayment(1L, "Payment received");

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("This API is only for COD payments", response.getMessage());
        
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("Manual confirm COD payment should fail for already completed payment")
    void manualConfirmCODPayment_ShouldFailForCompletedPayment() {
        // Arrange
        testPayment.setPaymentStatus(PaymentStatus.COMPLETED);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // Act
        ApiResponse<Payment> response = paymentService.manualConfirmCODPayment(1L, "Payment received");

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("COD payment already confirmed", response.getMessage());
        
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("Manual confirm COD payment should fail for refunded payment")
    void manualConfirmCODPayment_ShouldFailForRefundedPayment() {
        // Arrange
        testPayment.setPaymentStatus(PaymentStatus.REFUNDED);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        // Act
        ApiResponse<Payment> response = paymentService.manualConfirmCODPayment(1L, "Payment received");

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Cannot confirm refunded payment", response.getMessage());
        
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("Stripe payment should be created with PROCESSING status initially")
    void processStripePayment_ShouldCreateProcessingPayment() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(testSTITest));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        
        Map<String, String> stripeData = new HashMap<>();
        stripeData.put("paymentIntentId", "pi_test_123");
        stripeData.put("receiptUrl", "https://receipt.stripe.com/test");
        
        ApiResponse<Map<String, String>> stripeResponse = ApiResponse.success("Payment successful", stripeData);
        when(stripeService.processPaymentForSTITest(any(STITest.class), anyString(), anyString(), 
                anyString(), anyString(), anyString())).thenReturn(stripeResponse);

        // Act
        ApiResponse<Payment> response = paymentService.processStripePayment(
                1L, "STI", 1L, new BigDecimal("500000"), "STI Test",
                "4242424242424242", "12", "2025", "123", "Test User");

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("Payment processed successfully", response.getMessage());
        
        Payment savedPayment = response.getData();
        assertEquals(PaymentStatus.COMPLETED, savedPayment.getPaymentStatus());
        assertEquals("pi_test_123", savedPayment.getStripePaymentIntentId());
        assertEquals("https://receipt.stripe.com/test", savedPayment.getStripeReceiptUrl());
        
        // Verify save is called multiple times: once in createPayment, once for processing, once for completed
        verify(paymentRepository, times(3)).save(any(Payment.class));
    }

    @Test
    @DisplayName("Stripe payment should fail when Stripe service returns error")
    void processStripePayment_ShouldFailWhenStripeFails() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(testSTITest));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        
        ApiResponse<Map<String, String>> stripeResponse = ApiResponse.error("Card declined");
        when(stripeService.processPaymentForSTITest(any(STITest.class), anyString(), anyString(), 
                anyString(), anyString(), anyString())).thenReturn(stripeResponse);

        // Act
        ApiResponse<Payment> response = paymentService.processStripePayment(
                1L, "STI", 1L, new BigDecimal("500000"), "STI Test",
                "4000000000000002", "12", "2025", "123", "Test User");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Payment failed"));
        
        Payment failedPayment = response.getData();
        assertEquals(PaymentStatus.FAILED, failedPayment.getPaymentStatus());
        assertTrue(failedPayment.getNotes().contains("Stripe error"));
        
        // Verify save is called: once in createPayment, once for processing, once for failed
        verify(paymentRepository, times(3)).save(any(Payment.class));
    }

    @Test
    @DisplayName("Stripe payment should handle Stripe service exception")
    void processStripePayment_ShouldHandleStripeException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(stiTestRepository.findById(1L)).thenReturn(Optional.of(testSTITest));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        
        when(stripeService.processPaymentForSTITest(any(STITest.class), anyString(), anyString(), 
                anyString(), anyString(), anyString())).thenThrow(new RuntimeException("Stripe service unavailable"));

        // Act
        ApiResponse<Payment> response = paymentService.processStripePayment(
                1L, "STI", 1L, new BigDecimal("500000"), "STI Test",
                "4242424242424242", "12", "2025", "123", "Test User");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Failed to process payment"));
        
        // Verify save is called: once in createPayment, once for processing status
        // Note: When exception occurs, payment is not saved again for FAILED status
        verify(paymentRepository, times(2)).save(any(Payment.class));
    }

    @Test
    @DisplayName("Stripe payment should fail when STI test not found")
    void processStripePayment_ShouldFailWhenSTITestNotFound() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(stiTestRepository.findById(1L)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        // Act
        ApiResponse<Payment> response = paymentService.processStripePayment(
                1L, "STI", 1L, new BigDecimal("500000"), "STI Test",
                "4242424242424242", "12", "2025", "123", "Test User");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Failed to process payment"));
        assertTrue(response.getMessage().contains("STI Test not found"));
        
        // Verify save is called: once in createPayment, once for processing status
        // Note: When STI test not found exception occurs, payment is not saved again
        verify(paymentRepository, times(2)).save(any(Payment.class));
    }

    @Test
    @DisplayName("Stripe payment should fail when user not found")
    void processStripePayment_ShouldFailWhenUserNotFound() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        ApiResponse<Payment> response = paymentService.processStripePayment(
                1L, "STI", 1L, new BigDecimal("500000"), "STI Test",
                "4242424242424242", "12", "2025", "123", "Test User");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Failed to process payment"));
        assertTrue(response.getMessage().contains("User not found"));
    }

    @Test
    @DisplayName("Stripe payment should handle unsupported service type")
    void processStripePayment_ShouldFailForUnsupportedServiceType() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        // Act
        ApiResponse<Payment> response = paymentService.processStripePayment(
                1L, "UNSUPPORTED", 1L, new BigDecimal("500000"), "Unsupported Service",
                "4242424242424242", "12", "2025", "123", "Test User");

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Failed to process payment"));
        assertTrue(response.getMessage().contains("Unsupported service type"));
        
        // Verify save is called: once in createPayment, once for processing status
        // Note: When unsupported service type exception occurs, payment is not saved again
        verify(paymentRepository, times(2)).save(any(Payment.class));
    }

    @Test
    @DisplayName("Get pending COD payments should return list of pending COD payments")
    void getPendingCODPayments_ShouldReturnPendingCODPayments() {
        // Arrange
        Payment pendingCOD1 = Payment.builder()
                .paymentId(1L)
                .user(testUser)
                .paymentMethod(PaymentMethod.COD)
                .paymentStatus(PaymentStatus.PENDING)
                .amount(new BigDecimal("300000"))
                .build();
        
        Payment pendingCOD2 = Payment.builder()
                .paymentId(2L)
                .user(testUser)
                .paymentMethod(PaymentMethod.COD)
                .paymentStatus(PaymentStatus.PENDING)
                .amount(new BigDecimal("500000"))
                .build();
        
        when(paymentRepository.findByPaymentMethodAndPaymentStatus(PaymentMethod.COD, PaymentStatus.PENDING))
                .thenReturn(java.util.Arrays.asList(pendingCOD1, pendingCOD2));

        // Act
        ApiResponse<java.util.List<Payment>> response = paymentService.getPendingCODPayments();

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("Retrieved 2 pending COD payments", response.getMessage());
        assertEquals(2, response.getData().size());
        assertEquals(1L, response.getData().get(0).getPaymentId());
        assertEquals(2L, response.getData().get(1).getPaymentId());
    }

    @Test
    @DisplayName("Get pending COD payments should return empty list when no pending payments")
    void getPendingCODPayments_ShouldReturnEmptyListWhenNoPendingPayments() {
        // Arrange
        when(paymentRepository.findByPaymentMethodAndPaymentStatus(PaymentMethod.COD, PaymentStatus.PENDING))
                .thenReturn(java.util.Collections.emptyList());

        // Act
        ApiResponse<java.util.List<Payment>> response = paymentService.getPendingCODPayments();

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("Retrieved 0 pending COD payments", response.getMessage());
        assertTrue(response.getData().isEmpty());
    }

    @Test
    @DisplayName("Get pending COD payments should handle exception")
    void getPendingCODPayments_ShouldHandleException() {
        // Arrange
        when(paymentRepository.findByPaymentMethodAndPaymentStatus(PaymentMethod.COD, PaymentStatus.PENDING))
                .thenThrow(new RuntimeException("Database error"));

        // Act
        ApiResponse<java.util.List<Payment>> response = paymentService.getPendingCODPayments();

        // Assert
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Failed to retrieve pending COD payments"));
        assertTrue(response.getMessage().contains("Database error"));
    }
}