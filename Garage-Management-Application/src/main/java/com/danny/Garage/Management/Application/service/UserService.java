package com.danny.Garage.Management.Application.service;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.Role;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(UserDTO dto){
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        if(dto.getRole()== null){
            dto.setRole(Role.USER);
        }
        User user = toentity(dto);
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id){
            return userRepository.findById(id);
    }

    public boolean existsByUsername(String username){
        return userRepository.existsByUsername(username);
    }

    public UserDTO getCurrentUser() {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
        return null;
    }

    User user = (User) authentication.getPrincipal();
    return todto(user);
    }


public User updateUser(UserDTO dto, Long id){
    User existUser = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with id :"+id));
    

    if(dto.getEmail() != null){
        existUser.setEmail(dto.getEmail());
    }
    if(dto.getUsername() != null){
        existUser.setUsername(dto.getUsername());
    }
    if(dto.getName() != null){
        existUser.setName(dto.getName());
    }
    if(dto.getPhone() != null){
        existUser.setPhone(dto.getPhone());
    }
    if(dto.getPassword() != null && !dto.getPassword().isBlank()){
        existUser.setPassword(passwordEncoder.encode(dto.getPassword()));
    }
    return userRepository.save(existUser);
}





public static UserDTO todto(User user){
    return UserDTO.builder()
        .id(user.getId())
        .name(user.getName())
        .email(user.getEmail())
        .password(user.getPassword())
        .phone(user.getPhone())
        .role(user.getRole())
        .username(user.getUsername())
        .build();
}

public static User toentity(UserDTO dto){
    return User.builder()
        .id(dto.getId())
        .name(dto.getName())
        .username(dto.getUsername())
        .email(dto.getEmail())
        .password(dto.getPassword())
        .role(dto.getRole() != null ? dto.getRole() : Role.USER)
        .phone(dto.getPhone())
        .build();
}
}
