package com.danny.Garage.Management.Application.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "vehicles")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Vehicle {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String vehicleNumber;

    private String vehicleType;

    private String serviceType;

    @Column(nullable = false)
    private String brand;
    
    @Column(nullable = false)
    private String model;
    
    @Column(nullable = false)
    @Size(min = 10)
    private String problemDescription;
    
    @Column(nullable = false)
    @Size(min = 10)
    private String solutionDescription;
    
    private LocalDateTime arrivalTime;
    
    private LocalDateTime expectedTime;

    private LocalDateTime deliveryTime;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;
    
    @Column(nullable = false)
    private String ownerName;

    @PrePersist
    public void onCreate(){
        if(this.arrivalTime == null){
            this.arrivalTime = LocalDateTime.now();
        }
    }
}
