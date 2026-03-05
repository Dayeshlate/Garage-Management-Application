package com.danny.Garage.Management.Application.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.BillDTO;
import com.danny.Garage.Management.Application.dto.LabourUpdateDTO;
import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.entity.Bill;
import com.danny.Garage.Management.Application.entity.BillStatus;
import com.danny.Garage.Management.Application.entity.JobCard;
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

    public List<BillDTO> getPendingLabourBills() {
        return billRepository
                .findByBillStatus(BillStatus.PENDING_LABOUR)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public void updateLabourAmount(LabourUpdateDTO dto) {

        Bill bill = billRepository.findById(dto.getBillId())
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (bill.getBillStatus() != BillStatus.PENDING_LABOUR) {
            throw new RuntimeException("Bill is not awaiting labour update");
        }

        if (dto.getLabourAmount() == null ||
                dto.getLabourAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Invalid labour amount");
        }

        bill.setLabourAmount(dto.getLabourAmount());

        BigDecimal spareAmount = bill.getSparePartAmount() != null
                ? bill.getSparePartAmount()
                : BigDecimal.ZERO;

        BigDecimal subtotal = spareAmount.add(dto.getLabourAmount());

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

    public List<BillDTO> getAllBillForUser() {
        UserDTO user = userService.getCurrentUser();
        List<BillDTO> billDTOs = billRepository.findByJobCardVehicleUserId(user.getId()).stream().map(this::toDTO)
                .toList();
        return billDTOs;
    }

    public BigDecimal getRevenue(Long days) {

        LocalDateTime date = LocalDateTime.now().minusDays(days);

        List<Bill> bills = billRepository
                .findByLabourAmountIsNullAndBillDateAfter(date);

        BigDecimal revenue = bills.stream()
                .map(Bill::getTotalPayment)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return revenue;
    }

    public Long getTotalCountOfBillsForUser() {
        return billRepository.countByJobCardVehicleUser(userService.getCurrentUserObject());
    }

    public List<BillDTO> getAllBillsOfVehicle(Long id) {
        boolean exist = vehicleService.isPresent(id);
        if (!exist) {
            throw new RuntimeException("Vehicle not found with id :" + id);
        }
        List<Bill> allBills = billRepository.findByJobCardVehicleId(id);
        return allBills.stream().map(this::toDTO).toList();
    }

    public BillDTO toDTO(Bill entity) {
        return BillDTO.builder()
                .id(entity.getId())
                .billDate(entity.getBillDate())
                .billStatus(entity.getBillStatus())
                .sparePartAmount(entity.getSparePartAmount())
                .labourAmount(entity.getLabourAmount())
                .paymentMode(entity.getPaymentMode())
                .totalBill(entity.getTotalPayment())
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
                .labourAmount(dto.getLabourAmount())
                .paymentMode(dto.getPaymentMode())
                .billStatus(dto.getBillStatus())
                .totalPayment(dto.getTotalBill())
                .jobCard(jobCard)
                .build();
    }
}