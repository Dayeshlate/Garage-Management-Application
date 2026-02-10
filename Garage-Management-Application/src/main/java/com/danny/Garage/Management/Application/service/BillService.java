package com.danny.Garage.Management.Application.service;

import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.BillDTO;
import com.danny.Garage.Management.Application.entity.Bill;
import com.danny.Garage.Management.Application.entity.JobCard;
import com.danny.Garage.Management.Application.repository.BillRepository;
import com.danny.Garage.Management.Application.repository.JobCardRepository;

@Service
public class BillService {
    private BillRepository billRepository;
    private JobCardRepository jobCardReository;

    public Bill toEntity(BillDTO dto, JobCard jobCard){
        return Bill.builder()
            .id(dto.getId())
            .billDate(dto.getBillDate())
            .labourAmount(dto.getLabourAmount())
            .paymentMode(dto.getPaymentMode())
            .totalPayment(dto.getTotalBill())
            .jobCard(jobCard)
            .build();
    }

    public BillDTO toDTO(Bill entity, Long id){
        return BillDTO.builder()
            .id(entity.getId())
            .billDate(entity.getBillDate())
            .labourAmount(entity.getLabourAmount())
            .paymentMode(entity.getPaymentMode())
            .totalBill(entity.getTotalPayment())
            .jobCard_id(id)
            .build();
    }
}
