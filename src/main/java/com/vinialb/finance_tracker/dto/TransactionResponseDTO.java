package com.vinialb.finance_tracker.dto;

import com.vinialb.finance_tracker.enumerated.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TransactionResponseDTO(Integer id, String name, BigDecimal amount, TransactionType type, LocalDate date, LocalDateTime createdAt, LocalDateTime updatedAt, Integer categoryId) {}
