package com.danny.Garage.Management.Application.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danny.Garage.Management.Application.dto.BillDTO;
import com.danny.Garage.Management.Application.dto.LabourUpdateDTO;
import com.danny.Garage.Management.Application.service.BillService;

@RestController
@RequestMapping("/user")
public class AdminController {

private BillService billService;
    
@GetMapping("/pending-labour")
public List<BillDTO> getPendingBills() {
    return billService.getPendingLabourBills();
}

@PutMapping("/update-labourbill")
public void updateLabour(@RequestBody LabourUpdateDTO dto) {
    billService.updateLabourAmount(dto);
}

}
