package com.danny.Garage.Management.Application.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String vehicleNumber;

    private String vehicleType;

    private String serviceType;

    @Enumerated(EnumType.STRING)
    private VehicleStatus vehicleStatus;

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
    
    @Column(nullable = false)
    private LocalDateTime arrivalTime;
    
    private LocalDateTime expectedTime;

    private LocalDateTime deliveryTime;
    
    @Column(nullable = false)
    private String ownerName;

    @JsonIgnore
    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "vehicle", fetch = FetchType.LAZY)
    private List<JobCard> jobCard;

    @PrePersist
    public void onCreate(){
        if(this.arrivalTime == null){
            this.arrivalTime = LocalDateTime.now();
        }
    }
}
