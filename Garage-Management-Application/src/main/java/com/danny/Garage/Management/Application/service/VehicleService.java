package com.danny.Garage.Management.Application.service;

import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.VehicleDTO;
import com.danny.Garage.Management.Application.entity.Vehicle;
import com.danny.Garage.Management.Application.repository.VehicleRepository;

@Service
public class VehicleService {

    private VehicleRepository vehicleRpository;


    public static Vehicle toEntity(VehicleDTO dto){
        return Vehicle.builder()
            .id(dto.getId())
            .vehicleNumber(dto.getVehicleNumber())
            .vehicleType(dto.getVehicleType())
            .serviceType(dto.getServiceType())
            .brand(dto.getBrand())
            .model(dto.getModel())
            .problemDescription(dto.getProblemDescription())
            .solutionDescription(dto.getSolutionDescription())
            .arrivalTime(dto.getArrivalTime())
            .expectedTime(dto.getExpectedTime())
            .deliveryTime(dto.getDeliveryTime())
            .ownerName(dto.getOwnerName())
            .build();

    }

    public static VehicleDTO toDTO(Vehicle entity){
        return VehicleDTO.builder()
            .id(entity.getId())
            .vehicleNumber(entity.getVehicleNumber())
            .vehicleType(entity.getVehicleType())
            .serviceType(entity.getServiceType())
            .brand(entity.getBrand())
            .model(entity.getModel())
            .problemDescription(entity.getProblemDescription())
            .solutionDescription(entity.getSolutionDescription())
            .arrivalTime(entity.getArrivalTime())
            .expectedTime(entity.getExpectedTime())
            .deliveryTime(entity.getDeliveryTime())
            .ownerName(entity.getOwnerName())
            .build();
    }
}
