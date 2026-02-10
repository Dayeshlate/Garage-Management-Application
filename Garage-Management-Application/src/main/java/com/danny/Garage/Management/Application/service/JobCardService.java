package com.danny.Garage.Management.Application.service;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.JobCardDTO;
import com.danny.Garage.Management.Application.entity.JobCard;
import com.danny.Garage.Management.Application.entity.SparePart;
import com.danny.Garage.Management.Application.entity.Vehicle;
import com.danny.Garage.Management.Application.repository.JobCardRepository;
import com.danny.Garage.Management.Application.repository.SparePartRepository;

@Service
public class JobCardService {
    private SparePartRepository sparePartRepository;
    private JobCardRepository jobCardRepository;

    public JobCardService(SparePartRepository sparePartRepository , JobCardRepository jobCardRepository){
        this.jobCardRepository = jobCardRepository;
        this.sparePartRepository = sparePartRepository;
    }


   
    

    public JobCard toEntity(JobCardDTO dto, Vehicle vehicle,Set<SparePart> spareParts){
        return JobCard.builder()
            .id(dto.getId())
            .vehicle(vehicle)
            .status(dto.getJobStatus())
            .spareParts(spareParts)
            .build();
    }

    public JobCardDTO toDto(JobCard entity, Long vehicle_id, Set<Long> spareParts_id){
        return JobCardDTO.builder()
            .id(entity.getId())
            .Vehicle_id(vehicle_id)
            .JobStatus(entity.getStatus())
            .SparePart_id(spareParts_id)
            .build();
    }
}
