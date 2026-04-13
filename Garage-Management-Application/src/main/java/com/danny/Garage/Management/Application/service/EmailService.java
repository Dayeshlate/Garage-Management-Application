package com.danny.Garage.Management.Application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    @Value("${spring.mail.username}")
    private String mailUsername;

    public void sendEmail(String to, String subject, String body){
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(resolveFromAddress());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send activation email: " + e.getMessage(), e);
        }
    }

    private String resolveFromAddress() {
        if (fromEmail != null && !fromEmail.isBlank()) {
            return fromEmail.trim();
        }

        return mailUsername;
    }
}