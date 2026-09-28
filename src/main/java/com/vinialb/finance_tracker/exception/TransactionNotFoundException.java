package com.vinialb.finance_tracker.exception;

public class TransactionNotFoundException extends RuntimeException {
    public TransactionNotFoundException(Integer transactionId) {
        super("Transaction not found with id " + transactionId);
    }
}
