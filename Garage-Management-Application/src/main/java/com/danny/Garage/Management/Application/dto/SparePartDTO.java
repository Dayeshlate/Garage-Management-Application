package com.danny.Garage.Management.Application.dto;

import java.math.BigDecimal;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SparePartDTO {
    
    private Long id;

    private String partName;

    private Double partNumber;

    private BigDecimal partPrice;

    private String manufacture;

    private Set<Long> jobCardIds;


}
