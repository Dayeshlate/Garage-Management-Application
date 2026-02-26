package com.danny.Garage.Management.Application.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.danny.Garage.Management.Application.entity.Vehicle;
import com.danny.Garage.Management.Application.entity.JobStatus;
import java.time.LocalDateTime;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    Optional<Vehicle> findById(Long id);

    boolean existsById(Long id);

    List<Vehicle> findByvehicleType(String vehicleType);

    List<Vehicle> findByUserId(Long id);

    List<Vehicle> findDistinctByJobCard_JobStatus(JobStatus status);

    List<Vehicle> findByJobCardJobStatus(JobStatus status);

    List<Vehicle> findByDeliveryTimeAfter(LocalDateTime deliveryTime);
}

