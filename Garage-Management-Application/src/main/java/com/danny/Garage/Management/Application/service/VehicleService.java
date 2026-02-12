package com.danny.Garage.Management.Application.service;

import java.util.List;

import org.springframework.boot.data.autoconfigure.web.DataWebProperties.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.VehicleDTO;
import com.danny.Garage.Management.Application.entity.JobStatus;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.entity.Vehicle;
import com.danny.Garage.Management.Application.repository.VehicleRepository;

@Service
public class VehicleService {

    private VehicleRepository vehicleRepository;
    private final UserService userService;

    public VehicleService(VehicleRepository vehicleRepository, UserService userService){
        this.vehicleRepository = vehicleRepository;
        this.userService = userService;
    }

    public VehicleDTO createVehicle(VehicleDTO dto){
        Vehicle vehicle=toEntity(dto);
        User user = userService.getCurrentUserObject();
        vehicle.setUser(user);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return toDTO(savedVehicle);
    }


    public List<VehicleDTO> getAllVehicles(){
        PageRequest pageRequest = PageRequest.of(0, 15,Sort.by(Sort.Direction.DESC, "arrivalTime"));

        return vehicleRepository.findAll(pageRequest)
                    .getContent()
                    .stream()
                    .map(this::toDTO)
                    .toList();
    }

    public List<VehicleDTO> getAllUserVehicles(Long id){
        return vehicleRepository.findByUserId(id).stream().map(this::toDTO).toList();
    }

    public Vehicle getVehicleByNumber(String vehicleNumber){
        return  vehicleRepository.findByVehicleNumber(vehicleNumber)
                .orElseThrow(()-> new RuntimeException("Vehicle Not found having number "+vehicleNumber));
    }

    public List<VehicleDTO> getVehicleByStatus(JobStatus status){
        return vehicleRepository.findDistinctByJobCard_Status(status).stream().map(this::toDTO).toList();
    }


    public Vehicle toEntity(VehicleDTO dto){
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

    public VehicleDTO toDTO(Vehicle entity){
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
