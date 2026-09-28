package com.vinialb.finance_tracker.dto;

import com.vinialb.finance_tracker.enumerated.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequestDTO(@NotNull BigDecimal amount, @NotNull TransactionType type, @NotBlank String name, LocalDate date, @NotNull Integer categoryId) {}
