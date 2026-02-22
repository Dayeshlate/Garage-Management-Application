package com.danny.Garage.Management.Application.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danny.Garage.Management.Application.dto.BillDTO;
import com.danny.Garage.Management.Application.dto.JobCardDTO;
import com.danny.Garage.Management.Application.dto.LabourUpdateDTO;
import com.danny.Garage.Management.Application.dto.VehicleDTO;
import com.danny.Garage.Management.Application.entity.JobStatus;
import com.danny.Garage.Management.Application.repository.BillRepository;
import com.danny.Garage.Management.Application.service.BillService;
import com.danny.Garage.Management.Application.service.JobCardService;
import com.danny.Garage.Management.Application.service.UserService;
import com.danny.Garage.Management.Application.service.VehicleService;

import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/admin")
public class AdminController {

    private VehicleService vehicleService;
    private JobCardService jobCardService;
    private BillService billService;
    private UserService userService;

    public AdminController(JobCardService jobCardService,UserService userService, BillService billService, VehicleService vehicleService){
        this.jobCardService = jobCardService;
        this.vehicleService = vehicleService;
        this.userService = userService;
        this.billService = billService;
    }

    //================================== Users =====================================================

    @GetMapping("/getRegisterUserCount")
    public ResponseEntity getRegisterUserCunt(@RequestParam Long days) {
        Long count = userService.getCountOfRegisterUser(days);
        return ResponseEntity.ok(count);
    }
    

    //================================== Bill =======================================================

    @GetMapping("/bill/pending-labour")
    public List<BillDTO> getPendingBills() {
        return billService.getPendingLabourBills();
    }

    @PutMapping("/bill/update-labourbill")
    public void updateLabour(@RequestBody LabourUpdateDTO dto) {
        billService.updateLabourAmount(dto);
    }


    //================================== JobCard =======================================================

    @GetMapping("/getActiveJobCardCountwithinDays")
    public ResponseEntity<Long> getActiveJobCardCountWhininDays(@RequestParam Long days) {
        Long count = jobCardService.getLastDateActiveJobcardCount(days);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/getActiveJobCardwithinDays")
    public ResponseEntity<List<JobCardDTO>> getActiveJobCardWhininDays(@RequestParam Long days) {
        List<JobCardDTO> jobCardDTOs = jobCardService.getLastDateActiveJobcard(days);
        return ResponseEntity.ok(jobCardDTOs);
    }
    

    @PostMapping("/jobcard/update")
    public ResponseEntity<JobCardDTO> updateJobCard(@RequestBody JobCardDTO dto) {
        JobCardDTO jobCardDTO = jobCardService.updateJobCard(dto);
        return ResponseEntity.ok(jobCardDTO);
    }

    @GetMapping("/jobcard/Active_count")
    public ResponseEntity<Long> getAllActiveServiceCount() {
        Long count = jobCardService.getAllJobCardsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/jobcard/getByStatus")
    public ResponseEntity<List<JobCardDTO>> getJobCardByStatus(@RequestParam JobStatus jobStatus) {
        List<JobCardDTO> jobcards = jobCardService.getAllByStatus(jobStatus);
        return ResponseEntity.ok(jobcards);
    }

    @GetMapping("/jobcard/getAllJobCards")
    public ResponseEntity<List<JobCardDTO>> getAllJobcards() {
        List<JobCardDTO> allJobCardDTOs = jobCardService.getAllJobCards();
        return ResponseEntity.ok(allJobCardDTOs);
    }
    
    //======================================== Vehicle =================================================

    @GetMapping("/vehicle/get/{id}")
    public ResponseEntity<VehicleDTO> getvehicle(@PathVariable Long id) {
        VehicleDTO vehicles = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/getCompletedWithinDays")
    public ResponseEntity<List<VehicleDTO>> getServiceVehicles(@RequestParam Long days) {
        List<VehicleDTO> vehicleDTOs = vehicleService.getServiceComplitedWhithinDays(days);
        return ResponseEntity.ok(vehicleDTOs);
    }
    

    @PostMapping("/vehicle/create")
    public ResponseEntity<VehicleDTO> createVehicle(@RequestBody VehicleDTO dto) {
        VehicleDTO vehicleDTO = vehicleService.createVehicleByAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleDTO);
    }
    
    
    @GetMapping("/vehicle/getByStatus")
    public ResponseEntity<List<VehicleDTO>> getByStatus(@RequestParam JobStatus status) {
        List<VehicleDTO> vehicles =  vehicleService.getVehicleByStatus(status);
        return ResponseEntity.ok(vehicles);
   }

   @GetMapping("/vehicle/update")
   public ResponseEntity<VehicleDTO> updateVehicle(@RequestBody VehicleDTO dto) {
       VehicleDTO vehicle = vehicleService.updateVehicle(dto);
       return ResponseEntity.ok(vehicle);
   }

   @GetMapping("/vehicle/getAllBills")
   public ResponseEntity<List<BillDTO>> getAllBills() {
       List<BillDTO> billDTOs = billService.getAllBill();;
       return ResponseEntity.ok(billDTOs);
   }
    
   
   

}
