package com.danny.Garage.Management.Application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    @Value("${spring.mail.username}")
    private String mailUsername;

    /**
     * Sends email asynchronously in a background thread
     * This prevents blocking the HTTP request and avoids timeout issues
     */
    @Async
    public void sendEmailAsync(String to, String subject, String body){
        try {
            log.info("Sending email to: {}", to);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(resolveFromAddress());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); 

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage(), e);
        }
    }

    /**
     * Synchronous email sending (kept for backward compatibility)
     * Use sendEmailAsync() for new code to avoid blocking
     */
    public void sendEmail(String to, String subject, String body){
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(resolveFromAddress());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); 

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