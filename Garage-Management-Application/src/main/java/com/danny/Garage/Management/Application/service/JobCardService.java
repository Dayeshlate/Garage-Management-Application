package com.danny.Garage.Management.Application.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.JobCardDTO;
import com.danny.Garage.Management.Application.entity.Bill;
import com.danny.Garage.Management.Application.entity.BillStatus;
import com.danny.Garage.Management.Application.entity.JobCard;
import com.danny.Garage.Management.Application.entity.JobStatus;
import com.danny.Garage.Management.Application.entity.SparePart;
import com.danny.Garage.Management.Application.entity.Vehicle;
import com.danny.Garage.Management.Application.repository.JobCardRepository;
import com.danny.Garage.Management.Application.repository.SparePartRepository;

@Service
public class JobCardService {
    private SparePartRepository sparePartRepository;
    private JobCardRepository jobCardRepository;
    private UserService userService;
    private JobCardService jobCardService;

    public JobCardService(SparePartRepository sparePartRepository ,JobCardService jobCardService, JobCardRepository jobCardRepository,UserService userService){
        this.jobCardRepository = jobCardRepository;
        this.jobCardService =jobCardService;
        this.sparePartRepository = sparePartRepository;
        this.userService = userService;
    }

    public JobCardDTO updateJobCard(JobCardDTO dto) {
    JobCard jobCard = jobCardRepository.findById(dto.getId())
            .orElseThrow(() -> new RuntimeException("JobCard not found"));
    if (dto.getJobStatus() == JobStatus.COMPLETED
        && jobCard.getBill() == null) {

    Bill bill = new Bill();

    bill.setJobCard(jobCard);

    double spareTotal = jobCard.getSpareParts()
            .stream()
            .mapToDouble(SparePart::getPartPrice)
            .sum();

    bill.setSparePartAmount(spareTotal);
    bill.setLabourAmount(null);
    bill.setTotalPayment(spareTotal); 
    bill.setBillDate(LocalDateTime.now());
    bill.setBillStatus(BillStatus.PENDING_LABOUR);

    jobCard.setBill(bill);
}
    if (dto.getSparePart_id() != null) {
        Set<SparePart> spareParts = sparePartRepository
                .findAllById(dto.getSparePart_id())
                .stream()
                .collect(Collectors.toSet());

        jobCard.setSpareParts(spareParts);
    }
    JobCard saved = jobCardRepository.save(jobCard);
    return toDto(saved);
    }

    public Long getAllJobCardsCount(){
        Long allJobCards = (long) jobCardRepository.findByStatusNot(JobStatus.DELIVERED).size();
        return allJobCards;
    }

    public List<JobCardDTO> getAllActiveJobCardForUser(){
        Long id = userService.getCurrentUser().getId();
        List<JobCard> alljobcards = jobCardRepository.findByVehicleUserIdAndStatusNot(id,JobStatus.DELIVERED);
        return alljobcards.stream().map(this::toDto).toList();
    }
    
    public Long getAllActiveServicesForUser(){
        Long currentUserId = userService.getCurrentUserObject().getId();
        return jobCardRepository.countByUserIdAndStatusNot(currentUserId, JobStatus.DELIVERED);
    }

    public List<JobCardDTO> getAllByStatus(JobStatus status){
        List<JobCard> jobCards = jobCardRepository.findByStatusNot(status);

        return jobCards.stream()
                .map(this::toDto).toList();
    }

    public List<JobCardDTO> getAllJobCards(){
        List<JobCard> allJobCards = jobCardRepository.findByStatusNot(JobStatus.DELIVERED);
        return allJobCards.stream().map(this::toDto).toList();
    }

    public Long getLastDateActiveJobcardCount(Long days){
        LocalDateTime date = LocalDateTime.now().minusDays(days);
        return (long) jobCardRepository.findByOnCreateAfterAndJobStatusisNot(date,JobStatus.COMPLETED).size();
    }
    

    public JobCard toEntity(JobCardDTO dto, Vehicle vehicle,Set<SparePart> spareParts){
        return JobCard.builder()
            .id(dto.getId())
            .vehicle(vehicle)
            .status(dto.getJobStatus())
            .spareParts(spareParts)
            .build();
    }

    public JobCardDTO toDto(JobCard entity) {
    return JobCardDTO.builder()
            .id(entity.getId())
            .Vehicle_id(entity.getVehicle().getId())
            .JobStatus(entity.getStatus())
            .SparePart_id(
                    entity.getSpareParts()
                            .stream()
                            .map(SparePart::getId)
                            .collect(Collectors.toSet())
            )
            .build();
}
}
