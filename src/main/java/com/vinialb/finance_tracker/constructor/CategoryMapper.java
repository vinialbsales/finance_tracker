package com.vinialb.finance_tracker.constructor;

import com.vinialb.finance_tracker.dto.CategoryResponseDTO;
import com.vinialb.finance_tracker.entity.Category;

public interface CategoryMapper {
    CategoryResponseDTO toResponse(Category category);
}
