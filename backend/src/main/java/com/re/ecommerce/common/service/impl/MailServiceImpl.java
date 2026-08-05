package com.re.ecommerce.common.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceImpl {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otpCode) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.warn("Email service is not fully configured (spring.mail.username is missing). Simulated OTP {} to {}", otpCode, toEmail);
            return; // In Dev, if mail not configured, just log it.
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("PinkPhone Retail <" + fromEmail + ">");
            message.setTo(toEmail);
            message.setSubject("PinkPhone - Mã xác nhận khôi phục mật khẩu");
            message.setText("Chào bạn,\n\n" +
                    "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản PinkPhone.\n" +
                    "Mã xác nhận (OTP) của bạn là: " + otpCode + "\n\n" +
                    "Mã này có hiệu lực trong vòng 15 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.\n\n" +
                    "Trân trọng,\nĐội ngũ PinkPhone.");
            
            javaMailSender.send(message);
            log.info("Sent OTP email successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}", toEmail, e);
        }
    }
}
