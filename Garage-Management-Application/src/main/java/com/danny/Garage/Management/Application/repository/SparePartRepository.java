package com.danny.Garage.Management.Application.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.Garage.Management.Application.entity.SparePart;


public interface SparePartRepository extends JpaRepository<SparePart, Long>{

    boolean existsById(Long id);

    Optional<SparePart> findById(Long id);
    
}
