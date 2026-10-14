package com.vinialb.finance_tracker.service;

import com.sun.jdi.request.InvalidRequestStateException;
import com.vinialb.finance_tracker.constructor.TransactionMapperImp;
import com.vinialb.finance_tracker.dto.TransactionRequestDTO;
import com.vinialb.finance_tracker.dto.TransactionResponseDTO;
import com.vinialb.finance_tracker.entity.Category;
import com.vinialb.finance_tracker.entity.Transaction;
import com.vinialb.finance_tracker.enumerated.TransactionType;
import com.vinialb.finance_tracker.exception.CategoryNotFoundException;
import com.vinialb.finance_tracker.exception.CategoryRequiredException;
import com.vinialb.finance_tracker.exception.InvalidDateException;
import com.vinialb.finance_tracker.repository.CategoryRepository;
import com.vinialb.finance_tracker.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.vinialb.finance_tracker.exception.TransactionNotFoundException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionService {
    private TransactionRepository transactionRepository;
    private TransactionMapperImp transactionMapperImp;
    private CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository, TransactionMapperImp transactionMapperImp, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.transactionMapperImp = transactionMapperImp;
        this.categoryRepository = categoryRepository;
    }

    // Category is required for EXPENSE only; INCOME may have none, but one that is sent is kept.
    private void requireCategoryForExpense(TransactionType type, boolean hasCategory) {
        if (type == TransactionType.EXPENSE && !hasCategory) {
            throw new CategoryRequiredException();
        }
    }

    public TransactionResponseDTO create(TransactionRequestDTO transactionRequestDTO) {
        Integer categoryId = transactionRequestDTO.categoryId();
        requireCategoryForExpense(transactionRequestDTO.type(), categoryId != null);
        Category category = categoryId == null ? null : categoryRepository.findById(categoryId).orElseThrow(() -> new CategoryNotFoundException(categoryId));
        Transaction transaction = new Transaction(transactionRequestDTO.amount(), transactionRequestDTO.type(), transactionRequestDTO.name(), transactionRequestDTO.date(), category);
        Transaction saved = transactionRepository.save(transaction);
        return transactionMapperImp.toResponse(saved);
    }

    public List<TransactionResponseDTO> listAll() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<TransactionResponseDTO> transactionResponseDTOS = new ArrayList<>();
        transactionResponseDTOS = transactions.stream().map((transaction) -> transactionMapperImp.toResponse(transaction)).collect(Collectors.toList());
        return transactionResponseDTOS;
    }

    public List<TransactionResponseDTO> listBetween(LocalDate from, LocalDate to) {
        if (from == null && to == null) {
            return listAll();
        }
        if (from == null || to == null) {
            throw new InvalidDateException("From and to should be passed together, or none at all");
        }
        if (from.isAfter(to)) {
            throw new InvalidDateException("From can never come after to");
        }
        List<Transaction> transactions = transactionRepository.findByDateBetween(from, to);
        List<TransactionResponseDTO> transactionResponseDTOS = new ArrayList<>();
        transactionResponseDTOS = transactions.stream().map((transaction) -> transactionMapperImp.toResponse(transaction)).collect(Collectors.toList());
        return transactionResponseDTOS;
    }

    public TransactionResponseDTO getById(Integer transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new TransactionNotFoundException(transactionId));
        return transactionMapperImp.toResponse(transaction);
    }

    public TransactionResponseDTO update(Integer transactionId, TransactionRequestDTO transactionRequestDTO) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new TransactionNotFoundException(transactionId));
        // The category can't be changed on update, so check the type the transaction will end up with
        // against the category it already has (an uncategorized INCOME can't become an EXPENSE).
        TransactionType resultingType = transactionRequestDTO.type() != null ? transactionRequestDTO.type() : transaction.getType();
        requireCategoryForExpense(resultingType, transaction.getCategory() != null);
        if (transactionRequestDTO.name() != null) {
            transaction.setName(transactionRequestDTO.name());
        }
        if (transactionRequestDTO.amount() != null) {
            transaction.setAmount(transactionRequestDTO.amount());
        }
        if (transactionRequestDTO.type() != null) {
            transaction.setType(transactionRequestDTO.type());
        }
        if (transactionRequestDTO.date() != null) {
            transaction.setDate(transactionRequestDTO.date());
        }
        Transaction saved = transactionRepository.save(transaction);
        return transactionMapperImp.toResponse(saved);
    }

    public void delete(Integer transactionId) {
        if (transactionRepository.existsById(transactionId)) {
            transactionRepository.deleteById(transactionId);
        } else throw new TransactionNotFoundException(transactionId);
    }
}
