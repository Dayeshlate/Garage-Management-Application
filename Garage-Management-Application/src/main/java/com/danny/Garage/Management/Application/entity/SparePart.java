package com.danny.Garage.Management.Application.entity;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "spareParts")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SparePart {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private String partname;

    private Double partnumber;

    private Long price;

    private String manufacture;

    @ManyToMany(mappedBy = "spareParts", fetch = FetchType.LAZY)
    private Set<JobCard> jobCards = new HashSet<>();
}
