package com.danny.Garage.Management.Application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDTO{
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max=40)
    private String name;

    @NotBlank(message = "Username not blank")
    @Size(max = 20, min=2)
    private String username;

    @NotBlank(message = "Password is not blank")
    private String password;

    @NotBlank(message = "mail is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Role not blank")
    private String role;

    @NotBlank(message = "Phone number is required")
    @Size(max = 10, min=10)
    private String phone;
} 