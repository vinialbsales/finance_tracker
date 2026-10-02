package com.vinialb.finance_tracker.controller;

import com.vinialb.finance_tracker.dto.TransactionRequestDTO;
import com.vinialb.finance_tracker.dto.TransactionResponseDTO;
import com.vinialb.finance_tracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TransactionController {
    private TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/transactions")
    public TransactionResponseDTO post(@Valid @RequestBody TransactionRequestDTO transactionRequestDTO) {
        return transactionService.create(transactionRequestDTO);
    }

    @GetMapping("/transactions")
    public List<TransactionResponseDTO> get() {
        return transactionService.listAll();
    }

    @GetMapping("/transactions/{id}")
    public TransactionResponseDTO getById(@PathVariable("id") Integer transactionId) {
        return transactionService.getById(transactionId);
    }

    @PatchMapping("/transactions/{id}")
    public TransactionResponseDTO patch(@PathVariable("id") Integer transactionId, @RequestBody TransactionRequestDTO transactionRequestDTO) {
        return transactionService.update(transactionId, transactionRequestDTO);
    }

    @DeleteMapping("/transactions/{id}")
    public void delete(@PathVariable("id") Integer transactionId) {
        transactionService.delete(transactionId);
    }
}
