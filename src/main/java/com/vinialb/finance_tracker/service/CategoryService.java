package com.vinialb.finance_tracker.service;

import com.vinialb.finance_tracker.constructor.CategoryMapper;
import com.vinialb.finance_tracker.constructor.CategoryMapperImp;
import com.vinialb.finance_tracker.dto.CategoryRequestDTO;
import com.vinialb.finance_tracker.dto.CategoryResponseDTO;
import com.vinialb.finance_tracker.entity.Category;
import com.vinialb.finance_tracker.exception.CategoryNotFoundException;
import com.vinialb.finance_tracker.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private CategoryMapperImp categoryMapperImp;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapperImp categoryMapperImp) {
        this.categoryRepository = categoryRepository;
        this.categoryMapperImp = categoryMapperImp;
    }

    public CategoryResponseDTO create(CategoryRequestDTO categoryRequestDTO) {
        Category category = new Category(categoryRequestDTO.name(), categoryRequestDTO.color());
        Category saved = categoryRepository.save(category);
        return categoryMapperImp.toResponse(saved);
    }

    public List<CategoryResponseDTO> listAll() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryResponseDTO> categoryResponseDTOS = new ArrayList<>();
        for (Category category : categories) {
            categoryResponseDTOS.add(categoryMapperImp.toResponse(category));
        }
        return categoryResponseDTOS;
    }

    public CategoryResponseDTO getById(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new CategoryNotFoundException(categoryId));
        return categoryMapperImp.toResponse(category);
    }

    public CategoryResponseDTO update(Integer categoryId, CategoryRequestDTO categoryRequestDTO) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new CategoryNotFoundException(categoryId));
        if (categoryRequestDTO.name() != null) {
            category.setName(categoryRequestDTO.name());
        }
        if (categoryRequestDTO.color() != null) {
            category.setColor(categoryRequestDTO.color());
        }
        Category saved = categoryRepository.save(category);
        return categoryMapperImp.toResponse(saved);
    }

    public void delete(Integer categoryId) {
        if (categoryRepository.existsById(categoryId)) {
            categoryRepository.deleteById(categoryId);
        } else throw new CategoryNotFoundException(categoryId);
    }
}
