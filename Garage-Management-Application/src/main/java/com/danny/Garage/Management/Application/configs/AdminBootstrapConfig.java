package com.danny.Garage.Management.Application.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.danny.Garage.Management.Application.entity.Role;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.repository.UserRepository;

@Configuration
public class AdminBootstrapConfig {

    @Bean
    CommandLineRunner bootstrapAdminUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${bootstrap.admin.enabled:true}") boolean enabled,
            @Value("${bootstrap.admin.name:Admin}") String adminName,
            @Value("${bootstrap.admin.email:admin@garage.com}") String adminEmail,
            @Value("${bootstrap.admin.password:admin123}") String adminPassword,
            @Value("${bootstrap.admin.phone:9999999999}") String adminPhone) {

        return args -> {
            if (!enabled) {
                return;
            }

            User admin = userRepository.findByEmail(adminEmail).orElse(null);

            if (admin != null) {
                // Keep bootstrap admin usable in local/dev: ensure role, active state, and known password.
                admin.setRole(Role.ADMIN);
                admin.setIsActive(true);
                admin.setActivationToken(null);
                admin.setName(adminName);
                admin.setPhone(adminPhone);
                admin.setPassword(passwordEncoder.encode(adminPassword));

                if (admin.getCurrency() == null || admin.getCurrency().isBlank()) {
                    admin.setCurrency("USD");
                }
                if (admin.getTaxRate() == null) {
                    admin.setTaxRate(12);
                }

                userRepository.save(admin);
                return;
            }

            User newAdmin = User.builder()
                    .name(adminName)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .phone(adminPhone)
                    .role(Role.ADMIN)
                    .isActive(true)
                    .activationToken(null)
                    .currency("USD")
                    .taxRate(12)
                    .build();

            userRepository.save(newAdmin);
        };
    }
}
