package com.danny.Garage.Management.Application.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.danny.Garage.Management.Application.entity.JobCard;
import com.danny.Garage.Management.Application.entity.JobStatus;
import com.danny.Garage.Management.Application.entity.Vehicle;

import java.time.LocalDateTime;


@Repository
public interface JobCardRepository extends JpaRepository<JobCard,Long> {

    List<JobCard> findByStatusNot(JobStatus status);

    List<JobCard> findByOnCreateAfterAndJobStatusisNot(LocalDateTime onCreate, JobStatus jobStatus);

    
    @Query("""
       SELECT COUNT(jc)
       FROM JobCard jc
       WHERE jc.vehicle.user.id = :userId
       AND jc.status <> :status
       """)
    Long countByUserIdAndStatusNot(
        @Param("userId") Long userId,
        @Param("status") JobStatus status);

        List<JobCard> findByVehicleUserIdAndStatusNot(
        Long userId,
        JobStatus status
    );

    
        
}
