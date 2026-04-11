package com.danny.Garage.Management.Application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.danny.Garage.Management.Application.entity.BillStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class BillDTO {
    private Long id;

    private LocalDateTime billDate;

    private BigDecimal mechanicAmount;

    private String paymentMode;

    private BigDecimal totalBill;

    private BillStatus billStatus;

    private Long jobCard_id;

    private BigDecimal sparePartAmount;

    private BigDecimal subtotal;

    private BigDecimal taxAmount;

    private BigDecimal discountAmount;

    private String currency;

    private String customerName;

    private String vehicleNumber;

    private String vehicleBrand;

    private String vehicleModel;

}
