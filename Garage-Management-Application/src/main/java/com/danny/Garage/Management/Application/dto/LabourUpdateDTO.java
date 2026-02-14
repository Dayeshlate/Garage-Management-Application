package com.danny.Garage.Management.Application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabourUpdateDTO {
    private Long billId;
    private Long labourAmount;
}
