package com.danny.Garage.Management.Application.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.danny.Garage.Management.Application.dto.BillDTO;
import com.danny.Garage.Management.Application.service.BillService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("user/bill")
public class BillController {
    
    private BillService billService;

    public BillController(BillService billService){
        this.billService = billService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<BillDTO>> getAllBillsForUser() {
        List<BillDTO> allBillDTOs = billService.getAllBillForUser();
        return ResponseEntity.ok(allBillDTOs);
    }
    
    
}
