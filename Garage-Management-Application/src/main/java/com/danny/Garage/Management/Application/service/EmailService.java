package com.danny.Garage.Management.Application.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${brevo.api.key}")
    private String apiKey;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    @Value("${brevo.sender.name:Garage Management}")
    private String fromName;

    /**
     * Sends email asynchronously in a background thread
     * This prevents blocking the HTTP request and avoids timeout issues
     */
    @Async
    public void sendEmailAsync(String to, String subject, String body) {
        try {
            log.info("Sending email to: {}", to);
            sendViaBrevo(to, subject, body);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage(), e);
        }
    }

    /**
     * Synchronous email sending (kept for backward compatibility)
     * Use sendEmailAsync() for new code to avoid blocking
     */
    public void sendEmail(String to, String subject, String body) {
        try {
            sendViaBrevo(to, subject, body);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send activation email: " + e.getMessage(), e);
        }
    }

    private void sendViaBrevo(String to, String subject, String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", apiKey);
        headers.set("accept", "application/json");
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender", Map.of("name", fromName, "email", fromEmail));
        payload.put("to", List.of(Map.of("email", to)));
        payload.put("subject", subject);
        payload.put("htmlContent", body);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
        restTemplate.postForEntity(BREVO_API_URL, request, String.class);
    }
}