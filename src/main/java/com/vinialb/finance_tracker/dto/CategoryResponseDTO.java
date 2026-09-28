package com.vinialb.finance_tracker.dto;

import java.time.LocalDateTime;

public record CategoryResponseDTO(Integer id, String name, String color, LocalDateTime createdAt, LocalDateTime updatedAt) {}
