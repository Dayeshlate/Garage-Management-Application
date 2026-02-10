package com.danny.Garage.Management.Application.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.Role;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.entity.Vehicle;
import com.danny.Garage.Management.Application.repository.UserRepository;
import com.danny.Garage.Management.Application.repository.VehicleRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VehicleRepository vehicleRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            VehicleRepository vehicleRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.vehicleRepository = vehicleRepository;
    }

    public User saveUser(UserDTO dto) {
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));

        if (dto.getRole() == null) {
            dto.setRole(Role.USER);
        }

        User user = toEntity(dto, null);
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public UserDTO getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        User user = (User) authentication.getPrincipal();
        return toDto(user, null);
    }

    // UPDATE USER
    public User updateUser(UserDTO dto, Long id) {

        User existUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + id));

        if (dto.getEmail() != null) existUser.setEmail(dto.getEmail());
        if (dto.getUsername() != null) existUser.setUsername(dto.getUsername());
        if (dto.getName() != null) existUser.setName(dto.getName());
        if (dto.getPhone() != null) existUser.setPhone(dto.getPhone());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return userRepository.save(existUser);
    }

    public List<Vehicle> getAllVehicle(User currentUser) {
        return vehicleRepository.findByUserId(currentUser.getId());
    }

    public UserDTO toDto(User user, List<Long> vehicleIds) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .vehicle_ids(vehicleIds)
                .username(user.getUsername())
                .build();
    }

    private User toEntity(UserDTO dto, List<Vehicle> vehicles) {
        return User.builder()
                .id(dto.getId())
                .name(dto.getName())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .vehicle(vehicles)
                .role(dto.getRole() != null ? dto.getRole() : Role.USER)
                .phone(dto.getPhone())
                .build();
    }
}
