package com.danny.Garage.Management.Application.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.danny.Garage.Management.Application.dto.VehicleDTO;
import com.danny.Garage.Management.Application.entity.JobStatus;
import com.danny.Garage.Management.Application.service.VehicleService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("user/vehicle")
public class VehicleController {

    private final VehicleService vehicleService;
    
    public VehicleController(VehicleService vehicleService){
        this.vehicleService = vehicleService;
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<List<VehicleDTO>> getMethodName(@PathVariable Long id) {
        List<VehicleDTO> vehicles = vehicleService.getAllUserVehicles(id);
        return ResponseEntity.ok(vehicles);
    }

    @PostMapping("/create")
    public ResponseEntity<VehicleDTO> createVehicle(@RequestBody VehicleDTO dto) {
        VehicleDTO vehicleDTO = vehicleService.createVehicleByUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleDTO);
    }
    
    
    @GetMapping("/getByStatus")
    public ResponseEntity<List<VehicleDTO>> getByStatus(@RequestParam JobStatus status) {
        List<VehicleDTO> vehicles =  vehicleService.getVehicleByStatus(status);
        return ResponseEntity.ok(vehicles);
   }
    
}
