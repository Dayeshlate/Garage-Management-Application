package com.danny.Garage.Management.Application.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobCardReository extends JpaRepository<JobCardReository,Long> {
    
    boolean existById(Long id);

    Optional<JobCardReository> findById(Long id);
}
