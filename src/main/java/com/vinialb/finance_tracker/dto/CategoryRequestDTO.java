package com.vinialb.finance_tracker.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequestDTO(@NotBlank String name, String color) {}
