package com.danny.Garage.Management.Application.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danny.Garage.Management.Application.dto.JobCardDTO;
import com.danny.Garage.Management.Application.service.JobCardService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/user/jobCard")
public class JobCardController {
    
    private JobCardService jobCardService;

    public JobCardController(JobCardService jobCardService){
        this.jobCardService = jobCardService;
    }

    @GetMapping("/Active_count")
    public ResponseEntity<Long> getAllActiveServiceCount() {
        Long count = jobCardService.getAllJobCardsCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/Active_Services")
    public ResponseEntity<List<JobCardDTO>> getAllActiveJobCards() {
        List<JobCardDTO> allJobCardDTOs = jobCardService.getAllActiveJobCardForUser();
        return ResponseEntity.ok(allJobCardDTOs);
    }

    
    
}
