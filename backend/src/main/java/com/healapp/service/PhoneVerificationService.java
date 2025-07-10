package com.healapp.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PhoneVerificationService {

    @Autowired
    private SmsService smsService;

    @Value("${sms.otp.length:6}")
    private int otpLength;

    @Value("${sms.otp.expiry.minutes:5}")
    private int otpExpiryMinutes;

    @Value("${sms.otp.rate.limit.minutes:1}")
    private int rateLimitMinutes;

    // In-memory storage cho OTP (production nên dùng Redis)
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> rateLimitStorage = new ConcurrentHashMap<>();

    /**
     * Tạo và gửi mã OTP tới số điện thoại
     */
    public boolean sendPhoneVerificationCode(String phoneNumber) throws RateLimitException {
        // Chuẩn hóa số điện thoại
        String formattedPhone = smsService.formatVietnamesePhoneNumber(phoneNumber);
        
        // Kiểm tra tính hợp lệ
        if (!smsService.isValidVietnamesePhoneNumber(phoneNumber)) {
            throw new IllegalArgumentException("Invalid phone number format");
        }

        // Kiểm tra rate limit
        if (isRateLimited(formattedPhone)) {
            throw new RateLimitException("Please wait " + rateLimitMinutes + " minute(s) before requesting new code");
        }

        // Tạo mã OTP
        String otpCode = generateOtpCode();
        
        // Gửi SMS
        boolean smsSent = smsService.sendOtpSms(formattedPhone, otpCode);
        
        if (smsSent) {
            // Lưu OTP và cập nhật rate limit
            storeOtp(formattedPhone, otpCode);
            updateRateLimit(formattedPhone);
            return true;
        }
        
        return false;
    }

    /**
     * Xác thực mã OTP
     */
    public boolean verifyPhoneCode(String phoneNumber, String otpCode) {
        String formattedPhone = smsService.formatVietnamesePhoneNumber(phoneNumber);
        
        OtpData otpData = otpStorage.get(formattedPhone);
        
        if (otpData == null) {
            return false; // Không tìm thấy OTP
        }

        if (isExpired(otpData.getCreatedAt())) {
            otpStorage.remove(formattedPhone); // Xóa OTP hết hạn
            return false;
        }

        if (otpData.getCode().equals(otpCode)) {
            otpStorage.remove(formattedPhone); // Xóa OTP sau khi xác thực thành công
            return true;
        }

        return false;
    }

    /**
     * Tạo mã OTP ngẫu nhiên
     */
    private String generateOtpCode() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        
        return otp.toString();
    }

    /**
     * Lưu OTP vào memory
     */
    private void storeOtp(String phoneNumber, String otpCode) {
        OtpData otpData = new OtpData(otpCode, LocalDateTime.now());
        otpStorage.put(phoneNumber, otpData);
    }

    /**
     * Kiểm tra rate limit
     */
    private boolean isRateLimited(String phoneNumber) {
        LocalDateTime lastRequest = rateLimitStorage.get(phoneNumber);
        
        if (lastRequest == null) {
            return false;
        }

        return LocalDateTime.now().isBefore(lastRequest.plusMinutes(rateLimitMinutes));
    }

    /**
     * Cập nhật rate limit
     */
    private void updateRateLimit(String phoneNumber) {
        rateLimitStorage.put(phoneNumber, LocalDateTime.now());
    }

    /**
     * Kiểm tra OTP đã hết hạn chưa
     */
    private boolean isExpired(LocalDateTime createdAt) {
        return LocalDateTime.now().isAfter(createdAt.plusMinutes(otpExpiryMinutes));
    }

    /**
     * Xóa OTP và rate limit cho số điện thoại
     */
    public void clearPhoneVerification(String phoneNumber) {
        String formattedPhone = smsService.formatVietnamesePhoneNumber(phoneNumber);
        otpStorage.remove(formattedPhone);
        rateLimitStorage.remove(formattedPhone);
    }

    /**
     * Inner class để lưu trữ OTP data
     */
    private static class OtpData {
        private final String code;
        private final LocalDateTime createdAt;

        public OtpData(String code, LocalDateTime createdAt) {
            this.code = code;
            this.createdAt = createdAt;
        }

        public String getCode() {
            return code;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
    }

    /**
     * Exception cho rate limit
     */
    public static class RateLimitException extends Exception {
        public RateLimitException(String message) {
            super(message);
        }
    }
}
