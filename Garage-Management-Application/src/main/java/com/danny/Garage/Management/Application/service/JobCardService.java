package com.danny.Garage.Management.Application.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.JobCardDTO;
import com.danny.Garage.Management.Application.dto.VehicleDTO;
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
    private VehicleService vehicleService;

    public JobCardService(SparePartRepository sparePartRepository, VehicleService vehicleService,
            JobCardRepository jobCardRepository, UserService userService) {
        this.jobCardRepository = jobCardRepository;
        this.sparePartRepository = sparePartRepository;
        this.vehicleService = vehicleService;
        this.userService = userService;
    }

    public JobCardDTO updateJobCard(JobCardDTO dto) {

        JobCard jobCard = jobCardRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("JobCard not found"));

        if (dto.getJobStatus() != null) {
            jobCard.setJobStatus(dto.getJobStatus());
        }

        if (dto.getSparePart_id() != null) {
            Set<SparePart> spareParts = sparePartRepository
                    .findAllById(dto.getSparePart_id())
                    .stream()
                    .collect(Collectors.toSet());

            jobCard.setSpareParts(spareParts);
        }

        if (jobCard.getJobStatus() == JobStatus.COMPLETED
                && jobCard.getBill() == null) {

            Bill bill = new Bill();
            bill.setJobCard(jobCard);

            BigDecimal spareTotal = jobCard.getSpareParts()
                    .stream()
                    .map(SparePart::getPartPrice)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            bill.setSparePartAmount(spareTotal);
            bill.setLabourAmount(null);
            bill.setTotalPayment(spareTotal);
            bill.setBillDate(LocalDateTime.now());
            bill.setBillStatus(BillStatus.PENDING_LABOUR);

            jobCard.setBill(bill);
        }

        JobCard saved = jobCardRepository.save(jobCard);
        return toDto(saved);
    }

    public Long getAllJobCardsCount() {
        Long allJobCards = (long) jobCardRepository.findByJobStatusNot(JobStatus.DELIVERED).size();
        return allJobCards;
    }

    public List<JobCardDTO> getAllActiveJobCardForUser() {
        Long id = userService.getCurrentUser().getId();
        List<JobCard> alljobcards = jobCardRepository.findByVehicleUserIdAndJobStatusNot(id, JobStatus.DELIVERED);
        return alljobcards.stream().map(this::toDto).toList();
    }

    public Long getAllActiveServicesForUser() {
        Long currentUserId = userService.getCurrentUserObject().getId();
        return jobCardRepository.countByUserIdAndJobStatusNot(currentUserId, JobStatus.DELIVERED);
    }

    public List<JobCardDTO> getAllByStatus(JobStatus status) {
        List<JobCard> jobCards = jobCardRepository.findByJobStatusNot(status);

        return jobCards.stream()
                .map(this::toDto).toList();
    }

    public List<JobCardDTO> getAllJobCards() {
        List<JobCard> allJobCards = jobCardRepository.findByJobStatusNot(JobStatus.DELIVERED);
        return allJobCards.stream().map(this::toDto).toList();
    }

    public Long getLastDateActiveJobcardCount(Long days) {
        LocalDateTime date = LocalDateTime.now().minusDays(days);
        return (long) jobCardRepository.findByOnCreateAfterAndJobStatusNot(date, JobStatus.COMPLETED).size();
    }

    public List<JobCardDTO> getLastDateActiveJobcard(Long days) {
        LocalDateTime date = LocalDateTime.now().minusDays(days);
        return jobCardRepository.findByOnCreateAfterAndJobStatusNot(date, JobStatus.COMPLETED).stream().map(this::toDto)
                .toList();
    }

    public JobCard toEntity(JobCardDTO dto, Vehicle vehicle, Set<SparePart> spareParts) {
        return JobCard.builder()
                .id(dto.getId())
                .vehicle(vehicle)
                .jobStatus(dto.getJobStatus())
                .spareParts(spareParts)
                .build();
    }

    public JobCardDTO toDto(JobCard entity) {
        return JobCardDTO.builder()
                .id(entity.getId())
                .Vehicle_id(entity.getVehicle().getId())
                .JobStatus(entity.getJobStatus())
                .SparePart_id(
                        entity.getSpareParts()
                                .stream()
                                .map(SparePart::getId)
                                .collect(Collectors.toSet()))
                .build();
    }
}
