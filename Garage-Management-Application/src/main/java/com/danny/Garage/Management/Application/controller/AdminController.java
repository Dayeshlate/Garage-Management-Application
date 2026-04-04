package com.danny.Garage.Management.Application.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danny.Garage.Management.Application.dto.BillDTO;
import com.danny.Garage.Management.Application.dto.JobCardDTO;
import com.danny.Garage.Management.Application.dto.MechanicUpdateDTO;
import com.danny.Garage.Management.Application.dto.UserDTO;
import com.danny.Garage.Management.Application.dto.VehicleDTO;
import com.danny.Garage.Management.Application.entity.JobStatus;
import com.danny.Garage.Management.Application.entity.VehicleStatus;
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

    public AdminController(JobCardService jobCardService, UserService userService, BillService billService,
            VehicleService vehicleService) {
        this.jobCardService = jobCardService;
        this.vehicleService = vehicleService;
        this.userService = userService;
        this.billService = billService;
    }

    // ================================== Users =====================================================

    @GetMapping("/getRegisterUserCount")
    public ResponseEntity<Long> getRegisterUserCunt(@RequestParam Long days) {
        Long count = userService.getCountOfRegisterUser(days);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/getUserCount")
    public ResponseEntity<Long> getAllUserCount() {
        Long count = userService.getTotalUser();
        return ResponseEntity.ok(count);
    }

    @PutMapping("/user/{userId}/currency")
    public ResponseEntity<UserDTO> updateUserCurrency(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        String currency = request.get("currency");
        UserDTO updatedUser = userService.updateUserCurrency(userId, currency);
        return ResponseEntity.ok(updatedUser);
    }

    // ================================== Bill =======================================================

    @GetMapping("/bill/getAllBills")
    public ResponseEntity<List<BillDTO>> getAllBills() {
        List<BillDTO> billDTOs = billService.getAllBill();
        ;
        return ResponseEntity.ok(billDTOs);
    }

    @GetMapping("/bill/pending-mechanic")
    public List<BillDTO> getPendingBills() {
        return billService.getPendingMechanicBills();
    }

    @PutMapping("/bill/update-mechanicbill")
    public void updateMechanic(@RequestBody MechanicUpdateDTO dto) {
        billService.updateMechanicAmount(dto);
    }

    @PutMapping("/bill/{billId}/status")
    public ResponseEntity<BillDTO> updateBillStatus(@PathVariable Long billId,
            @RequestBody Map<String, String> request) {
        String billStatus = request.get("billStatus");
        BillDTO updatedBill = billService.updateBillStatus(billId, billStatus);
        return ResponseEntity.ok(updatedBill);
    }

    // ================================== JobCard=======================================================

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
    @PreAuthorize("hasAnyRole('ADMIN', 'MECHANIC')")
    public ResponseEntity<JobCardDTO> updateJobCard(@RequestBody JobCardDTO dto) {
        JobCardDTO jobCardDTO = jobCardService.updateJobCard(dto);
        return ResponseEntity.ok(jobCardDTO);
    }

    @GetMapping("/jobcard/Active_count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MECHANIC')")
    public ResponseEntity<Long> getAllActiveServiceCount() {
        Long count = jobCardService.getAllJobCardsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/jobcard/getByStatus")
    @PreAuthorize("hasAnyRole('ADMIN', 'MECHANIC')")
    public ResponseEntity<List<JobCardDTO>> getJobCardByStatus(@RequestParam JobStatus jobStatus) {
        List<JobCardDTO> jobcards = jobCardService.getAllByStatus(jobStatus);
        return ResponseEntity.ok(jobcards);
    }

    @GetMapping("/jobcard/getAllJobCards")
    @PreAuthorize("hasAnyRole('ADMIN', 'MECHANIC')")
    public ResponseEntity<List<JobCardDTO>> getAllJobcards() {
        List<JobCardDTO> allJobCardDTOs = jobCardService.getAllJobCards();
        return ResponseEntity.ok(allJobCardDTOs);
    }

    // ======================================== Vehicle =================================================

    @GetMapping("/vehicle/get/{id}")
    public ResponseEntity<VehicleDTO> getvehicle(@PathVariable Long id) {
        VehicleDTO vehicles = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/vehicle/getCompletedWithinDays")
    public ResponseEntity<List<VehicleDTO>> getServiceVehicles(@RequestParam Long days) {
        List<VehicleDTO> vehicleDTOs = vehicleService.getServiceComplitedWhithinDays(days);
        return ResponseEntity.ok(vehicleDTOs);
    }

    @GetMapping("/vehicle/getByStatus")
    public ResponseEntity<List<VehicleDTO>> getByStatus(@RequestParam JobStatus status) {
        List<VehicleDTO> vehicles = vehicleService.getVehicleByStatus(status);
        return ResponseEntity.ok(vehicles);
    }

    @PutMapping("/vehicle/update")
    public ResponseEntity<VehicleDTO> updateVehicle(@RequestBody VehicleDTO dto) {
        VehicleDTO vehicle = vehicleService.updateVehicle(dto);
        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/getAllVehicles")
    public ResponseEntity<List<VehicleDTO>> getAllVehiclesDTOs() {
        List<VehicleDTO> vehicleDTOs = vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicleDTOs);
    }

    @PutMapping("/vehicle/{id}/approve")
    public ResponseEntity<VehicleDTO> approveVehicle(@PathVariable Long id) {
        VehicleDTO vehicle = vehicleService.approveVehicle(id);
        return ResponseEntity.ok(vehicle);
    }

    @PutMapping("/vehicle/{id}/reject")
    public ResponseEntity<VehicleDTO> rejectVehicle(@PathVariable Long id) {
        VehicleDTO vehicle = vehicleService.rejectVehicle(id);
        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/vehicle/pending")
    public ResponseEntity<List<VehicleDTO>> getPendingVehicles() {
        List<VehicleDTO> vehicles = vehicleService.getVehiclesByStatus(VehicleStatus.PENDING);
        return ResponseEntity.ok(vehicles);
    }

    @PostMapping("/vehicle/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleDTO> createVehicle(@RequestBody VehicleDTO dto) {
        VehicleDTO vehicleDTO = vehicleService.createVehicleByAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleDTO);
    }

}
