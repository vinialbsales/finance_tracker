package com.vinialb.finance_tracker.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vinialb.finance_tracker.enumerated.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TransactionResponseDTO(Integer id,
    String name,
    @JsonFormat(shape = JsonFormat.Shape.STRING) BigDecimal amount,
    TransactionType type,
    LocalDate date,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    Integer categoryId) {
}
