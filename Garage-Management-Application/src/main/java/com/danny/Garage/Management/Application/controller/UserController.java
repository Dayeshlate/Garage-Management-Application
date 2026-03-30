package com.danny.Garage.Management.Application.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.service.UserService;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;




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
        UserDTO updateDTO = userService.toDto(updatUser);
        return ResponseEntity.ok(
            Map.of(
                "message","User update succesfully",
                "user",updateDTO
            )
        );
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminOnly() {
        return ResponseEntity.ok(Map.of("message", "Admin access granted"));
    }

    @GetMapping("/debug-auth")
    public ResponseEntity<?> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String status = auth != null && auth.isAuthenticated() ? "AUTHENTICATED" : "NOT_AUTHENTICATED";
        String authorities = auth != null ? auth.getAuthorities().toString() : "NONE";
        String principal = auth != null ? auth.getPrincipal().toString() : "NONE";
        
        return ResponseEntity.ok(Map.of(
            "status", status,
            "authorities", authorities,
            "principal", principal,
            "authenticated", auth != null && auth.isAuthenticated()
        ));
    }

    @GetMapping("/current")
    public UserDTO getuser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    System.out.println("Authorities seen by Spring = " + auth.getAuthorities());
    return userService.getCurrentUser();
}

    @GetMapping("/getAllCustomer")
    public ResponseEntity<List<UserDTO>> getAllCustomers() {
        List<UserDTO> userDTOs = userService.getAllCustemors();
        return ResponseEntity.ok(userDTOs);
    }
    

    
}


