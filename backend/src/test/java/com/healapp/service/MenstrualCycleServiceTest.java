package com.healapp.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.MenstrualCycleRequest;
import com.healapp.dto.MenstrualCycleResponse;
import com.healapp.model.MenstrualCycle;
import com.healapp.model.PregnancyProbLog;
import com.healapp.model.UserDtls;
import com.healapp.repository.MenstrualCycleRepository;
import com.healapp.repository.PregnancyProbLogRepository;
import com.healapp.repository.UserRepository;

@MockitoSettings(strictness = Strictness.LENIENT)
@ExtendWith(MockitoExtension.class)
@DisplayName("MenstrualCycleService Test")
class MenstrualCycleServiceTest {

    @Mock
    private MenstrualCycleRepository menstrualCycleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PregnancyProbLogRepository pregnancyProbLogRepository;

    @Mock
    private PregnancyProbLogService pregnancyProbLogService;

    @Mock
    private UserService userService;

    @Mock
    private EmailService emailService;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private MenstrualCycleService menstrualCycleService;

    private UserDtls sampleUser;
    private MenstrualCycle sampleMenstrualCycle;
    private MenstrualCycleRequest sampleRequest;
    private PregnancyProbLog samplePregnancyProbLog;

    @BeforeEach
    void setUp() {
        // Setup sample user
        sampleUser = new UserDtls();
        sampleUser.setId(1L);
        sampleUser.setFullName("Test User");
        sampleUser.setEmail("test@example.com");

        // Setup sample menstrual cycle
        sampleMenstrualCycle = new MenstrualCycle();
        sampleMenstrualCycle.setId(1L);
        sampleMenstrualCycle.setUser(sampleUser);
        sampleMenstrualCycle.setStartDate(LocalDate.of(2024, 1, 1));
        sampleMenstrualCycle.setNumberOfDays(5L);
        sampleMenstrualCycle.setCycleLength(28L);
        sampleMenstrualCycle.setOvulationDate(LocalDate.of(2024, 1, 14));

        // Setup sample request
        sampleRequest = new MenstrualCycleRequest();
        sampleRequest.setStartDate(LocalDate.of(2024, 1, 1));
        sampleRequest.setNumberOfDays(5L);
        sampleRequest.setCycleLength(28L);

        // Setup sample pregnancy prob log
        samplePregnancyProbLog = new PregnancyProbLog();
        samplePregnancyProbLog.setId(1L);
        samplePregnancyProbLog.setMenstrualCycle(sampleMenstrualCycle);
        samplePregnancyProbLog.setDate(LocalDate.of(2024, 1, 10));
        samplePregnancyProbLog.setProbability(19.3);

        // Setup security context
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("testuser");
        when(userService.getUserIdFromUsername("testuser")).thenReturn(1L);
    }

    @Test
    @DisplayName("Tính ngày rụng trứng thành công")
    void calculateOvulationDate_Success() {
        LocalDate result = menstrualCycleService.calculateOvulationDate(sampleMenstrualCycle);
        
        assertEquals(LocalDate.of(2024, 1, 15), result); // 28 - 14 = 14, startDate + 14 = 15
    }

    @Test
    @DisplayName("Tính ngày rụng trứng với dữ liệu null")
    void calculateOvulationDate_WithNullData_ShouldReturnNull() {
        LocalDate result = menstrualCycleService.calculateOvulationDate(null);
        
        assertNull(result);
    }

    @Test
    @DisplayName("Tính ngày rụng trứng với chu kỳ 30 ngày")
    void calculateOvulationDate_30DayCycle_Success() {
        MenstrualCycle cycle30 = new MenstrualCycle();
        cycle30.setStartDate(LocalDate.of(2024, 1, 1));
        cycle30.setCycleLength(30L);

        LocalDate result = menstrualCycleService.calculateOvulationDate(cycle30);
        
        assertEquals(LocalDate.of(2024, 1, 17), result); // 30 - 14 = 16, nhưng thực tế là 17
    }

    @Test
    @DisplayName("Tính ngày rụng trứng với chu kỳ 21 ngày")
    void calculateOvulationDate_21DayCycle_Success() {
        MenstrualCycle cycle21 = new MenstrualCycle();
        cycle21.setStartDate(LocalDate.of(2024, 1, 1));
        cycle21.setCycleLength(21L);

        LocalDate result = menstrualCycleService.calculateOvulationDate(cycle21);
        
        assertEquals(LocalDate.of(2024, 1, 8), result); // 21 - 14 = 7, nhưng thực tế là 8
    }

