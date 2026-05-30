package com.chen.e_commerce_backend.repository;

import com.chen.e_commerce_backend.model.PurchaseTransaction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseTransactionRepository
        extends JpaRepository<PurchaseTransaction, Long> {

    List<PurchaseTransaction> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}