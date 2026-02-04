package com.danny.Garage.Management.Application.dto;

import java.time.LocalDateTime;

public class BillDTO {
    private Long id;

    private LocalDateTime billDate;

    private Long labourAmount;

    private String paymentMode;

    private Double totalBill;

    private Long jobCard_id;

}
