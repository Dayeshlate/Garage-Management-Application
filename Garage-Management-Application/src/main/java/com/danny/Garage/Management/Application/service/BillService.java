package com.danny.Garage.Management.Application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.BillDTO;
import com.danny.Garage.Management.Application.dto.LabourUpdateDTO;
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

    public BillService(BillRepository billRepository,
                       JobCardRepository jobCardRepository) {
        this.billRepository = billRepository;
        this.jobCardRepository = jobCardRepository;
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

        if (dto.getLabourAmount() == null || dto.getLabourAmount() < 0) {
            throw new RuntimeException("Invalid labour amount");
        }

        bill.setLabourAmount(dto.getLabourAmount());

        double spareAmount = bill.getSparePartAmount() != null
                ? bill.getSparePartAmount()
                : 0.0;

        double total = spareAmount + dto.getLabourAmount();

        bill.setTotalPayment(total);
        bill.setBillStatus(BillStatus.FINALIZED);

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