package com.vinialb.finance_tracker.exception;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(Integer categoryId) {
        super("Category not found with id " + categoryId);
    }
}
