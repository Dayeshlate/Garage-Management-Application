package com.danny.Garage.Management.Application.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danny.Garage.Management.Application.dto.SparePartDTO;
import com.danny.Garage.Management.Application.service.SparePartService;

@RestController
@RequestMapping("/SparePart")
public class SparePartController {
    
    private final SparePartService sparePartService;

    public SparePartController(SparePartService sparePartService){
        this.sparePartService = sparePartService;
    }

    @PostMapping("/create")
    public ResponseEntity<SparePartDTO> createSparePart(@RequestBody SparePartDTO sparePartDTO){
        SparePartDTO dto = sparePartService.createSparePart(sparePartDTO);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(dto);
    }
    

    @GetMapping("/get/{id}")
    public ResponseEntity<SparePartDTO> getSparePart(@PathVariable Long id){
        SparePartDTO dto = sparePartService.getSparePartDTO(id);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    
    
}
