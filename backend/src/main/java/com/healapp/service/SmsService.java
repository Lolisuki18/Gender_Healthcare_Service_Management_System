package com.healapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import jakarta.annotation.PostConstruct;

@Service
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    /**
     * Gửi SMS OTP tới số điện thoại
     * @param toPhoneNumber - Số điện thoại nhận (định dạng quốc tế)
     * @param otpCode - Mã OTP 6 chữ số
     * @return true nếu gửi thành công
     */
    public boolean sendOtpSms(String toPhoneNumber, String otpCode) {
        try {
            String messageBody = String.format(
                "[HealApp] Mã xác thực của bạn là: %s. Mã có hiệu lực trong 5 phút. Không chia sẻ mã này với ai!",
                otpCode
            );

            Message message = Message.creator(
                new PhoneNumber(toPhoneNumber),
                new PhoneNumber(fromPhoneNumber),
                messageBody
            ).create();

            System.out.println("SMS sent successfully. SID: " + message.getSid());
            return true;

        } catch (Exception e) {
            System.err.println("Failed to send SMS: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Chuyển đổi số điện thoại Việt Nam sang định dạng quốc tế
     * @param phoneNumber - Số điện thoại (0349079940)
     * @return Định dạng quốc tế (+84349079940)
     */
    public String formatVietnamesePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return phoneNumber;
        }

        String cleanPhone = phoneNumber.replaceAll("[^0-9]", "");
        
        // Nếu bắt đầu bằng 0, thay thế bằng +84
        if (cleanPhone.startsWith("0") && cleanPhone.length() >= 10) {
            return "+84" + cleanPhone.substring(1);
        }
        // Nếu bắt đầu bằng 84, thêm +
        else if (cleanPhone.startsWith("84") && cleanPhone.length() >= 11) {
            return "+" + cleanPhone;
        }
        // Nếu đã có +84, giữ nguyên
        else if (phoneNumber.startsWith("+84")) {
            return phoneNumber;
        }
        // Nếu số có 9 chữ số, thêm +84
        else if (cleanPhone.length() == 9) {
            return "+84" + cleanPhone;
        }
        // Mặc định thêm +84 nếu số hợp lệ
        else if (cleanPhone.length() >= 9) {
            return "+84" + cleanPhone;
        }
        else {
            throw new IllegalArgumentException("Invalid phone number format: " + phoneNumber);
        }
    }

    /**
     * Xác thực định dạng số điện thoại Việt Nam
     * @param phoneNumber - Số điện thoại cần kiểm tra
     * @return true nếu hợp lệ
     */
    public boolean isValidVietnamesePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return false;
        }

        String cleanPhone = phoneNumber.replaceAll("[^0-9]", "");
        
        // Kiểm tra độ dài
        if (cleanPhone.length() < 10 || cleanPhone.length() > 11) {
            return false;
        }

        // Kiểm tra prefix hợp lệ cho số điện thoại Việt Nam
        if (cleanPhone.startsWith("0")) {
            // Loại bỏ số 0 đầu để kiểm tra prefix
            String withoutZero = cleanPhone.substring(1);
            // Số di động VN: 3x, 5x, 7x, 8x, 9x
            return withoutZero.matches("^[3579]\\d{8}$") || withoutZero.matches("^8[1-9]\\d{7}$");
        } else if (cleanPhone.startsWith("84")) {
            // Với mã quốc gia 84
            String withoutCountryCode = cleanPhone.substring(2);
            return withoutCountryCode.matches("^[3579]\\d{8}$") || withoutCountryCode.matches("^8[1-9]\\d{7}$");
        }
        
        return false;
    }
}
