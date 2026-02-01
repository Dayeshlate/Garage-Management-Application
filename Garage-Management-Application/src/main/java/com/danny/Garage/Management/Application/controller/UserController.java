package com.danny.Garage.Management.Application.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.service.UserService;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/user")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@RequestBody UserDTO dto,@PathVariable Long id){
        User updatUser = userService.updateUser(dto, id);
        UserDTO updateDTO = userService.todto(updatUser);
        return ResponseEntity.ok(
            Map.of(
                "message","User update succesfully",
                "user",updateDTO
            )
        );
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO dto) {
        if (userService.existsByUsername(dto.getUsername())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Username already exists"));
        }
        User savedUser = userService.saveUser(dto);
        return ResponseEntity.ok(Map.of("message", "User registered", "userId", savedUser.getId()));
    }
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(Map.of("message", "User profile accessed"));
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminOnly() {
        return ResponseEntity.ok(Map.of("message", "Admin access granted"));
    }

    @GetMapping("/current")
    public UserDTO getuser() {
        UserDTO user = userService.getCurrentUser();
        return user;
    }
    
}


