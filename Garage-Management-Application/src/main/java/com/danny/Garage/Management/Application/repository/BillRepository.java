package com.danny.Garage.Management.Application.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.Garage.Management.Application.entity.Bill;

public interface BillRepository extends JpaRepository<Bill,Long> {
}
