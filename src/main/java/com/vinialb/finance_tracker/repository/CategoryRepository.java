package com.vinialb.finance_tracker.repository;

import com.vinialb.finance_tracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {}
