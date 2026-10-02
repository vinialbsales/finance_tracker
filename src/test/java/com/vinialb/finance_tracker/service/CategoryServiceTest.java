package com.vinialb.finance_tracker.service;

import com.vinialb.finance_tracker.constructor.CategoryMapperImp;
import com.vinialb.finance_tracker.dto.CategoryRequestDTO;
import com.vinialb.finance_tracker.dto.CategoryResponseDTO;
import com.vinialb.finance_tracker.entity.Category;
import com.vinialb.finance_tracker.exception.CategoryNotFoundException;
import com.vinialb.finance_tracker.repository.CategoryRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.util.ReflectionTestUtils;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapperImp categoryMapperImp;

    @InjectMocks
    @Autowired
    private CategoryService categoryService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    @DisplayName("Should create a Category if all the attribute requirements are met")
    void createCategoryCase() {
        CategoryRequestDTO categoryRequestDTO = new CategoryRequestDTO("Food", null);
        Category category = new Category(categoryRequestDTO.name(), categoryRequestDTO.color());

        ReflectionTestUtils.setField(category, "id", 1);

        LocalDateTime timestamp = LocalDateTime.now();
        ReflectionTestUtils.setField(category, "createdAt", timestamp);
        ReflectionTestUtils.setField(category, "updatedAt", timestamp);

        CategoryResponseDTO categoryResponseDTO = new CategoryResponseDTO(category.getId(), category.getName(), category.getColor(), category.getCreatedAt(), category.getUpdatedAt());

        when(categoryRepository.save(any(Category.class))).thenReturn(category);
        when(categoryMapperImp.toResponse(any(Category.class))).thenReturn(categoryResponseDTO);

        CategoryResponseDTO result = categoryService.create(categoryRequestDTO);

        verify(categoryRepository, times(1)).save(any(Category.class));
        verify(categoryMapperImp, times(1)).toResponse(category);
        verifyNoMoreInteractions(categoryRepository, categoryMapperImp);

        assertEquals(categoryResponseDTO, result);
    }

    @Test
    @DisplayName("Should return a list containing all the Categories found")
    void listAllCase1() {
        Category testCategory1 = new Category("Food", null);
        Category testCategory2 = new Category("Bank", null);
        List<Category> testList = new ArrayList<>();
        LocalDateTime timestamp1 = LocalDateTime.now();
        LocalDateTime timestamp2 = LocalDateTime.now();

        ReflectionTestUtils.setField(testCategory1, "id", 1);
        ReflectionTestUtils.setField(testCategory1, "createdAt", timestamp1);
        ReflectionTestUtils.setField(testCategory1, "updatedAt", timestamp1);

        ReflectionTestUtils.setField(testCategory2, "id", 2);
        ReflectionTestUtils.setField(testCategory2, "createdAt", timestamp2);
        ReflectionTestUtils.setField(testCategory2, "updatedAt", timestamp2);

        testList.add(testCategory1);
        testList.add(testCategory2);

        when(categoryRepository.findAll()).thenReturn(testList);

        List<CategoryResponseDTO> responseList = new ArrayList<>();
        CategoryResponseDTO testResponse1 = new CategoryResponseDTO(
                testCategory1.getId(),
                testCategory1.getName(),
                testCategory1.getColor(),
                testCategory1.getCreatedAt(),
                testCategory1.getUpdatedAt());
        CategoryResponseDTO testResponse2 = new CategoryResponseDTO(
                testCategory2.getId(),
                testCategory2.getName(),
                testCategory2.getColor(),
                testCategory2.getCreatedAt(),
                testCategory2.getUpdatedAt());
        responseList.add(testResponse1);
        responseList.add(testResponse2);

        when(categoryMapperImp.toResponse(testCategory1)).thenReturn(testResponse1);
        when(categoryMapperImp.toResponse(testCategory2)).thenReturn(testResponse2);

        List<CategoryResponseDTO> testResponseList = categoryService.listAll();

        verify(categoryRepository, times(1)).findAll();
        verify(categoryMapperImp, times(1)).toResponse(testCategory1);
        verify(categoryMapperImp, times(1)).toResponse(testCategory2);

        assertEquals(responseList, testResponseList);
    }

    @Test
    @DisplayName("Should return an empty list when no Categories are found")
    void listAllCase2() {
        when(categoryRepository.findAll()).thenReturn(new ArrayList<>());

        List<CategoryResponseDTO> responseList = new ArrayList<>();
        List<CategoryResponseDTO> testResponseList = categoryService.listAll();

        verify(categoryRepository, times(1)).findAll();
        verify(categoryMapperImp, never()).toResponse(any(Category.class));

        assertEquals(responseList, testResponseList);
    }

    @Test
    @DisplayName("Should return the Category that matches the categoryId")
    void getByIdCase1() {
        Category testCategory = new Category("Food", null);
        LocalDateTime timestamp = LocalDateTime.now();
        ReflectionTestUtils.setField(testCategory, "id", 1);
        ReflectionTestUtils.setField(testCategory, "createdAt", timestamp);
        ReflectionTestUtils.setField(testCategory, "updatedAt", timestamp);

        CategoryResponseDTO expectedResponse = new CategoryResponseDTO(
                testCategory.getId(),
                testCategory.getName(),
                testCategory.getColor(),
                testCategory.getCreatedAt(),
                testCategory.getUpdatedAt());

        when(categoryRepository.findById(1)).thenReturn(Optional.of(testCategory));
        when(categoryMapperImp.toResponse(testCategory)).thenReturn(expectedResponse);
        CategoryResponseDTO realResponse = categoryService.getById(1);

        verify(categoryRepository, times(1)).findById(1);
        verify(categoryMapperImp, times(1)).toResponse(testCategory);
        assertEquals(expectedResponse, realResponse);
    }

    @Test
    @DisplayName("Should throw a CategoryNotFoundException when the Category is not found")
    void getByIdCase2() throws CategoryNotFoundException {
        when(categoryRepository.findById(1)).thenReturn(Optional.empty());
        CategoryNotFoundException thrown = Assertions.assertThrows(CategoryNotFoundException.class, () -> categoryService.getById(1));
        Assertions.assertEquals("Category not found with id 1", thrown.getMessage());
    }

    @Test
    void update() {
    }

    @Test
    void delete() {
    }
}