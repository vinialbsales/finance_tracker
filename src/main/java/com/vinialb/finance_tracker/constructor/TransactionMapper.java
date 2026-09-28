package com.vinialb.finance_tracker.constructor;

import com.vinialb.finance_tracker.dto.TransactionResponseDTO;
import com.vinialb.finance_tracker.entity.Transaction;

public interface TransactionMapper {
    TransactionResponseDTO toResponse(Transaction transaction);
}
