package com.danny.Garage.Management.Application.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "bills")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Bill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime billDate;

    private Long labourAmount;

    private String paymentMode;

    private Double totalPayment;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jobcard_id", unique = true, nullable = false)
    private JobCard jobCard;

    @PrePersist
    public void onCreate(){
        if(this.billDate == null){
            this.billDate = LocalDateTime.now();
        }
    }
}
