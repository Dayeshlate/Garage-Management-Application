package com.danny.Garage.Management.Application.service;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.SparePartDTO;
import com.danny.Garage.Management.Application.entity.JobCard;
import com.danny.Garage.Management.Application.entity.SparePart;
import com.danny.Garage.Management.Application.repository.SparePartRepository;

@Service
public class SparePartService {

    private SparePartRepository sparePartRepository;
    private SparePart sparePart;

    public static SparePart toEntity(SparePartDTO sparePartDTO, Set<JobCard> JobCards){
        return SparePart.builder()
            .id(sparePartDTO.getId())
            .partName(sparePartDTO.getPartName())
            .partNumber(sparePartDTO.getPartNumber())
            .partPrice(sparePartDTO.getPartPrice())
            .manufacture(sparePartDTO.getManufacture())
            .jobCards(JobCards)
            .build();
    }

    public static SparePartDTO toDTO(SparePart entity) {

    return SparePartDTO.builder()
        .id(entity.getId())
        .partName(entity.getPartName())
        .partNumber(entity.getPartNumber())
        .partPrice(entity.getPartPrice())
        .manufacture(entity.getManufacture())
        .jobCardIds(
            entity.getJobCards() == null
                ? Collections.emptySet()
                : entity.getJobCards()
                    .stream()
                    .map(JobCard::getId)
                    .collect(Collectors.toSet())
        )
        .build();
}

}
