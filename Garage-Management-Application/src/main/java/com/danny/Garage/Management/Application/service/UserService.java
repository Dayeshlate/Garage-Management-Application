package com.danny.Garage.Management.Application.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationManager;

import com.danny.Garage.Management.Application.dto.AuthDTO;
import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.Role;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.entity.Vehicle;
import com.danny.Garage.Management.Application.repository.UserRepository;
import com.danny.Garage.Management.Application.repository.VehicleRepository;
import com.danny.Garage.Management.Application.utils.JwtUtils;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VehicleRepository vehicleRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Value("${EMAIL_URL}")
    private String activationUrl;

    public UserService(
            UserRepository userRepository,
            EmailService emailService,
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils,
            PasswordEncoder passwordEncoder,
            VehicleRepository vehicleRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.vehicleRepository = vehicleRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public User saveUser(UserDTO dto) {
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));

        if (dto.getRole() == null) {
            dto.setRole(Role.USER);
        }

        User user = toEntity(dto, null);
        user.setActivationToken(UUID.randomUUID().toString());
        String activationLink = activationUrl+"/api/auth/activate?activationToken=" + user.getActivationToken();
        String subject = "Activate your garage management application";
        String body = "Click on the following link to activate your account: " + activationLink;

        emailService.sendEmail(user.getEmail(), subject, body);
        return userRepository.save(user);
    }

    public boolean activateProfile(String activationToken) {
        return userRepository.findByActivationToken(activationToken)
                .map(profile -> {
                    profile.setIsActive(true);
                    userRepository.save(profile);
                    return true;
                })
                .orElse(false);
    }

    public boolean isAccountActive(String email) {
        return userRepository.findByEmail(email)
                .map(User::getIsActive)
                .orElse(false);
    }

    public Map<String, Object> authenticationAndGenerateToken(AuthDTO authDTO) {

    try {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authDTO.getEmail(),
                        authDTO.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(authDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtils.generateToken(user);

        return Map.of(
                "token", token,
                "user", toDto(user)
        );

    } catch (Exception e) {
        throw new RuntimeException("Invalid email or password");
    }
}

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
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
            .build();
    }

    private User toEntity(UserDTO dto, List<Vehicle> vehicles) {
        return User.builder()
                .id(dto.getId())
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .vehicle(vehicles)
                .role(dto.getRole() != null ? dto.getRole() : Role.USER)
                .phone(dto.getPhone())
                .build();
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
