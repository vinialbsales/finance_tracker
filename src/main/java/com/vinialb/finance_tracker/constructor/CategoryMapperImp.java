package com.vinialb.finance_tracker.constructor;

import com.vinialb.finance_tracker.dto.CategoryResponseDTO;
import com.vinialb.finance_tracker.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapperImp implements CategoryMapper {

    @Override
    public CategoryResponseDTO toResponse(Category category) {
        return new CategoryResponseDTO(category.getId(), category.getName(), category.getColor(), category.getCreatedAt(), category.getUpdatedAt());
    }
}
