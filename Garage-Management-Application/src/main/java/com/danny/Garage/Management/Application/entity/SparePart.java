package com.danny.Garage.Management.Application.entity;

import java.math.BigDecimal;
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
    private Long id;

    private String partName;

    private Long partStock;

    private BigDecimal partPrice;

    private String manufacture;

    @ManyToMany(mappedBy = "spareParts", fetch = FetchType.LAZY)
    private Set<JobCard> jobCards = new HashSet<>();
}
