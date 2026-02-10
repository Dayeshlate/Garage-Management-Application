package com.danny.Garage.Management.Application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.danny.Garage.Management.Application.entity.JobCard;

@Repository
public interface JobCardRepository extends JpaRepository<JobCard,Long> {

}
