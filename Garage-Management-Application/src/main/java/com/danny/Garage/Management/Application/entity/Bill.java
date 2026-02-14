package com.danny.Garage.Management.Application.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    @Enumerated(EnumType.STRING)
    private BillStatus billStatus;

    private Double sparePartAmount;

    @OneToOne
    @JoinColumn(name = "jobcard_id")
    private JobCard jobCard;

    @PrePersist
    public void onCreate(){
        if(this.billDate == null){
            this.billDate = LocalDateTime.now();
        }
    }
}
