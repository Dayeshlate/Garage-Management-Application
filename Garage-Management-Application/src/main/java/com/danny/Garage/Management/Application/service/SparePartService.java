package com.danny.Garage.Management.Application.service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.danny.Garage.Management.Application.dto.SparePartDTO;
import com.danny.Garage.Management.Application.entity.JobCard;
import com.danny.Garage.Management.Application.entity.SparePart;
import com.danny.Garage.Management.Application.repository.JobCardRepository;
import com.danny.Garage.Management.Application.repository.SparePartRepository;

@Service
public class SparePartService {

    private SparePartRepository sparePartRepository;
    private JobCardRepository jobCardReository;
    private JobCardRepository jobCardRepository;

    public SparePartService(SparePartRepository sparePartRepository,JobCardRepository jobCardRepository){
        this.sparePartRepository = sparePartRepository;
        this.jobCardRepository = jobCardRepository;
    }

    public SparePartDTO createSparePart(SparePartDTO dto){
        Set<JobCard> Jobcards = dto.getJobCardIds() == null 
                ? Collections.emptySet() 
                : jobCardReository.findAllById(dto.getJobCardIds()).stream().collect(Collectors.toSet());

        SparePart sparePart = toEntity(dto, Jobcards);
        sparePartRepository.save(sparePart);

        return dto;

    }

    public SparePartDTO getSparePartDTO(Long id){
        SparePart sparePart = sparePartRepository.findById(id)
            .orElseThrow(()-> new RuntimeException("Spare part does not exists"));
        return toDTO(sparePart);
    }

    public List<SparePartDTO> getAllSparePartDTOs(){
        return sparePartRepository.findAll()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public Set<JobCard> getJobCard(SparePartDTO dto){
        Set<JobCard> Jobcards = dto.getJobCardIds() == null 
                ? Collections.emptySet() 
                : jobCardReository.findAllById(dto.getJobCardIds()).stream().collect(Collectors.toSet());

        return Jobcards;
    }

    public String deleteSparePart(SparePartDTO dto){
        SparePart sparePart = toEntity(dto, null);
        Long id = dto.getId();
        String name = dto.getPartName();
        sparePartRepository.delete(sparePart);
        return name+" having id "+ id+" is delete permantly";
    }

    

    public SparePart toEntity(SparePartDTO sparePartDTO, Set<JobCard> JobCards){
        return SparePart.builder()
            .id(sparePartDTO.getId())
            .partName(sparePartDTO.getPartName())
            .partNumber(sparePartDTO.getPartNumber())
            .partPrice(sparePartDTO.getPartPrice())
            .manufacture(sparePartDTO.getManufacture())
            .jobCards(JobCards)
            .build();
    }

    public SparePartDTO toDTO(SparePart entity) {

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
