package com.danny.Garage.Management.Application.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "jobCards")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class JobCard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_status")
    private JobStatus jobStatus;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @OneToOne(mappedBy = "jobCard", cascade = CascadeType.ALL)
    private Bill bill;

    @Column(nullable=false)
    private LocalDateTime onCreate;

    @Column(precision = 10, scale = 2)
    private java.math.BigDecimal mechanicCharge;

    @ManyToMany(fetch = FetchType.LAZY,cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "jobcard_sparepart",joinColumns = @JoinColumn(name = "jobcard_id"),inverseJoinColumns = @JoinColumn(name = "sparepart_id"))
    @Builder.Default
    private Set<SparePart> spareParts = new HashSet<>();

    @PrePersist
    protected void onCreate(){
        this.onCreate = LocalDateTime.now();
        if (this.mechanicCharge == null) {
            this.mechanicCharge = java.math.BigDecimal.ZERO;
        }
    }


}
