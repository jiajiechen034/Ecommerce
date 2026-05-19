package com.chen.e_commerce_backend;

import java.time.LocalDateTime;
import java.util.List;

public class TransactionHistoryResponse {

    private Long id;

    private String userEmail;

    private Double totalAmount;

    private LocalDateTime createdAt;

    private List<TransactionHistoryItemResponse> items;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<TransactionHistoryItemResponse> getItems() {
        return items;
    }

    public void setItems(List<TransactionHistoryItemResponse> items) {
        this.items = items;
    }
}