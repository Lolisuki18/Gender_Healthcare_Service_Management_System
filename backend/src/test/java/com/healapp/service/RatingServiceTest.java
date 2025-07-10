package com.healapp.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.CreateRatingRequest;
import com.healapp.dto.RatingResponse;
import com.healapp.dto.RatingSummaryResponse;
import com.healapp.dto.StaffReplyRequest;
import com.healapp.dto.UpdateRatingRequest;
import com.healapp.model.Consultation;
import com.healapp.model.ConsultationStatus;
import com.healapp.model.Rating;
import com.healapp.model.RatingSummary;
import com.healapp.model.Role;
import com.healapp.model.STIPackage;
import com.healapp.model.STIService;
import com.healapp.model.STITest;
import com.healapp.model.STITestStatus;
import com.healapp.model.UserDtls;
import com.healapp.repository.ConsultationRepository;
import com.healapp.repository.RatingRepository;
import com.healapp.repository.RatingSummaryRepository;
import com.healapp.repository.STIPackageRepository;
import com.healapp.repository.STIServiceRepository;
import com.healapp.repository.STITestRepository;
import com.healapp.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("RatingService Unit Test")
public class RatingServiceTest {
    @Mock private RatingRepository ratingRepository;
    @Mock private RatingSummaryRepository ratingSummaryRepository;
    @Mock private UserRepository userRepository;
    @Mock private ConsultationRepository consultationRepository;
    @Mock private STITestRepository stiTestRepository;
    @Mock private STIServiceRepository stiServiceRepository;
    @Mock private STIPackageRepository stiPackageRepository;

    @InjectMocks private RatingService ratingService;

    private UserDtls user, staff, admin;
    private Consultation consultation;
    private STITest stiTest;
    private Rating rating;
    private CreateRatingRequest createRequest;
    private UpdateRatingRequest updateRequest;
    private StaffReplyRequest staffReplyRequest;
    private RatingSummary ratingSummary;

    @BeforeEach
    void setUp() {
        user = new UserDtls();
        user.setId(1L);
        user.setFullName("User");
        
        staff = new UserDtls();
        staff.setId(2L);
        staff.setFullName("Staff User");
        Role staffRole = new Role();
        staffRole.setRoleId(2L);
        staffRole.setRoleName("STAFF");
        staff.setRole(staffRole);
        
        admin = new UserDtls();
        admin.setId(3L);
        admin.setFullName("Admin User");
        Role adminRole = new Role();
        adminRole.setRoleId(3L);
        adminRole.setRoleName("ADMIN");
        admin.setRole(adminRole);

        consultation = new Consultation();
        consultation.setConsultationId(10L);
        consultation.setCustomer(user);
        UserDtls consultant = new UserDtls(); consultant.setId(5L);
        consultation.setConsultant(consultant);
        consultation.setStatus(ConsultationStatus.COMPLETED);

        stiTest = new STITest();
        stiTest.setTestId(20L);
        stiTest.setCustomer(user);
        stiTest.setStatus(STITestStatus.COMPLETED);
        STIService service = new STIService(); service.setId(15L);
        stiTest.setStiService(service);
        STIPackage pkg = new STIPackage(); pkg.setPackageId(25L);
        stiTest.setStiPackage(pkg);

        rating = new Rating();
        rating.setRatingId(100L);
        rating.setUser(user);
        rating.setTargetType(Rating.RatingTargetType.CONSULTANT);
        rating.setTargetId(5L);
        rating.setRating(5);
        rating.setComment("Good");
        rating.setConsultationId(10L);
        rating.setIsActive(true);
        rating.setCreatedAt(LocalDateTime.now());
        rating.setUpdatedAt(LocalDateTime.now());

        createRequest = new CreateRatingRequest(5, "Good", 10L, null);
        updateRequest = new UpdateRatingRequest(4, "Updated");
        staffReplyRequest = new StaffReplyRequest("Thanks!");

        ratingSummary = new RatingSummary();
        ratingSummary.setTargetType(Rating.RatingTargetType.CONSULTANT);
        ratingSummary.setTargetId(5L);
        ratingSummary.setTotalRatings(1);
        ratingSummary.setAverageRating(BigDecimal.valueOf(5));
        ratingSummary.setFiveStarCount(1);
        ratingSummary.setFourStarCount(0);
        ratingSummary.setThreeStarCount(0);
        ratingSummary.setTwoStarCount(0);
        ratingSummary.setOneStarCount(0);
    }

