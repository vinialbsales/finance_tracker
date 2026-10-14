package com.vinialb.finance_tracker.service;

import com.vinialb.finance_tracker.constructor.CategoryMapper;
import com.vinialb.finance_tracker.constructor.CategoryMapperImp;
import com.vinialb.finance_tracker.dto.CategoryResponseDTO;
import com.vinialb.finance_tracker.entity.Category;
import com.vinialb.finance_tracker.exception.CategoryNotFoundException;
import com.vinialb.finance_tracker.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private CategoryMapperImp categoryMapperImp;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapperImp categoryMapperImp) {
        this.categoryRepository = categoryRepository;
        this.categoryMapperImp = categoryMapperImp;
    }

    public List<CategoryResponseDTO> listAll() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryResponseDTO> categoryResponseDTOS = new ArrayList<>();
        categoryResponseDTOS = categories.stream().map(category -> categoryMapperImp.toResponse(category)).collect(Collectors.toList());
        return categoryResponseDTOS;
    }

    public CategoryResponseDTO getById(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new CategoryNotFoundException(categoryId));
        return categoryMapperImp.toResponse(category);
    }
}
