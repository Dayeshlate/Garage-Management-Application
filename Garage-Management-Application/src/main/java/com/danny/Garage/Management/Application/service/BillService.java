package com.danny.Garage.Management.Application.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.BillDTO;
import com.danny.Garage.Management.Application.dto.MechanicUpdateDTO;
import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.Bill;
import com.danny.Garage.Management.Application.entity.BillStatus;
import com.danny.Garage.Management.Application.entity.JobCard;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.repository.BillRepository;
import com.danny.Garage.Management.Application.repository.JobCardRepository;

import jakarta.transaction.Transactional;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final JobCardRepository jobCardRepository;
    private final UserService userService;
    private final VehicleService vehicleService;

    @Value("${billing.tax}")
    private BigDecimal tax;

    @Value("${billing.discount}")
    private BigDecimal discount;

    public BillService(BillRepository billRepository, VehicleService vehicleService, UserService userService,
            JobCardRepository jobCardRepository) {
        this.billRepository = billRepository;
        this.userService = userService;
        this.jobCardRepository = jobCardRepository;
        this.vehicleService = vehicleService;
    }

    public List<BillDTO> getPendingMechanicBills() {
        return billRepository
                .findByBillStatus(BillStatus.PENDING_MECHANIC)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public void updateMechanicAmount(MechanicUpdateDTO dto) {

        Bill bill = billRepository.findById(dto.getBillId())
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (bill.getBillStatus() != BillStatus.PENDING_MECHANIC) {
            throw new RuntimeException("Bill is not awaiting mechanic amount update");
        }

        if (dto.getMechanicAmount() == null ||
                dto.getMechanicAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Invalid mechanic amount");
        }

        bill.setMechanicAmount(dto.getMechanicAmount());

        BigDecimal spareAmount = bill.getSparePartAmount() != null
                ? bill.getSparePartAmount()
                : BigDecimal.ZERO;

        BigDecimal subtotal = spareAmount.add(dto.getMechanicAmount());

        BigDecimal taxAmount = subtotal.multiply(tax);
        BigDecimal discountAmount = subtotal.multiply(discount);

        BigDecimal total = subtotal
                .add(taxAmount)
                .subtract(discountAmount);

        bill.setTotalPayment(total);
        bill.setBillStatus(BillStatus.FINALIZED);
    }

    public List<BillDTO> getAllBill() {
        List<BillDTO> allBillDTOs = billRepository.findAll().stream().map(this::toDTO).toList();
        return allBillDTOs;
    }

    @Transactional
    public BillDTO updateBillStatus(Long billId, String rawStatus) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (rawStatus == null || rawStatus.isBlank()) {
            throw new RuntimeException("Bill status is required");
        }

        BillStatus status;
        try {
            status = BillStatus.valueOf(rawStatus.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Unsupported bill status: " + rawStatus);
        }

        bill.setBillStatus(status);
        Bill saved = billRepository.save(bill);
        return toDTO(saved);
    }

    public List<BillDTO> getAllBillForUser() {
        UserDTO user = userService.getCurrentUser();
        if (user == null) {
            return List.of();
        }
        List<BillDTO> billDTOs = billRepository.findByJobCardVehicleUserId(user.getId()).stream().map(this::toDTO)
                .toList();
        return billDTOs;
    }

    public BigDecimal getRevenue(Long days) {

        LocalDateTime date = LocalDateTime.now().minusDays(days);

        List<Bill> bills = billRepository
                .findByMechanicAmountIsNullAndBillDateAfter(date);

        BigDecimal revenue = bills.stream()
                .map(Bill::getTotalPayment)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return revenue;
    }

    public Long getTotalCountOfBillsForUser() {
        User user = userService.getCurrentUserObject();
        if (user == null) {
            return 0L;
        }
        return billRepository.countByJobCardVehicleUser(user);
    }

    public List<BillDTO> getAllBillsOfVehicle(Long id) {
        boolean exist = vehicleService.isPresent(id);
        boolean userVehicle = vehicleService.getAllUserVehicles().stream().anyMatch(vehicle -> vehicle.getId().equals(id));
        if (!exist) {
            throw new RuntimeException("Vehicle not found with id :" + id);
        }else if(!userVehicle){
            throw new RuntimeException("You cant get bill of this vehicle please contact us !");
        }
        List<Bill> allBills = billRepository.findByJobCardVehicleId(id);
        return allBills.stream().map(this::toDTO).toList();
    }

    public BillDTO toDTO(Bill entity) {
        BigDecimal spareAmount = entity.getSparePartAmount() != null
            ? entity.getSparePartAmount()
            : BigDecimal.ZERO;

        BigDecimal mechanicAmount = entity.getMechanicAmount() != null
            ? entity.getMechanicAmount()
            : BigDecimal.ZERO;

        BigDecimal subtotal = spareAmount.add(mechanicAmount);
        BigDecimal taxAmount = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;

        if (entity.getMechanicAmount() != null) {
            taxAmount = subtotal.multiply(tax);
            discountAmount = subtotal.multiply(discount);
        }

        String customerName = null;
        if (entity.getJobCard() != null && entity.getJobCard().getVehicle() != null) {
            var vehicle = entity.getJobCard().getVehicle();
            if (vehicle.getUser() != null && vehicle.getUser().getName() != null && !vehicle.getUser().getName().isBlank()) {
                customerName = vehicle.getUser().getName();
            } else {
                customerName = vehicle.getOwnerName();
            }
        }

        return BillDTO.builder()
                .id(entity.getId())
                .billDate(entity.getBillDate())
                .billStatus(entity.getBillStatus())
            .sparePartAmount(spareAmount)
                .mechanicAmount(entity.getMechanicAmount())
                .paymentMode(entity.getPaymentMode())
                .totalBill(entity.getTotalPayment())
            .subtotal(subtotal)
            .taxAmount(taxAmount)
            .discountAmount(discountAmount)
                .currency(entity.getCurrency())
                .customerName(customerName)
                .jobCard_id(entity.getJobCard() != null
                        ? entity.getJobCard().getId()
                        : null)
                .build();
    }

    public Bill toEntity(BillDTO dto) {

        JobCard jobCard = null;

        if (dto.getJobCard_id() != null) {
            jobCard = jobCardRepository.findById(dto.getJobCard_id())
                    .orElseThrow(() -> new RuntimeException("JobCard not found"));
        }

        return Bill.builder()
                .id(dto.getId())
                .billDate(dto.getBillDate())
                .sparePartAmount(dto.getSparePartAmount())
                .mechanicAmount(dto.getMechanicAmount())
                .paymentMode(dto.getPaymentMode())
                .billStatus(dto.getBillStatus())
                .totalPayment(dto.getTotalBill())
                .jobCard(jobCard)
                .build();
    }
}