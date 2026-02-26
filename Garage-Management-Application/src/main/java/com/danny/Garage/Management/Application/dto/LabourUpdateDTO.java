package com.danny.Garage.Management.Application.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabourUpdateDTO {
    private Long billId;
    private BigDecimal labourAmount;
}
