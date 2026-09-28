package com.vinialb.finance_tracker.service;

import com.vinialb.finance_tracker.constructor.TransactionMapperImp;
import com.vinialb.finance_tracker.dto.TransactionRequestDTO;
import com.vinialb.finance_tracker.dto.TransactionResponseDTO;
import com.vinialb.finance_tracker.entity.Category;
import com.vinialb.finance_tracker.entity.Transaction;
import com.vinialb.finance_tracker.exception.CategoryNotFoundException;
import com.vinialb.finance_tracker.repository.CategoryRepository;
import com.vinialb.finance_tracker.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.vinialb.finance_tracker.exception.TransactionNotFoundException;

import java.util.ArrayList;
import java.util.List;

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

    public TransactionResponseDTO create(TransactionRequestDTO transactionRequestDTO) {
        Category category = categoryRepository.findById(transactionRequestDTO.categoryId()).orElseThrow(() -> new CategoryNotFoundException(transactionRequestDTO.categoryId()));
        Transaction transaction = new Transaction(transactionRequestDTO.amount(), transactionRequestDTO.type(), transactionRequestDTO.name(), transactionRequestDTO.date(), category);
        Transaction saved = transactionRepository.save(transaction);
        return transactionMapperImp.toResponse(saved);
    }

    public List<TransactionResponseDTO> listAll() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<TransactionResponseDTO> transactionResponseDTOS = new ArrayList<>();
        for (Transaction transaction : transactions) {
            transactionResponseDTOS.add(transactionMapperImp.toResponse(transaction));
        }
        return transactionResponseDTOS;
    }

    public TransactionResponseDTO getById(Integer transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new TransactionNotFoundException(transactionId));
        return transactionMapperImp.toResponse(transaction);
    }

    public TransactionResponseDTO update(Integer transactionId, TransactionRequestDTO transactionRequestDTO) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new TransactionNotFoundException(transactionId));
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
