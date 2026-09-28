package com.vinialb.finance_tracker.repository;

import com.vinialb.finance_tracker.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {}
