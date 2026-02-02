package com.danny.Garage.Management.Application.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.service.UserService;

import java.util.Map;



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
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    System.out.println("Authorities seen by Spring = " + auth.getAuthorities());
    return userService.getCurrentUser();
}

    
}


