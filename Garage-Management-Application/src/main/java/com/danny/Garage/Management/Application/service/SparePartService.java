package com.danny.Garage.Management.Application.service;

import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.SparePartDTO;
import com.danny.Garage.Management.Application.entity.SparePart;
import com.danny.Garage.Management.Application.repository.SparePartRepository;

@Service
public class SparePartService {

    private SparePartRepository sparePartRepository;

    private SparePart sparePart;

    public static SparePart toEntity(SparePartDTO sparePartDTO){
        return SparePart.builder()
            .id(sparePartDTO.getId())
            .partName(sparePartDTO.getPartname())
            .partNumber(sparePartDTO.getPartNumber())
            .partPrice(sparePartDTO.getPartPrice())
            .manufacture(sparePartDTO.getManufacture())
            .jobCards(sparePartDTO.getJobCardIds())
            .build();
    }
}
