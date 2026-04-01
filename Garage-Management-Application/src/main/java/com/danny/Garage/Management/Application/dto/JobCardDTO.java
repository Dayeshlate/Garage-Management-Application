package com.danny.Garage.Management.Application.dto;

import java.util.Set;

import com.danny.Garage.Management.Application.entity.JobStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class JobCardDTO {
    
    private Long id;

    private JobStatus JobStatus;

    private Long Vehicle_id;
    private String vehicleNumber;
    private String vehicleBrand;
    private String vehicleModel;
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;

    private Set<Long> SparePart_id;

    private Double mechanicCharge;
}
