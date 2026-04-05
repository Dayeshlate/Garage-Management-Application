package com.danny.Garage.Management.Application.entity;

import java.math.BigDecimal;
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
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Table(name = "bills")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Bill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private LocalDateTime billDate;

    private BigDecimal mechanicAmount;

    private String paymentMode;

    private BigDecimal totalPayment;

    @Enumerated(EnumType.STRING)
    private BillStatus billStatus;

    private BigDecimal sparePartAmount;

    @Column(length = 10)
    private String currency;

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
