package com.vinialb.finance_tracker.constructor;

import com.vinialb.finance_tracker.constructor.TransactionMapper;
import com.vinialb.finance_tracker.dto.TransactionResponseDTO;
import com.vinialb.finance_tracker.entity.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapperImp implements TransactionMapper{

    @Override
    public TransactionResponseDTO toResponse(Transaction transaction) {
        return new TransactionResponseDTO(transaction.getId(), transaction.getName(), transaction.getAmount(), transaction.getType(), transaction.getDate(), transaction.getCreatedAt(), transaction.getUpdatedAt(), transaction.getCategory().getId());
    }
}
