package com.danny.Garage.Management.Application.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.JobCardDTO;
import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.Bill;
import com.danny.Garage.Management.Application.entity.BillStatus;
import com.danny.Garage.Management.Application.entity.JobCard;
import com.danny.Garage.Management.Application.entity.JobStatus;
import com.danny.Garage.Management.Application.entity.SparePart;
import com.danny.Garage.Management.Application.entity.Vehicle;
import com.danny.Garage.Management.Application.repository.BillRepository;
import com.danny.Garage.Management.Application.repository.JobCardRepository;
import com.danny.Garage.Management.Application.repository.SparePartRepository;

import jakarta.transaction.Transactional;

@Service
public class JobCardService {

    private SparePartRepository sparePartRepository;
    private JobCardRepository jobCardRepository;
    private BillRepository billRepository;
    private UserService userService;

    @Value("${billing.tax}")
    private BigDecimal tax;

    @Value("${billing.discount}")
    private BigDecimal discount;

    public JobCardService(SparePartRepository sparePartRepository, VehicleService vehicleService,
            JobCardRepository jobCardRepository, UserService userService, BillRepository billRepository) {
        this.jobCardRepository = jobCardRepository;
        this.sparePartRepository = sparePartRepository;
        this.userService = userService;
        this.billRepository = billRepository;
    }

    @Transactional
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

    if (dto.getMechanicCharge() != null) {
        if (dto.getMechanicCharge() < 0) {
            throw new RuntimeException("Mechanic amount cannot be negative");
        }
        jobCard.setMechanicCharge(BigDecimal.valueOf(dto.getMechanicCharge()));
    }

    if (jobCard.getJobStatus() == JobStatus.COMPLETED
            && jobCard.getBill() == null) {

        for (SparePart sparePart : jobCard.getSpareParts()) {

            if (sparePart.getPartStock() <= 0) {
                throw new RuntimeException(
                        "Stock not available for part: "
                                + sparePart.getPartName());
            }

            sparePart.setPartStock(
                    sparePart.getPartStock() - 1
            );
        }
        Bill bill = new Bill();
        bill.setJobCard(jobCard);

        BigDecimal spareTotal = jobCard.getSpareParts()
                .stream()
                .map(SparePart::getPartPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        bill.setSparePartAmount(spareTotal);
        bill.setMechanicAmount(null);
        bill.setTotalPayment(spareTotal);
        bill.setBillDate(LocalDateTime.now());
        bill.setBillStatus(BillStatus.PENDING_MECHANIC);
        
        // Set the currency from the vehicle owner's settings
        if (jobCard.getVehicle() != null && jobCard.getVehicle().getUser() != null) {
            String userCurrency = jobCard.getVehicle().getUser().getCurrency();
            bill.setCurrency(userCurrency != null ? userCurrency : "USD");
        } else {
            bill.setCurrency("USD");
        }

        billRepository.save(bill);
        jobCard.setBill(bill);
    }

    if (jobCard.getBill() != null) {
        syncBillWithMechanicAmount(jobCard);
    }

    JobCard saved = jobCardRepository.save(jobCard);
    return toDto(saved);
}

    private void syncBillWithMechanicAmount(JobCard jobCard) {
        Bill bill = jobCard.getBill();
        if (bill == null) {
            return;
        }

        BigDecimal spareAmount = jobCard.getSpareParts()
                .stream()
                .map(SparePart::getPartPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        bill.setSparePartAmount(spareAmount);
        BigDecimal mechanicAmount = jobCard.getMechanicCharge();

        if (mechanicAmount == null) {
            bill.setMechanicAmount(null);
            bill.setTotalPayment(spareAmount);
            bill.setBillStatus(BillStatus.PENDING_MECHANIC);
            return;
        }

        bill.setMechanicAmount(mechanicAmount);

        BigDecimal subtotal = spareAmount.add(mechanicAmount);
        BigDecimal taxAmount = subtotal.multiply(tax);
        BigDecimal discountAmount = subtotal.multiply(discount);
        BigDecimal total = subtotal.add(taxAmount).subtract(discountAmount);

        bill.setTotalPayment(total);
        if (bill.getBillStatus() != BillStatus.PAID) {
            bill.setBillStatus(BillStatus.FINALIZED);
        }
    }

    public Long getAllJobCardsCount() {
        Long allJobCards = (long) jobCardRepository.findByJobStatusNot(JobStatus.DELIVERED).size();
        return allJobCards;
    }

    public List<JobCardDTO> getAllActiveJobCardForUser() {
        UserDTO user = userService.getCurrentUser();
        if (user == null) {
            return List.of();
        }
        List<JobCard> alljobcards = jobCardRepository.findByVehicleUserIdAndJobStatusNot(user.getId(), JobStatus.DELIVERED);
        return alljobcards.stream().map(this::toDto).toList();
    }

    public Long getActiveJobCardCountForUser(){
        UserDTO user = userService.getCurrentUser();
        if (user == null) {
            return 0L;
        }
        Long count = jobCardRepository.countByUserIdAndJobStatusNot(user.getId(), JobStatus.DELIVERED);
        return count;
    }

    public Long getAllActiveServicesForUser() {
        Long currentUserId = userService.getCurrentUserObject().getId();
        return jobCardRepository.countByUserIdAndJobStatusNot(currentUserId, JobStatus.DELIVERED);
    }

    public List<JobCardDTO> getAllByStatus(JobStatus status) {
        List<JobCard> jobCards = jobCardRepository.findByJobStatus(status);

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
        Vehicle vehicle = entity.getVehicle();
        return JobCardDTO.builder()
                .id(entity.getId())
                .Vehicle_id(vehicle.getId())
                .vehicleNumber(vehicle.getVehicleNumber())
                .vehicleBrand(vehicle.getBrand())
                .vehicleModel(vehicle.getModel())
                .ownerName(vehicle.getOwnerName())
                .ownerPhone(vehicle.getOwnerPhone())
                .ownerEmail(vehicle.getOwnerEmail())
                .JobStatus(entity.getJobStatus())
                .mechanicCharge(entity.getMechanicCharge() != null ? entity.getMechanicCharge().doubleValue() : 0.0)
                .SparePart_id(
                        entity.getSpareParts()
                                .stream()
                                .map(SparePart::getId)
                                .collect(Collectors.toSet()))
            .sparePartNames(
                entity.getSpareParts()
                    .stream()
                    .map(SparePart::getPartName)
                    .collect(Collectors.toSet()))
                .build();
    }
}
