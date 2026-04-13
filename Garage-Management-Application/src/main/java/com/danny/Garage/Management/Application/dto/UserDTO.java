package com.danny.Garage.Management.Application.dto;

import java.util.List;
import com.danny.Garage.Management.Application.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserDTO{
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max=40)
    private String name;

    @NotBlank(message = "Password is not blank")
    private String password;

    @NotBlank(message = "mail is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Role not blank")
    private Role role;

    @NotBlank(message = "Phone number is required")
    @Size(max=10, min=10)
    private String phone;

    private List<Long> vehicle_ids;

    private String currency;

    private Integer taxRate;
} 