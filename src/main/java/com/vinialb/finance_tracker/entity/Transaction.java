package com.vinialb.finance_tracker.entity;

import com.vinialb.finance_tracker.enumerated.TransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Setter
    private BigDecimal amount;

    @Setter
    @Enumerated(EnumType.STRING)
    @NotNull
    private TransactionType type;

    @Setter
    @NotBlank
    private String name;

    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    @Setter
    LocalDate date;

    @Setter
    @ManyToOne
    @JoinColumn(name = "category_id")
    Category category;

    protected  Transaction() {}

    public Transaction(BigDecimal amount, TransactionType type, String name, LocalDate date, Category category) {
        this.amount = amount;
        this.type = type;
        this.name = name;
        this.date = date;
        this.category = category;
    }
}
