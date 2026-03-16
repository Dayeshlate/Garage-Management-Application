package com.danny.Garage.Management.Application.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.danny.Garage.Management.Application.dto.AuthDTO;
import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

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
    public ResponseEntity<String> activateUser(@RequestParam String activationToken) {

        boolean isActivated = userService.activateProfile(activationToken);

        if (isActivated) {
            return ResponseEntity.ok("Account activated successfully");
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Activation token not found or already used");
        }
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