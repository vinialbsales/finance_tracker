package com.vinialb.finance_tracker.controller;

import com.vinialb.finance_tracker.dto.CategoryRequestDTO;
import com.vinialb.finance_tracker.dto.CategoryResponseDTO;
import com.vinialb.finance_tracker.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {
    private CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    public List<CategoryResponseDTO> listAll() {
        return categoryService.listAll();
    }

    @GetMapping("/categories/{id}")
    public CategoryResponseDTO get(@PathVariable("id") Integer categoryId) {
        return categoryService.getById(categoryId);
    }

    @PatchMapping("/categories/{id}")
    public CategoryResponseDTO patch(@PathVariable("id") Integer categoryId, @RequestBody CategoryRequestDTO categoryRequestDTO) {
        return categoryService.update(categoryId, categoryRequestDTO);
    }
}
