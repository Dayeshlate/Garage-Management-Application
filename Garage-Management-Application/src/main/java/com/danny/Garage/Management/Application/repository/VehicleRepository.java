package com.danny.Garage.Management.Application.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.danny.Garage.Management.Application.entity.Vehicle;
import com.danny.Garage.Management.Application.entity.JobStatus;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    Optional<Vehicle> findById(Long id);

    boolean existsById(Long id);

    List<Vehicle> findByStatus(JobStatus status);

    List<Vehicle> findByvehicleType(String vehicleType);

    List<Vehicle> findByUserId(Long id);

}

