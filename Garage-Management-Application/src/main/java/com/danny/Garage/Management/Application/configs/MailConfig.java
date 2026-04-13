package com.danny.Garage.Management.Application.configs;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private int port;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Value("${spring.mail.properties.mail.smtp.auth:true}")
    private String smtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable:true}")
    private String starttlsEnable;

    @Value("${spring.mail.properties.mail.smtp.connectiontimeout:5000}")
    private String connectionTimeout;

    @Value("${spring.mail.properties.mail.smtp.timeout:5000}")
    private String timeout;

    @Value("${spring.mail.properties.mail.smtp.writetimeout:5000}")
    private String writeTimeout;

    @Bean
    @Primary
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(sanitizePassword(password));
        mailSender.setProtocol("smtp");
        mailSender.setDefaultEncoding("UTF-8");

        Properties senderProperties = mailSender.getJavaMailProperties();
        senderProperties.put("mail.smtp.auth", smtpAuth);
        senderProperties.put("mail.smtp.starttls.enable", starttlsEnable);
        senderProperties.put("mail.smtp.connectiontimeout", connectionTimeout);
        senderProperties.put("mail.smtp.timeout", timeout);
        senderProperties.put("mail.smtp.writetimeout", writeTimeout);

        return mailSender;
    }

    private String sanitizePassword(String password) {
        if (password == null) {
            return null;
        }

        return password.replaceAll("\\s+", "");
    }
}
