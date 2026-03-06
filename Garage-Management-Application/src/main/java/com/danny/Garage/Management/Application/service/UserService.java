package com.danny.Garage.Management.Application.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    public User findByEmail(String email){
        return userRepository.findByEmail(email).
            orElseThrow(()-> new RuntimeException("User not found with email"+ email));
    }

    public UserDTO getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        User user = (User) authentication.getPrincipal();
        return toDto(user);
    }

    public User getCurrentUserObject() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        User user = (User) authentication.getPrincipal();
        return user;
    }

    public User updateUser(UserDTO dto, Long id) {

        User existUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (dto.getEmail() != null)
            existUser.setEmail(dto.getEmail());
        if (dto.getName() != null)
            existUser.setName(dto.getName());
        if (dto.getPhone() != null)
            existUser.setPhone(dto.getPhone());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return userRepository.save(existUser);
    }

    public List<Vehicle> getAllVehicle(User currentUser) {
        return vehicleRepository.findByUserId(currentUser.getId());
    }

    private List<Long> getVehicleIdsForUser(User user) {

        return vehicleRepository.findByUserId(user.getId())
                .stream()
                .map(Vehicle::getId)
                .toList();
    }

    public Long getCountOfRegisterUser(Long days){
        LocalDateTime date = LocalDateTime.now().minusDays(days);
        return (long) userRepository.findByCreatedAtAfter(date).size();
        }

    public Long getTotalUser(){
        return userRepository.count();
    }

    public List<UserDTO> getAllCustemors(){
        List<UserDTO> users = userRepository.findByRoleNot(Role.ADMIN).stream().map(this::toDto).toList();
        return users;
    }

    public UserDTO toDto(User user) {
    return UserDTO.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole())
            .vehicle_ids(getVehicleIdsForUser(user))
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