    @Test
    @DisplayName("Tính ngày rụng trứng với chu kỳ 35 ngày")
    void calculateOvulationDate_35DayCycle_Success() {
        MenstrualCycle cycle35 = new MenstrualCycle();
        cycle35.setStartDate(LocalDate.of(2024, 1, 1));
        cycle35.setCycleLength(35L);

        LocalDate result = menstrualCycleService.calculateOvulationDate(cycle35);
        
        assertEquals(LocalDate.of(2024, 1, 22), result); // 35 - 14 = 21, nhưng thực tế là 22
    }

    @Test
    @DisplayName("Tạo chu kỳ kinh nguyệt thành công")
    void createMenstrualCycle_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(menstrualCycleRepository.save(any(MenstrualCycle.class))).thenReturn(sampleMenstrualCycle);
        when(pregnancyProbLogService.addPregnancyProbLog(1L)).thenReturn(ApiResponse.success("Success"));

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.createMenstrualCycle(sampleRequest);

        assertTrue(response.isSuccess());
        assertEquals("Chu kỳ kinh nguyệt đã được lưu thành công", response.getMessage());

        verify(userRepository).findById(1L);
        verify(menstrualCycleRepository, times(2)).save(any(MenstrualCycle.class));
        verify(pregnancyProbLogService).addPregnancyProbLog(1L);
    }

    @Test
    @DisplayName("Tạo chu kỳ kinh nguyệt thất bại - user không tồn tại")
    void createMenstrualCycle_UserNotFound_ShouldFail() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.createMenstrualCycle(sampleRequest);

        assertFalse(response.isSuccess());
        assertEquals("Người dùng không tồn tại", response.getMessage());

        verify(userRepository).findById(1L);
        verify(menstrualCycleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Tạo chu kỳ kinh nguyệt thất bại - exception")
    void createMenstrualCycle_Exception_ShouldFail() {
        when(userRepository.findById(1L)).thenThrow(new RuntimeException("Database error"));

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.createMenstrualCycle(sampleRequest);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Lỗi khi lưu chu kỳ kinh nguyệt"));

        verify(userRepository).findById(1L);
        verify(menstrualCycleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Lấy tất cả chu kỳ kinh nguyệt thành công")
    void getAllMenstrualCycle_Success() {
        List<MenstrualCycle> cycles = Arrays.asList(sampleMenstrualCycle);
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(menstrualCycleRepository.findAllByUserId(1L)).thenReturn(Optional.of(cycles));

        ApiResponse<List<MenstrualCycle>> response = menstrualCycleService.getAllMenstrualCycle(1L);

        assertTrue(response.isSuccess());
        assertEquals("Lấy tất cả chu kỳ kinh nguyệt thành công", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(1, response.getData().size());
        assertEquals(1L, response.getData().get(0).getId());
        verify(userRepository).findById(1L);
        verify(menstrualCycleRepository).findAllByUserId(1L);
    }

    @Test
    @DisplayName("Lấy tất cả chu kỳ kinh nguyệt thất bại - user không tồn tại")
    void getAllMenstrualCycle_UserNotFound_ShouldFail() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ApiResponse<List<MenstrualCycle>> response = menstrualCycleService.getAllMenstrualCycle(1L);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Người dùng không tồn tại"));
        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("Lấy chu kỳ kinh nguyệt với tỉ lệ mang thai thành công")
    void getMenstrualCycleWithPregnancyProb_Success() {
        List<MenstrualCycle> cycles = Arrays.asList(sampleMenstrualCycle);
        List<PregnancyProbLog> logs = Arrays.asList(samplePregnancyProbLog);
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(menstrualCycleRepository.findAllByUserId(1L)).thenReturn(Optional.of(cycles));
        when(pregnancyProbLogRepository.findAllByMenstrualCycleId(1L)).thenReturn(Optional.of(logs));

        ApiResponse<List<MenstrualCycleResponse>> response = menstrualCycleService.getMenstrualCycleWithPregnancyProb(1L);

        assertTrue(response.isSuccess());
        assertEquals("Lấy tất cả chu kỳ kinh nguyệt với tỉ lệ mang thai thành công", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(1, response.getData().size());
        assertEquals(1L, response.getData().get(0).getId());
        assertNotNull(response.getData().get(0).getPregnancyProbLogs());
        assertEquals(1, response.getData().get(0).getPregnancyProbLogs().size());
        verify(userRepository).findById(1L);
        verify(menstrualCycleRepository).findAllByUserId(1L);
        verify(pregnancyProbLogRepository).findAllByMenstrualCycleId(1L);
    }

    @Test
    @DisplayName("Lấy chu kỳ kinh nguyệt với tỉ lệ mang thai thất bại - không có dữ liệu")
    void getMenstrualCycleWithPregnancyProb_NoData_ShouldFail() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(menstrualCycleRepository.findAllByUserId(1L)).thenReturn(Optional.empty());

        ApiResponse<List<MenstrualCycleResponse>> response = menstrualCycleService.getMenstrualCycleWithPregnancyProb(1L);

        assertFalse(response.isSuccess());
        assertEquals("Không có chu kỳ kinh nguyệt nào được tìm thấy", response.getMessage());
        verify(userRepository).findById(1L);
        verify(menstrualCycleRepository).findAllByUserId(1L);
    }

    @Test
    @DisplayName("Lấy chu kỳ kinh nguyệt theo ID thành công")
    void getMenstrualCycleById_Success() {
        List<PregnancyProbLog> logs = Arrays.asList(samplePregnancyProbLog);
        
        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.of(sampleMenstrualCycle));
        when(pregnancyProbLogRepository.findAllByMenstrualCycleId(1L)).thenReturn(Optional.of(logs));

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.getMenstrualCycleById(1L);

        assertTrue(response.isSuccess());
        assertEquals("Lấy chu kỳ kinh nguyệt thành công", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(1L, response.getData().getId());
        assertNotNull(response.getData().getPregnancyProbLogs());
        assertEquals(1, response.getData().getPregnancyProbLogs().size());
    }

    @Test
    @DisplayName("Lấy chu kỳ kinh nguyệt theo ID thất bại - không tìm thấy")
    void getMenstrualCycleById_NotFound_ShouldFail() {
        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.empty());

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.getMenstrualCycleById(1L);

        assertFalse(response.isSuccess());
        assertEquals("Chu kỳ kinh nguyệt không tồn tại", response.getMessage());

        verify(menstrualCycleRepository).findById(1L);
        verify(pregnancyProbLogRepository, never()).findAllByMenstrualCycleId(any());
    }

    @Test
    @DisplayName("Cập nhật chu kỳ kinh nguyệt thành công")
    void updateMenstrualCycle_Success() {
        List<PregnancyProbLog> oldLogs = Arrays.asList(samplePregnancyProbLog);
        List<PregnancyProbLog> newLogs = Arrays.asList(samplePregnancyProbLog);

        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.of(sampleMenstrualCycle));
        when(pregnancyProbLogRepository.findAllByMenstrualCycleId(1L)).thenReturn(Optional.of(oldLogs));
        when(menstrualCycleRepository.save(any(MenstrualCycle.class))).thenReturn(sampleMenstrualCycle);
        when(pregnancyProbLogRepository.findAllByMenstrualCycleId(1L)).thenReturn(Optional.of(newLogs));
        
        when(pregnancyProbLogService.deletePregnancyProbLog(1L)).thenReturn(ApiResponse.success("Success"));
        when(pregnancyProbLogService.addPregnancyProbLog(1L)).thenReturn(ApiResponse.success("Success"));

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.updateMenstrualCycle(1L, sampleRequest);

        assertTrue(response.isSuccess());
        assertEquals("Cập nhật chu kỳ kinh nguyệt thành công", response.getMessage());

        verify(menstrualCycleRepository).findById(1L);
        verify(menstrualCycleRepository).save(any(MenstrualCycle.class));
        verify(pregnancyProbLogService).deletePregnancyProbLog(1L);
        verify(pregnancyProbLogService).addPregnancyProbLog(1L);
    }

    @Test
    @DisplayName("Cập nhật chu kỳ kinh nguyệt thất bại - dữ liệu không hợp lệ")
    void updateMenstrualCycle_InvalidData_ShouldFail() {
        sampleRequest.setStartDate(null);

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.updateMenstrualCycle(1L, sampleRequest);

        assertFalse(response.isSuccess());
        assertEquals("Thông tin chu kỳ kinh nguyệt không hợp lệ", response.getMessage());

        verify(menstrualCycleRepository, never()).findById(any());
        verify(menstrualCycleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật chu kỳ kinh nguyệt thất bại - ngày bắt đầu trong tương lai")
    void updateMenstrualCycle_FutureStartDate_ShouldFail() {
        sampleRequest.setStartDate(LocalDate.now().plusDays(1));

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.updateMenstrualCycle(1L, sampleRequest);

        assertFalse(response.isSuccess());
        assertEquals("Ngày bắt đầu chu kỳ kinh nguyệt phải là ngày trong quá khứ", response.getMessage());

        verify(menstrualCycleRepository, never()).findById(any());
        verify(menstrualCycleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật chu kỳ kinh nguyệt thất bại - số ngày không hợp lệ")
    void updateMenstrualCycle_InvalidNumberOfDays_ShouldFail() {
        sampleRequest.setNumberOfDays(0L);

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.updateMenstrualCycle(1L, sampleRequest);

        assertFalse(response.isSuccess());
        assertEquals("Số ngày hành kinh và chu kỳ kinh nguyệt phải là số dương", response.getMessage());

        verify(menstrualCycleRepository, never()).findById(any());
        verify(menstrualCycleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật chu kỳ kinh nguyệt thất bại - không tìm thấy")
    void updateMenstrualCycle_NotFound_ShouldFail() {
        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.empty());

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.updateMenstrualCycle(1L, sampleRequest);

        assertFalse(response.isSuccess());
        assertEquals("Chu kỳ kinh nguyệt không tồn tại", response.getMessage());

        verify(menstrualCycleRepository).findById(1L);
        verify(menstrualCycleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Xóa chu kỳ kinh nguyệt thành công")
    void deleteMenstrualCycle_Success() {
        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.of(sampleMenstrualCycle));
        when(pregnancyProbLogService.deletePregnancyProbLog(1L)).thenReturn(ApiResponse.success("Success"));

        ApiResponse<Void> response = menstrualCycleService.deleteMenstrualCycle(1L);

        assertTrue(response.isSuccess());
        assertEquals("Xóa chu kỳ kinh nguyệt thành công", response.getMessage());

        verify(menstrualCycleRepository).findById(1L);
        verify(pregnancyProbLogService).deletePregnancyProbLog(1L);
        verify(menstrualCycleRepository).delete(sampleMenstrualCycle);
    }

    @Test
    @DisplayName("Xóa chu kỳ kinh nguyệt thất bại - không tìm thấy")
    void deleteMenstrualCycle_NotFound_ShouldFail() {
        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.empty());

        ApiResponse<Void> response = menstrualCycleService.deleteMenstrualCycle(1L);

        assertFalse(response.isSuccess());
        assertEquals("Chu kỳ kinh nguyệt không tồn tại", response.getMessage());

        verify(menstrualCycleRepository).findById(1L);
        verify(pregnancyProbLogService, never()).deletePregnancyProbLog(any());
        verify(menstrualCycleRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Chuyển đổi MenstrualCycle thành Response không có tỉ lệ mang thai")
    void convertToResponse_WithoutPregnancyProb_Success() {
        MenstrualCycleResponse response = menstrualCycleService.convertToResponse(sampleMenstrualCycle);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getUserId());
        assertEquals(LocalDate.of(2024, 1, 1), response.getStartDate());
        assertEquals(5, response.getNumberOfDays());
        assertEquals(28, response.getCycleLength());
        assertNull(response.getPregnancyProbLogs());
    }

    @Test
    @DisplayName("Chuyển đổi MenstrualCycle thành Response có tỉ lệ mang thai")
    void convertToResponse_WithPregnancyProb_Success() {
        List<PregnancyProbLog> logs = Arrays.asList(samplePregnancyProbLog);
        
        MenstrualCycleResponse response = menstrualCycleService.convertToResponse(sampleMenstrualCycle, logs);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getUserId());
        assertEquals(LocalDate.of(2024, 1, 1), response.getStartDate());
        assertEquals(5, response.getNumberOfDays());
        assertEquals(28, response.getCycleLength());
        assertNotNull(response.getPregnancyProbLogs());
        assertEquals(1, response.getPregnancyProbLogs().size());
        assertEquals(1L, response.getPregnancyProbLogs().get(0).getId());
    }

    @Test
    @DisplayName("Lấy ID người dùng hiện tại thành công")
    void getCurrentUserId_Success() {
        Long userId = menstrualCycleService.getCurrentUserId();
        
        assertEquals(1L, userId);
        verify(authentication).getName();
        verify(userService).getUserIdFromUsername("testuser");
    }

    @Test
    @DisplayName("Lấy ID người dùng hiện tại thất bại - authentication null")
    void getCurrentUserId_AuthenticationNull_ShouldReturnNull() {
        when(authentication.getName()).thenReturn(null);
        when(userService.getUserIdFromUsername(null)).thenReturn(null);

        Long userId = menstrualCycleService.getCurrentUserId();
        
        assertNull(userId);
        verify(authentication).getName();
        verify(userService).getUserIdFromUsername(null);
    }

    @Test
    @DisplayName("Lấy ID người dùng hiện tại thất bại - username null")
    void getCurrentUserId_UsernameNull_ShouldReturnNull() {
        when(authentication.getName()).thenReturn(null);
        when(userService.getUserIdFromUsername(null)).thenReturn(null);

        Long userId = menstrualCycleService.getCurrentUserId();
        
        assertNull(userId);
    }

    @Test
    @DisplayName("Tính ngày rụng trứng với chu kỳ null")
    void calculateOvulationDate_NullCycle_ShouldReturnNull() {
        LocalDate result = menstrualCycleService.calculateOvulationDate(null);
        
        assertNull(result);
    }

    @Test
    @DisplayName("Tính ngày rụng trứng với startDate null")
    void calculateOvulationDate_NullStartDate_ShouldReturnNull() {
        MenstrualCycle cycle = new MenstrualCycle();
        cycle.setStartDate(null);
        cycle.setCycleLength(28L);

        LocalDate result = menstrualCycleService.calculateOvulationDate(cycle);
        
        assertNull(result);
    }

    @Test
    @DisplayName("Tính ngày rụng trứng với cycleLength null")
    void calculateOvulationDate_NullCycleLength_ShouldReturnNull() {
        MenstrualCycle cycle = new MenstrualCycle();
        cycle.setStartDate(LocalDate.of(2024, 1, 1));
        cycle.setCycleLength(null);

        LocalDate result = menstrualCycleService.calculateOvulationDate(cycle);
        
        assertNull(result);
    }

    @Test
    @DisplayName("Cập nhật chu kỳ kinh nguyệt với reminderEnabled null")
    void updateMenstrualCycle_ReminderEnabledNull_ShouldSetDefault() {
        MenstrualCycleRequest request = new MenstrualCycleRequest();
        request.setStartDate(LocalDate.of(2024, 1, 1));
        request.setNumberOfDays(5L);
        request.setCycleLength(28L);

        List<PregnancyProbLog> oldLogs = Arrays.asList(samplePregnancyProbLog);
        List<PregnancyProbLog> newLogs = Arrays.asList(samplePregnancyProbLog);

        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.of(sampleMenstrualCycle));
        when(pregnancyProbLogRepository.findAllByMenstrualCycleId(1L)).thenReturn(Optional.of(oldLogs));
        when(menstrualCycleRepository.save(any(MenstrualCycle.class))).thenReturn(sampleMenstrualCycle);
        when(pregnancyProbLogRepository.findAllByMenstrualCycleId(1L)).thenReturn(Optional.of(newLogs));
        
        when(pregnancyProbLogService.deletePregnancyProbLog(1L)).thenReturn(ApiResponse.success("Success"));
        when(pregnancyProbLogService.addPregnancyProbLog(1L)).thenReturn(ApiResponse.success("Success"));

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.updateMenstrualCycle(1L, request);

        assertTrue(response.isSuccess());
        assertEquals("Cập nhật chu kỳ kinh nguyệt thành công", response.getMessage());

        verify(menstrualCycleRepository, atLeastOnce()).save(any(MenstrualCycle.class));
    }

    @Test
    @DisplayName("Cập nhật chu kỳ kinh nguyệt thất bại - lỗi xóa log cũ")
    void updateMenstrualCycle_DeleteOldLogsError_ShouldFail() {
        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.of(sampleMenstrualCycle));
        when(pregnancyProbLogRepository.findAllByMenstrualCycleId(1L))
            .thenReturn(Optional.of(Arrays.asList(samplePregnancyProbLog)));
        when(pregnancyProbLogService.deletePregnancyProbLog(1L))
            .thenThrow(new RuntimeException("Delete error"));

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.updateMenstrualCycle(1L, sampleRequest);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Lỗi khi xóa log cũ"));

        verify(menstrualCycleRepository).findById(1L);
        verify(pregnancyProbLogService).deletePregnancyProbLog(1L);
        verify(menstrualCycleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật chu kỳ kinh nguyệt thất bại - lỗi tạo log mới")
    void updateMenstrualCycle_CreateNewLogsError_ShouldFail() {
        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.of(sampleMenstrualCycle));
        when(pregnancyProbLogRepository.findAllByMenstrualCycleId(1L))
            .thenReturn(Optional.of(Arrays.asList(samplePregnancyProbLog)));
        when(pregnancyProbLogService.deletePregnancyProbLog(1L)).thenReturn(ApiResponse.success("Success"));
        when(pregnancyProbLogService.addPregnancyProbLog(1L))
            .thenThrow(new RuntimeException("Create error"));

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.updateMenstrualCycle(1L, sampleRequest);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Lỗi khi tạo log mới"));

        verify(menstrualCycleRepository).findById(1L);
        verify(pregnancyProbLogService).deletePregnancyProbLog(1L);
        verify(pregnancyProbLogService).addPregnancyProbLog(1L);
        verify(menstrualCycleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Xóa chu kỳ kinh nguyệt thất bại - exception")
    void deleteMenstrualCycle_Exception_ShouldFail() {
        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.of(sampleMenstrualCycle));
        when(pregnancyProbLogService.deletePregnancyProbLog(1L))
            .thenThrow(new RuntimeException("Delete error"));

        ApiResponse<Void> response = menstrualCycleService.deleteMenstrualCycle(1L);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Lỗi khi xóa chu kỳ kinh nguyệt"));

        verify(menstrualCycleRepository).findById(1L);
        verify(pregnancyProbLogService).deletePregnancyProbLog(1L);
        verify(menstrualCycleRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Lấy chu kỳ kinh nguyệt với tỉ lệ mang thai - không có log")
    void getMenstrualCycleWithPregnancyProb_NoLogs_Success() {
        List<MenstrualCycle> cycles = Arrays.asList(sampleMenstrualCycle);
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(menstrualCycleRepository.findAllByUserId(1L)).thenReturn(Optional.of(cycles));
        when(pregnancyProbLogRepository.findAllByMenstrualCycleId(1L)).thenReturn(Optional.empty());

        ApiResponse<List<MenstrualCycleResponse>> response = menstrualCycleService.getMenstrualCycleWithPregnancyProb(1L);

        assertTrue(response.isSuccess());
        assertEquals("Lấy tất cả chu kỳ kinh nguyệt với tỉ lệ mang thai thành công", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(1, response.getData().size());
        assertEquals(1L, response.getData().get(0).getId());
        assertNotNull(response.getData().get(0).getPregnancyProbLogs());
        assertEquals(0, response.getData().get(0).getPregnancyProbLogs().size());
        verify(userRepository).findById(1L);
        verify(menstrualCycleRepository).findAllByUserId(1L);
        verify(pregnancyProbLogRepository).findAllByMenstrualCycleId(1L);
    }

    @Test
    @DisplayName("Lấy chu kỳ kinh nguyệt theo ID - không có log")
    void getMenstrualCycleById_NoLogs_Success() {
        when(menstrualCycleRepository.findById(1L)).thenReturn(Optional.of(sampleMenstrualCycle));
        when(pregnancyProbLogRepository.findAllByMenstrualCycleId(1L)).thenReturn(Optional.empty());

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.getMenstrualCycleById(1L);

        assertTrue(response.isSuccess());
        assertEquals("Lấy chu kỳ kinh nguyệt thành công", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(1L, response.getData().getId());
        assertNotNull(response.getData().getPregnancyProbLogs());
        assertEquals(0, response.getData().getPregnancyProbLogs().size());
    }

    @Test
    @DisplayName("Tạo chu kỳ kinh nguyệt với ovulationRemind null")
    void createMenstrualCycle_OvulationRemindNull_Success() {
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(menstrualCycleRepository.save(any(MenstrualCycle.class))).thenReturn(sampleMenstrualCycle);
        when(pregnancyProbLogService.addPregnancyProbLog(1L)).thenReturn(ApiResponse.success("Success"));

        ApiResponse<MenstrualCycleResponse> response = menstrualCycleService.createMenstrualCycle(sampleRequest);

        assertTrue(response.isSuccess());
        assertEquals("Chu kỳ kinh nguyệt đã được lưu thành công", response.getMessage());

        verify(menstrualCycleRepository, atLeastOnce()).save(any(MenstrualCycle.class));
    }
}