    @Test
    void createRating_success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // Mock duplicate check - CẢ HAI checks như trong implementation
        when(ratingRepository.existsByUserIdAndConsultationIdAndIsActiveTrue(1L, 10L)).thenReturn(false);
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.CONSULTANT, 5L)).thenReturn(false);
        
        // Mock eligibility check - specific consultation completion
        when(consultationRepository.findById(10L)).thenReturn(Optional.of(consultation));
        
        when(ratingRepository.save(any(Rating.class))).thenReturn(rating);
        
        ApiResponse<RatingResponse> res = ratingService.createRating(1L, Rating.RatingTargetType.CONSULTANT, 5L, createRequest);
        assertTrue(res.isSuccess());
        assertEquals("Rating created successfully", res.getMessage());
        assertNotNull(res.getData());
    }

    @Test
    void createRating_userNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        ApiResponse<RatingResponse> res = ratingService.createRating(1L, Rating.RatingTargetType.CONSULTANT, 5L, createRequest);
        assertFalse(res.isSuccess());
        assertEquals("User not found", res.getMessage());
    }

    @Test
    void createRating_alreadyRated_byConsultation() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        // User đã rate consultation này rồi
        when(ratingRepository.existsByUserIdAndConsultationIdAndIsActiveTrue(1L, 10L)).thenReturn(true);
        
        ApiResponse<RatingResponse> res = ratingService.createRating(1L, Rating.RatingTargetType.CONSULTANT, 5L, createRequest);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("already rated"));
    }

    @Test
    void createRating_alreadyRated_byTarget() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        // User chưa rate consultation này nhưng đã rate consultant này rồi
        when(ratingRepository.existsByUserIdAndConsultationIdAndIsActiveTrue(1L, 10L)).thenReturn(false);
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.CONSULTANT, 5L)).thenReturn(true);
        
        ApiResponse<RatingResponse> res = ratingService.createRating(1L, Rating.RatingTargetType.CONSULTANT, 5L, createRequest);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("already rated"));
    }

    @Test
    void createRating_notEligible_consultationNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(ratingRepository.existsByUserIdAndConsultationIdAndIsActiveTrue(1L, 10L)).thenReturn(false);
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.CONSULTANT, 5L)).thenReturn(false);
        
        // Consultation không tồn tại
        when(consultationRepository.findById(10L)).thenReturn(Optional.empty());
        
        ApiResponse<RatingResponse> res = ratingService.createRating(1L, Rating.RatingTargetType.CONSULTANT, 5L, createRequest);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("not eligible"));
    }

    @Test
    void createRating_notEligible_consultationNotCompleted() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(ratingRepository.existsByUserIdAndConsultationIdAndIsActiveTrue(1L, 10L)).thenReturn(false);
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.CONSULTANT, 5L)).thenReturn(false);
        
        // Consultation exists but not completed
        Consultation incompleteConsultation = new Consultation();
        incompleteConsultation.setConsultationId(10L);
        incompleteConsultation.setCustomer(user);
        incompleteConsultation.setConsultant(consultation.getConsultant());
        incompleteConsultation.setStatus(ConsultationStatus.PENDING);
        when(consultationRepository.findById(10L)).thenReturn(Optional.of(incompleteConsultation));
        
        ApiResponse<RatingResponse> res = ratingService.createRating(1L, Rating.RatingTargetType.CONSULTANT, 5L, createRequest);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("not eligible"));
    }

    @Test
    void createRating_notEligible_wrongCustomer() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(ratingRepository.existsByUserIdAndConsultationIdAndIsActiveTrue(1L, 10L)).thenReturn(false);
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.CONSULTANT, 5L)).thenReturn(false);
        
        // Consultation belongs to different user
        UserDtls otherUser = new UserDtls();
        otherUser.setId(999L);
        Consultation otherConsultation = new Consultation();
        otherConsultation.setConsultationId(10L);
        otherConsultation.setCustomer(otherUser);
        otherConsultation.setConsultant(consultation.getConsultant());
        otherConsultation.setStatus(ConsultationStatus.COMPLETED);
        when(consultationRepository.findById(10L)).thenReturn(Optional.of(otherConsultation));
        
        ApiResponse<RatingResponse> res = ratingService.createRating(1L, Rating.RatingTargetType.CONSULTANT, 5L, createRequest);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("not eligible"));
    }

    @Test
    void updateRating_success() {
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        when(ratingRepository.save(any(Rating.class))).thenReturn(rating);
        ApiResponse<RatingResponse> res = ratingService.updateRating(1L, 100L, updateRequest);
        assertTrue(res.isSuccess());
        assertEquals("Rating updated successfully", res.getMessage());
    }

    @Test
    void updateRating_notFound() {
        when(ratingRepository.findById(100L)).thenReturn(Optional.empty());
        ApiResponse<RatingResponse> res = ratingService.updateRating(1L, 100L, updateRequest);
        assertFalse(res.isSuccess());
        assertEquals("Rating not found", res.getMessage());
    }

    @Test
    void updateRating_notOwner() {
        UserDtls other = new UserDtls(); other.setId(99L);
        rating.setUser(other);
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        ApiResponse<RatingResponse> res = ratingService.updateRating(1L, 100L, updateRequest);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("only update your own"));
    }

    @Test
    void updateRating_expired() {
        rating.setCreatedAt(LocalDateTime.now().minusDays(2));
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        ApiResponse<RatingResponse> res = ratingService.updateRating(1L, 100L, updateRequest);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("within 24 hours"));
    }

    @Test
    void deleteRating_success() {
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        ApiResponse<String> res = ratingService.deleteRating(1L, 100L);
        assertTrue(res.isSuccess());
        assertEquals("Rating deleted successfully", res.getMessage());
    }

    @Test
    void deleteRating_staff_success() {
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        
        ApiResponse<String> res = ratingService.deleteRating(2L, 100L);
        assertTrue(res.isSuccess());
        assertEquals("Rating deleted successfully", res.getMessage());
    }

    @Test
    void deleteRating_admin_success() {
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        when(userRepository.findById(3L)).thenReturn(Optional.of(admin));
        
        ApiResponse<String> res = ratingService.deleteRating(3L, 100L);
        assertTrue(res.isSuccess());
        assertEquals("Rating deleted successfully", res.getMessage());
    }

    @Test
    void deleteRating_notOwner_notStaff() {
        UserDtls otherUser = new UserDtls();
        otherUser.setId(999L);
        otherUser.setFullName("Other User");
        Role customerRole = new Role();
        customerRole.setRoleName("CUSTOMER");
        otherUser.setRole(customerRole);
        
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        when(userRepository.findById(999L)).thenReturn(Optional.of(otherUser));
        
        ApiResponse<String> res = ratingService.deleteRating(999L, 100L);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("only delete your own"));
    }

    @Test
    void deleteRating_expired_notStaff() {
        rating.setCreatedAt(LocalDateTime.now().minusDays(2)); // Older than 24h
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        ApiResponse<String> res = ratingService.deleteRating(1L, 100L);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("within 24 hours"));
    }

    @Test
    void deleteRating_notFound() {
        when(ratingRepository.findById(100L)).thenReturn(Optional.empty());
        ApiResponse<String> res = ratingService.deleteRating(1L, 100L);
        assertFalse(res.isSuccess());
        assertEquals("Rating not found", res.getMessage());
    }

    @Test
    void getUserRatings_success() {
        Page<Rating> page = new PageImpl<>(List.of(rating));
        when(ratingRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(eq(1L), any(Pageable.class))).thenReturn(page);
        ApiResponse<Page<RatingResponse>> res = ratingService.getUserRatings(1L, 0, 10);
        assertTrue(res.isSuccess());
        assertEquals(1, res.getData().getTotalElements());
    }

    @Test
    void getRatings_success() {
        Page<Rating> page = new PageImpl<>(List.of(rating));
        when(ratingRepository.findByTargetTypeAndTargetIdAndIsActiveTrue(eq(Rating.RatingTargetType.CONSULTANT), eq(5L), any(Pageable.class))).thenReturn(page);
        ApiResponse<Page<RatingResponse>> res = ratingService.getRatings(Rating.RatingTargetType.CONSULTANT, 5L, 0, 10, "newest", null, null);
        assertTrue(res.isSuccess());
        assertEquals(1, res.getData().getTotalElements());
    }

    @Test
    void getRatingSummary_success() {
        when(ratingSummaryRepository.findByTargetTypeAndTargetId(Rating.RatingTargetType.CONSULTANT, 5L)).thenReturn(Optional.of(ratingSummary));
        ApiResponse<RatingSummaryResponse> res = ratingService.getRatingSummary(Rating.RatingTargetType.CONSULTANT, 5L, false);
        assertTrue(res.isSuccess());
        assertEquals(1, res.getData().getTotalRatings());
    }

    @Test
    void checkRatingEligibility_canRate() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // Mock general eligibility check (hasCompletedConsultation)
        when(consultationRepository.findByCustomerAndStatus(eq(user), eq(ConsultationStatus.COMPLETED)))
            .thenReturn(List.of(consultation)); // consultation có consultant.id = 5L
        
        // Mock not rated yet
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.CONSULTANT, 5L))
            .thenReturn(false);
        
        ApiResponse<Map<String, Object>> res = ratingService.checkRatingEligibility(1L, Rating.RatingTargetType.CONSULTANT, 5L);
        assertTrue(res.isSuccess());
        assertTrue((Boolean) res.getData().get("canRate"));
        assertFalse((Boolean) res.getData().get("hasRated"));
        assertEquals("Eligible to rate", res.getData().get("reason"));
    }

    @Test
    void checkRatingEligibility_hasRated() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(consultationRepository.findByCustomerAndStatus(eq(user), eq(ConsultationStatus.COMPLETED)))
            .thenReturn(List.of(consultation));
        
        // User already rated
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.CONSULTANT, 5L))
            .thenReturn(true);
        
        ApiResponse<Map<String, Object>> res = ratingService.checkRatingEligibility(1L, Rating.RatingTargetType.CONSULTANT, 5L);
        assertTrue(res.isSuccess());
        assertFalse((Boolean) res.getData().get("canRate"));
        assertTrue((Boolean) res.getData().get("hasRated"));
        assertEquals("Already rated", res.getData().get("reason"));
    }

    @Test
    void checkRatingEligibility_notEligible() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // No completed consultations with this consultant
        when(consultationRepository.findByCustomerAndStatus(eq(user), eq(ConsultationStatus.COMPLETED)))
            .thenReturn(List.of()); // Empty list
        
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.CONSULTANT, 5L))
            .thenReturn(false);
        
        ApiResponse<Map<String, Object>> res = ratingService.checkRatingEligibility(1L, Rating.RatingTargetType.CONSULTANT, 5L);
        assertTrue(res.isSuccess());
        assertFalse((Boolean) res.getData().get("canRate"));
        assertFalse((Boolean) res.getData().get("hasRated"));
        assertEquals("Not eligible to rate", res.getData().get("reason"));
    }

    @Test
    void createRating_STIService_success() {
        CreateRatingRequest stiRequest = new CreateRatingRequest(4, "Good service", null, 20L);
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // Mock duplicate check for STI
        when(ratingRepository.existsByUserIdAndStiTestIdAndIsActiveTrue(1L, 20L)).thenReturn(false);
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.STI_SERVICE, 15L)).thenReturn(false);
        
        // Mock eligibility check - specific STI test completion
        when(stiTestRepository.findById(20L)).thenReturn(Optional.of(stiTest));
        
        Rating stiRating = new Rating();
        stiRating.setRatingId(200L);
        stiRating.setUser(user);
        stiRating.setTargetType(Rating.RatingTargetType.STI_SERVICE);
        stiRating.setTargetId(15L);
        stiRating.setRating(4);
        stiRating.setComment("Good service");
        stiRating.setStiTestId(20L);
        stiRating.setIsActive(true);
        stiRating.setCreatedAt(LocalDateTime.now());
        
        when(ratingRepository.save(any(Rating.class))).thenReturn(stiRating);
        
        ApiResponse<RatingResponse> res = ratingService.createRating(1L, Rating.RatingTargetType.STI_SERVICE, 15L, stiRequest);
        assertTrue(res.isSuccess());
        assertEquals("Rating created successfully", res.getMessage());
        assertNotNull(res.getData());
    }

    @Test
    void createRating_STIService_notEligible_testNotCompleted() {
        CreateRatingRequest stiRequest = new CreateRatingRequest(4, "Good service", null, 20L);
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(ratingRepository.existsByUserIdAndStiTestIdAndIsActiveTrue(1L, 20L)).thenReturn(false);
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.STI_SERVICE, 15L)).thenReturn(false);
        
        // STI test not completed
        STITest incompleteTest = new STITest();
        incompleteTest.setTestId(20L);
        incompleteTest.setCustomer(user);
        incompleteTest.setStatus(STITestStatus.PENDING);
        incompleteTest.setStiService(stiTest.getStiService());
        when(stiTestRepository.findById(20L)).thenReturn(Optional.of(incompleteTest));
        
        ApiResponse<RatingResponse> res = ratingService.createRating(1L, Rating.RatingTargetType.STI_SERVICE, 15L, stiRequest);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("not eligible"));
    }

    @Test
    void checkRatingEligibility_STIService_canRate() {
        // Mock general eligibility check (hasCompletedSTIOrder)
        when(stiTestRepository.findByCustomerIdAndStatus(1L, STITestStatus.COMPLETED))
            .thenReturn(List.of(stiTest)); // stiTest có service.id = 15L
        
        // Mock not rated yet
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.STI_SERVICE, 15L))
            .thenReturn(false);
        
        ApiResponse<Map<String, Object>> res = ratingService.checkRatingEligibility(1L, Rating.RatingTargetType.STI_SERVICE, 15L);
        assertTrue(res.isSuccess());
        assertTrue((Boolean) res.getData().get("canRate"));
        assertFalse((Boolean) res.getData().get("hasRated"));
        assertEquals("Eligible to rate", res.getData().get("reason"));
    }

    @Test
    void checkRatingEligibility_STIPackage_canRate() {
        // Mock general eligibility check (hasCompletedSTIPackage)
        when(stiTestRepository.findByCustomerIdAndStatus(1L, STITestStatus.COMPLETED))
            .thenReturn(List.of(stiTest)); // stiTest có package.id = 25L
        
        // Mock not rated yet
        when(ratingRepository.existsByUserIdAndTargetTypeAndTargetIdAndIsActiveTrue(1L, Rating.RatingTargetType.STI_PACKAGE, 25L))
            .thenReturn(false);
        
        ApiResponse<Map<String, Object>> res = ratingService.checkRatingEligibility(1L, Rating.RatingTargetType.STI_PACKAGE, 25L);
        assertTrue(res.isSuccess());
        assertTrue((Boolean) res.getData().get("canRate"));
        assertFalse((Boolean) res.getData().get("hasRated"));
        assertEquals("Eligible to rate", res.getData().get("reason"));
    }

    @Test
    void replyToRating_success() {
        rating.setStaffReply(null);
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        when(ratingRepository.save(any(Rating.class))).thenReturn(rating);
        ApiResponse<RatingResponse> res = ratingService.replyToRating(2L, 100L, staffReplyRequest);
        assertTrue(res.isSuccess());
        assertEquals("Staff reply added successfully", res.getMessage());
    }

    @Test
    void replyToRating_notStaff() {
        rating.setStaffReply(null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user)); // Regular user, not staff
        // Không cần mock ratingRepository.findById vì service sẽ return error trước khi gọi đến nó
        
        ApiResponse<RatingResponse> res = ratingService.replyToRating(1L, 100L, staffReplyRequest);
        assertFalse(res.isSuccess());
        assertTrue(res.getMessage().contains("Only staff members can reply"));
    }

    @Test
    void updateStaffReply_success() {
        rating.setStaffReply("Old reply");
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        when(ratingRepository.save(any(Rating.class))).thenReturn(rating);
        ApiResponse<RatingResponse> res = ratingService.updateStaffReply(2L, 100L, staffReplyRequest);
        assertTrue(res.isSuccess());
        assertEquals("Staff reply updated successfully", res.getMessage());
    }

    @Test
    void deleteStaffReply_success() {
        rating.setStaffReply("Reply");
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        when(ratingRepository.findById(100L)).thenReturn(Optional.of(rating));
        when(ratingRepository.save(any(Rating.class))).thenReturn(rating);
        ApiResponse<String> res = ratingService.deleteStaffReply(2L, 100L);
        assertTrue(res.isSuccess());
        assertEquals("Staff reply deleted successfully", res.getMessage());
    }

    @Test
    void getPendingReplyRatings_success() {
        when(ratingRepository.findPendingReplyRatings(eq(Rating.RatingTargetType.CONSULTANT), eq(5L))).thenReturn(List.of(rating));
        ApiResponse<Page<RatingResponse>> res = ratingService.getPendingReplyRatings(Rating.RatingTargetType.CONSULTANT, 5L, 0, 10);
        assertTrue(res.isSuccess());
        assertEquals(1, res.getData().getTotalElements());
    }
}
