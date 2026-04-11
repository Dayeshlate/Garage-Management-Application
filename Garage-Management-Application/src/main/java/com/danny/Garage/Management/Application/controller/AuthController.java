package com.danny.Garage.Management.Application.controller;

import java.util.Map;
import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import com.danny.Garage.Management.Application.dto.AuthDTO;
import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Value("${frontend_url}")
    private String frontendUrl;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {

        if (userService.existsByEmail(userDTO.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email already registered"));
        }

        User savedUser = userService.saveUser(userDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "User registered successfully. Please check your email to activate your account.",
                        "userId", savedUser.getId()
                ));
    }

    @GetMapping("/activate")
    public ResponseEntity<Void> activateUser(@RequestParam String activationToken) {

        boolean isActivated = userService.activateProfile(activationToken);
        String redirectUrl = frontendUrl + "/login?activation=" + (isActivated ? "success" : "invalid");

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .build();
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDTO authDTO) {

        try {

            if (!userService.isAccountActive(authDTO.getEmail())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "message",
                                "Account not activated. Please activate your account first."
                        ));
            }

            Map<String, Object> response =
                    userService.authenticationAndGenerateToken(authDTO);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message", e.getMessage()
                    ));
        }
    }
}