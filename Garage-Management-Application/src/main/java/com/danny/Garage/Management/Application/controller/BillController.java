package com.danny.Garage.Management.Application.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danny.Garage.Management.Application.repository.BillRepository;

@RestController
@RequestMapping("/bill")
public class BillController {
    
    private BillRepository billRepository;

    public BillController(BillRepository billRepository){
        this.billRepository = billRepository;
    }

    
}
