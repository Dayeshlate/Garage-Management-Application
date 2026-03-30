package com.danny.Garage.Management.Application.dto;

import java.time.LocalDateTime;

import com.danny.Garage.Management.Application.entity.VehicleStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class VehicleDTO {
    
    private Long id;
    private String vehicleNumber;
    private String vehicleType;
    private String serviceType;
    private String brand;
    private String model;
    private VehicleStatus vehicleStatus;
    private String problemDescription;
    private String solutionDescription;
    private LocalDateTime arrivalTime;
    private LocalDateTime expectedTime;
    private LocalDateTime deliveryTime;
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;
    private String userEmail;
}
