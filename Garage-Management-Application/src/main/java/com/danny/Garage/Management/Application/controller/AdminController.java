package com.danny.Garage.Management.Application.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.danny.Garage.Management.Application.dto.BillDTO;
import com.danny.Garage.Management.Application.dto.LabourUpdateDTO;
import com.danny.Garage.Management.Application.service.BillService;

public class AdminController {

private BillService billService;
    
@GetMapping("/admin/pending-labour")
public List<BillDTO> getPendingBills() {
    return billService.getPendingLabourBills();
}

@PutMapping("/admin/update-labour")
public void updateLabour(@RequestBody LabourUpdateDTO dto) {
    billService.updateLabourAmount(dto);
}
}
