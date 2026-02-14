package com.danny.Garage.Management.Application.dto;

import java.time.LocalDateTime;
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
    private String problemDescription;
    private String solutionDescription;
    private LocalDateTime arrivalTime;
    private LocalDateTime expectedTime;
    private LocalDateTime deliveryTime;
    private String ownerName;
}
