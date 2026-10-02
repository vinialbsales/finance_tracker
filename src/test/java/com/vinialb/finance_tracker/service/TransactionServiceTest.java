package com.vinialb.finance_tracker.service;

import com.vinialb.finance_tracker.constructor.TransactionMapperImp;
import com.vinialb.finance_tracker.dto.TransactionRequestDTO;
import com.vinialb.finance_tracker.dto.TransactionResponseDTO;
import com.vinialb.finance_tracker.entity.Category;
import com.vinialb.finance_tracker.entity.Transaction;
import com.vinialb.finance_tracker.exception.CategoryNotFoundException;
import com.vinialb.finance_tracker.exception.TransactionNotFoundException;
import com.vinialb.finance_tracker.repository.CategoryRepository;
import com.vinialb.finance_tracker.repository.TransactionRepository;
import org.h2.expression.ConcatenationOperation;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.util.ReflectionTestUtils;

import javax.swing.text.html.Option;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.vinialb.finance_tracker.enumerated.TransactionType.EXPENSE;
import static com.vinialb.finance_tracker.enumerated.TransactionType.INCOME;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TransactionServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransactionMapperImp transactionMapperImp;

    @InjectMocks
    TransactionService transactionService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    @DisplayName("Create the transaction when all the requirements are met")
    void createCase1() {
        Category category = new Category("Food", "#000000");
        ReflectionTestUtils.setField(category, "id", 1);

        when(categoryRepository.findById(1)).thenReturn(Optional.of(category));

        TransactionRequestDTO testRequest = new TransactionRequestDTO(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.now(),
                1
        );

        Transaction testTransaction = new Transaction(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.now(),
                category
        );

        LocalDateTime timestamp = LocalDateTime.now();
        ReflectionTestUtils.setField(testTransaction, "id", 1);
        ReflectionTestUtils.setField(testTransaction, "createdAt", timestamp);
        ReflectionTestUtils.setField(testTransaction, "updatedAt", timestamp);

        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        TransactionResponseDTO expectedResponse = new TransactionResponseDTO(
                testTransaction.getId(),
                testTransaction.getName(),
                testTransaction.getAmount(),
                testTransaction.getType(),
                testTransaction.getDate(),
                testTransaction.getCreatedAt(),
                testTransaction.getUpdatedAt(),
                category.getId()
        );

        when(transactionMapperImp.toResponse(testTransaction)).thenReturn(expectedResponse);

        TransactionResponseDTO realResponse = transactionService.create(testRequest);

        verify(categoryRepository, times(1)).findById(1);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(transactionMapperImp, times(1)).toResponse(testTransaction);
        assertEquals(expectedResponse, realResponse);
    }

    @Test
    @DisplayName("Should throw a CategoryNotFound exception when its unable to find the Category")
    void createCase2() {
        when(categoryRepository.findById(1)).thenReturn(Optional.empty());

        TransactionRequestDTO testRequest = new TransactionRequestDTO(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.now(),
                1
        );

        CategoryNotFoundException thrown = Assertions.assertThrows(CategoryNotFoundException.class, () -> transactionService.create(testRequest));
        verify(categoryRepository, times(1)).findById(1);
        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(transactionMapperImp, never()).toResponse(any(Transaction.class));
        assertEquals("Category not found with id 1", thrown.getMessage());
    }

    @Test
    @DisplayName("Should return a list containing all the transactions found")
    void listAllCase1() {
        Category testCategory1 = new Category("Food", null);
        Category testCategory2 = new Category("Bank", null);
        ReflectionTestUtils.setField(testCategory1, "id", 1);
        ReflectionTestUtils.setField(testCategory2, "id", 2);

        Transaction testTransaction = new Transaction(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.now(),
                testCategory1
        );
        Transaction testTransaction2 = new Transaction(
                BigDecimal.valueOf(100),
                INCOME,
                "Dinner",
                LocalDate.now(),
                testCategory2
        );

        ReflectionTestUtils.setField(testTransaction, "id", 1);
        ReflectionTestUtils.setField(testTransaction2, "id", 2);

        LocalDateTime timestamp1 = LocalDateTime.now();
        LocalDateTime timestamp2 = LocalDateTime.now();
        ReflectionTestUtils.setField(testTransaction, "createdAt", timestamp1);
        ReflectionTestUtils.setField(testTransaction, "updatedAt", timestamp1);
        ReflectionTestUtils.setField(testTransaction2, "createdAt", timestamp2);
        ReflectionTestUtils.setField(testTransaction2, "updatedAt", timestamp2);

        List<Transaction> testList = new ArrayList<>();
        testList.add(testTransaction);
        testList.add(testTransaction2);

        when(transactionRepository.findAll()).thenReturn(testList);

        TransactionResponseDTO testResponse1 = new TransactionResponseDTO(
                testTransaction.getId(),
                testTransaction.getName(),
                testTransaction.getAmount(),
                testTransaction.getType(),
                testTransaction.getDate(),
                testTransaction.getCreatedAt(),
                testTransaction.getUpdatedAt(),
                testTransaction.getCategory().getId()
        );
        TransactionResponseDTO testResponse2 = new TransactionResponseDTO(
                testTransaction2.getId(),
                testTransaction2.getName(),
                testTransaction2.getAmount(),
                testTransaction2.getType(),
                testTransaction2.getDate(),
                testTransaction2.getCreatedAt(),
                testTransaction2.getUpdatedAt(),
                testTransaction2.getCategory().getId()
        );

        when(transactionMapperImp.toResponse(testTransaction)).thenReturn(testResponse1);
        when(transactionMapperImp.toResponse(testTransaction2)).thenReturn(testResponse2);

        List<TransactionResponseDTO> expectedList = new ArrayList<>();
        expectedList.add(testResponse1);
        expectedList.add(testResponse2);

        List<TransactionResponseDTO> realList = transactionService.listAll();

        verify(transactionRepository, times(1)).findAll();
        verify(transactionMapperImp, times(1)).toResponse(testTransaction);
        verify(transactionMapperImp, times(1)).toResponse(testTransaction2);
        assertEquals(expectedList, realList);
    }

    @Test
    @DisplayName("Should return an empty list when no Transactions are found")
    void listAllCase2() {
        when(transactionRepository.findAll()).thenReturn(new ArrayList<>());

        List<TransactionResponseDTO> expectedList = new ArrayList<>();
        List<TransactionResponseDTO> realList = transactionService.listAll();

        verify(transactionMapperImp, never()).toResponse(any(Transaction.class));
        verify(transactionRepository, times(1)).findAll();
        assertEquals(expectedList, realList);
    }

    @Test
    @DisplayName("Should find the Transaction based on the id")
    void getByIdCase1() {
        Category testCategory = new Category("Food", null);
        ReflectionTestUtils.setField(testCategory, "id", 1);

        Transaction testTransaction = new Transaction(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.now(),
                testCategory
        );
        ReflectionTestUtils.setField(testTransaction, "id", 1);
        LocalDateTime timestamp = LocalDateTime.now();
        ReflectionTestUtils.setField(testTransaction, "createdAt", timestamp);
        ReflectionTestUtils.setField(testTransaction, "updatedAt", timestamp);

        when(transactionRepository.findById(1)).thenReturn(Optional.of(testTransaction));

        TransactionResponseDTO expectedResponse = new TransactionResponseDTO(
                testTransaction.getId(),
                testTransaction.getName(),
                testTransaction.getAmount(),
                testTransaction.getType(),
                testTransaction.getDate(),
                testTransaction.getCreatedAt(),
                testTransaction.getUpdatedAt(),
                testTransaction.getCategory().getId()
        );

        when(transactionMapperImp.toResponse(testTransaction)).thenReturn(expectedResponse);

        TransactionResponseDTO realResponse = transactionService.getById(1);

        verify(transactionRepository, times(1)).findById(1);
        verify(transactionMapperImp, times(1)).toResponse(testTransaction);
        assertEquals(expectedResponse, realResponse);
    }

    @Test
    @DisplayName("Should throw a TransactionNotFound exception when unable to locate the Transaction")
    void getByIdCase2() {
        when(transactionRepository.findById(1)).thenReturn(Optional.empty());
        TransactionNotFoundException thrown = Assertions.assertThrows(TransactionNotFoundException.class, () -> transactionService.getById(1));

        verify(transactionRepository, times(1)).findById(1);
        verify(transactionMapperImp, never()).toResponse(any(Transaction.class));
        assertEquals("Transaction not found with id 1", thrown.getMessage());
    }

    @Test
    @DisplayName("Should update all the fields")
    void updateCase1() {
        Category testCategory = new Category("Food", null);
        ReflectionTestUtils.setField(testCategory, "id", 1);

        Transaction testTransaction = new Transaction(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.of(2026, 9, 2),
                testCategory
        );
        ReflectionTestUtils.setField(testTransaction, "id", 1);
        LocalDateTime timestamp1 = LocalDateTime.now();
        ReflectionTestUtils.setField(testTransaction, "createdAt", timestamp1);
        ReflectionTestUtils.setField(testTransaction, "updatedAt", timestamp1);

        when(transactionRepository.findById(1)).thenReturn(Optional.of(testTransaction));

        LocalDate testDate = LocalDate.now();

        TransactionRequestDTO testRequest = new TransactionRequestDTO(
                BigDecimal.valueOf(120),
                EXPENSE,
                "Dinner",
                testDate,
                1
        );

        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        TransactionResponseDTO expectedResponse = new TransactionResponseDTO(
                1,
                testRequest.name(),
                testRequest.amount(),
                testRequest.type(),
                testRequest.date(),
                testTransaction.getCreatedAt(),
                testTransaction.getUpdatedAt(),
                testRequest.categoryId()
        );

        when(transactionMapperImp.toResponse(testTransaction)).thenReturn(expectedResponse);

        TransactionResponseDTO realResponse = transactionService.update(1, testRequest);

        verify(transactionRepository, times(1)).findById(1);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        assertEquals(testTransaction.getAmount(), BigDecimal.valueOf(120));
        assertEquals(testTransaction.getType(), EXPENSE);
        assertEquals(testTransaction.getName(), "Dinner");
        assertEquals(testTransaction.getDate(), testDate);
        assertEquals(realResponse, expectedResponse);
    }

    @Test
    @DisplayName("Should update the amount of Transaction")
    void updateCase2() {
        Category testCategory = new Category("Food", null);
        ReflectionTestUtils.setField(testCategory, "id", 1);

        Transaction testTransaction = new Transaction(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.of(2026, 9, 2),
                testCategory
        );
        ReflectionTestUtils.setField(testTransaction, "id", 1);
        LocalDateTime timestamp = LocalDateTime.now();
        ReflectionTestUtils.setField(testTransaction, "createdAt", timestamp);
        ReflectionTestUtils.setField(testTransaction, "updatedAt", timestamp);

        when(transactionRepository.findById(1)).thenReturn(Optional.of(testTransaction));


        TransactionRequestDTO testRequest = new TransactionRequestDTO(
                BigDecimal.valueOf(120),
                null,
                null,
                null,
                null
        );

        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        TransactionResponseDTO expectedResponse = new TransactionResponseDTO(
                1,
                testTransaction.getName(),
                testRequest.amount(),
                testTransaction.getType(),
                testTransaction.getDate(),
                testTransaction.getCreatedAt(),
                testTransaction.getUpdatedAt(),
                1
        );

        when(transactionMapperImp.toResponse(testTransaction)).thenReturn(expectedResponse);

        TransactionResponseDTO realResponse = transactionService.update(1, testRequest);

        verify(transactionRepository, times(1)).findById(1);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        assertEquals(testTransaction.getAmount(), BigDecimal.valueOf(120));
        assertEquals(testTransaction.getType(), INCOME);
        assertEquals(testTransaction.getName(), "BBQ");
        assertEquals(testTransaction.getDate(), LocalDate.of(2026, 9, 2));
        assertEquals(realResponse, expectedResponse);
    }

    @Test
    @DisplayName("Should update the type of Transaction")
    void updateCase3() {
        Category testCategory = new Category("Food", null);
        ReflectionTestUtils.setField(testCategory, "id", 1);

        Transaction testTransaction = new Transaction(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.of(2026, 9, 2),
                testCategory
        );
        ReflectionTestUtils.setField(testTransaction, "id", 1);
        LocalDateTime timestamp = LocalDateTime.now();
        ReflectionTestUtils.setField(testTransaction, "createdAt", timestamp);
        ReflectionTestUtils.setField(testTransaction, "updatedAt", timestamp);

        when(transactionRepository.findById(1)).thenReturn(Optional.of(testTransaction));


        TransactionRequestDTO testRequest = new TransactionRequestDTO(
                null,
                EXPENSE,
                null,
                null,
                null
        );

        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        TransactionResponseDTO expectedResponse = new TransactionResponseDTO(
                1,
                testTransaction.getName(),
                testTransaction.getAmount(),
                testRequest.type(),
                testTransaction.getDate(),
                testTransaction.getCreatedAt(),
                testTransaction.getUpdatedAt(),
                1
        );

        when(transactionMapperImp.toResponse(testTransaction)).thenReturn(expectedResponse);

        TransactionResponseDTO realResponse = transactionService.update(1, testRequest);

        verify(transactionRepository, times(1)).findById(1);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        assertEquals(testTransaction.getAmount(), BigDecimal.valueOf(100));
        assertEquals(testTransaction.getType(), EXPENSE);
        assertEquals(testTransaction.getName(), "BBQ");
        assertEquals(testTransaction.getDate(), LocalDate.of(2026, 9, 2));
        assertEquals(realResponse, expectedResponse);
    }

    @Test
    @DisplayName("Should update the name of Transaction")
    void updateCase4() {
        Category testCategory = new Category("Food", null);
        ReflectionTestUtils.setField(testCategory, "id", 1);

        Transaction testTransaction = new Transaction(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.of(2026, 9, 2),
                testCategory
        );
        ReflectionTestUtils.setField(testTransaction, "id", 1);
        LocalDateTime timestamp = LocalDateTime.now();
        ReflectionTestUtils.setField(testTransaction, "createdAt", timestamp);
        ReflectionTestUtils.setField(testTransaction, "updatedAt", timestamp);

        when(transactionRepository.findById(1)).thenReturn(Optional.of(testTransaction));


        TransactionRequestDTO testRequest = new TransactionRequestDTO(
                null,
                null,
                "Dinner",
                null,
                null
        );

        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        TransactionResponseDTO expectedResponse = new TransactionResponseDTO(
                1,
                testRequest.name(),
                testTransaction.getAmount(),
                testTransaction.getType(),
                testTransaction.getDate(),
                testTransaction.getCreatedAt(),
                testTransaction.getUpdatedAt(),
                1
        );

        when(transactionMapperImp.toResponse(testTransaction)).thenReturn(expectedResponse);

        TransactionResponseDTO realResponse = transactionService.update(1, testRequest);

        verify(transactionRepository, times(1)).findById(1);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        assertEquals(testTransaction.getAmount(), BigDecimal.valueOf(100));
        assertEquals(testTransaction.getType(), INCOME);
        assertEquals(testTransaction.getName(), "Dinner");
        assertEquals(testTransaction.getDate(), LocalDate.of(2026, 9, 2));
        assertEquals(realResponse, expectedResponse);
    }

    @Test
    @DisplayName("Should update the name of Transaction")
    void updateCase5() {
        Category testCategory = new Category("Food", null);
        ReflectionTestUtils.setField(testCategory, "id", 1);

        Transaction testTransaction = new Transaction(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.of(2026, 9, 2),
                testCategory
        );
        ReflectionTestUtils.setField(testTransaction, "id", 1);
        LocalDateTime timestamp = LocalDateTime.now();
        ReflectionTestUtils.setField(testTransaction, "createdAt", timestamp);
        ReflectionTestUtils.setField(testTransaction, "updatedAt", timestamp);

        when(transactionRepository.findById(1)).thenReturn(Optional.of(testTransaction));


        TransactionRequestDTO testRequest = new TransactionRequestDTO(
                null,
                null,
                null,
                LocalDate.of(2026,10,2),
                null
        );

        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        TransactionResponseDTO expectedResponse = new TransactionResponseDTO(
                1,
                testTransaction.getName(),
                testTransaction.getAmount(),
                testTransaction.getType(),
                testRequest.date(),
                testTransaction.getCreatedAt(),
                testTransaction.getUpdatedAt(),
                1
        );

        when(transactionMapperImp.toResponse(testTransaction)).thenReturn(expectedResponse);

        TransactionResponseDTO realResponse = transactionService.update(1, testRequest);

        verify(transactionRepository, times(1)).findById(1);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        assertEquals(testTransaction.getAmount(), BigDecimal.valueOf(100));
        assertEquals(testTransaction.getType(), INCOME);
        assertEquals(testTransaction.getName(), "BBQ");
        assertEquals(testTransaction.getDate(), LocalDate.of(2026, 10, 2));
        assertEquals(realResponse, expectedResponse);
    }

    @Test
    @DisplayName("Shouldn't update the Transaction")
    void updateCase6() {
        Category testCategory = new Category("Food", null);
        ReflectionTestUtils.setField(testCategory, "id", 1);

        Transaction testTransaction = new Transaction(
                BigDecimal.valueOf(100),
                INCOME,
                "BBQ",
                LocalDate.of(2026, 9, 2),
                testCategory
        );
        ReflectionTestUtils.setField(testTransaction, "id", 1);
        LocalDateTime timestamp = LocalDateTime.now();
        ReflectionTestUtils.setField(testTransaction, "createdAt", timestamp);
        ReflectionTestUtils.setField(testTransaction, "updatedAt", timestamp);

        when(transactionRepository.findById(1)).thenReturn(Optional.of(testTransaction));


        TransactionRequestDTO testRequest = new TransactionRequestDTO(
                null,
                null,
                null,
                null,
                null
        );

        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        TransactionResponseDTO expectedResponse = new TransactionResponseDTO(
                1,
                testTransaction.getName(),
                testTransaction.getAmount(),
                testTransaction.getType(),
                testTransaction.getDate(),
                testTransaction.getCreatedAt(),
                testTransaction.getUpdatedAt(),
                1
        );

        when(transactionMapperImp.toResponse(testTransaction)).thenReturn(expectedResponse);

        TransactionResponseDTO realResponse = transactionService.update(1, testRequest);

        verify(transactionRepository, times(1)).findById(1);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        assertEquals(testTransaction.getAmount(), BigDecimal.valueOf(100));
        assertEquals(testTransaction.getType(), INCOME);
        assertEquals(testTransaction.getName(), "BBQ");
        assertEquals(testTransaction.getDate(), LocalDate.of(2026, 9, 2));
        assertEquals(realResponse, expectedResponse);
    }

    @Test
    @DisplayName("Should throw a TransactionNotFoundException after failing to locate the Transaction")
    void updateCase7() {
        when(transactionRepository.findById(1)).thenReturn(Optional.empty());

        TransactionRequestDTO testRequest = new TransactionRequestDTO(
                null,
                null,
                null,
                null,
                null
        );

        TransactionNotFoundException thrown = Assertions.assertThrows(TransactionNotFoundException.class, () -> transactionService.update(1, testRequest));

        verify(transactionRepository, times(1)).findById(1);
        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(transactionMapperImp, never()).toResponse(any(Transaction.class));
        assertEquals("Transaction not found with id 1", thrown.getMessage());
    }

    @Test
    @DisplayName("Should delete the Transaction when found")
    void deleteCase1() {
        when(transactionRepository.existsById(1)).thenReturn(true);

        transactionService.delete(1);

        verify(transactionRepository, times(1)).deleteById(1);
    }

    @Test
    @DisplayName("Should throw a TransactionNotFoundException after failing to locate the Transaction")
    void deleteCase2() {
        when(transactionRepository.existsById(1)).thenReturn(false);

        TransactionNotFoundException thrown = Assertions.assertThrows(TransactionNotFoundException.class, () -> transactionService.delete(1));
        verify(transactionRepository, never()).deleteById(anyInt());
        assertEquals("Transaction not found with id 1", thrown.getMessage());
    }
}