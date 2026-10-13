package com.vinialb.finance_tracker.exception;

public class CategoryRequiredException extends RuntimeException {
    public CategoryRequiredException() {
        super("Category is required for EXPENSE transactions");
    }
}
