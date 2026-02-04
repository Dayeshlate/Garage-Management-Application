package com.danny.Garage.Management.Application.dto;

import java.util.List;

import com.danny.Garage.Management.Application.entity.JobStatus;

public class JobCardDTO {
    
    private Long id;

    private JobStatus JobStatus;

    private Long Vehicle_id;

    private List<Long> SparePart_id;
}
