package com.danny.Garage.Management.Application.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.Garage.Management.Application.entity.Bill;
import com.danny.Garage.Management.Application.entity.BillStatus;

public interface BillRepository extends JpaRepository<Bill,Long> {

    List<Bill> findByBillStatus(BillStatus billStatus);
}
