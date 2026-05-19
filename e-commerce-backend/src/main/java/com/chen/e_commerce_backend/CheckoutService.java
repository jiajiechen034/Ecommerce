package com.chen.e_commerce_backend;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CheckoutService {

    private final ProductRepository productRepository;

    private final PurchaseTransactionRepository purchaseTransactionRepository;

    private final UserRepository userRepository;

    public CheckoutService(
            ProductRepository productRepository,
            PurchaseTransactionRepository purchaseTransactionRepository,
            UserRepository userRepository
    ) {
        this.productRepository = productRepository;
        this.purchaseTransactionRepository = purchaseTransactionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TransactionHistoryResponse checkout(CheckoutRequest request) {

        String userEmail = normalizeEmail(request.getUserEmail());

        if (!userRepository.existsByEmail(userEmail)) {
            throw new IllegalArgumentException("User does not exist");
        }

        List<CheckoutItemRequest> checkoutItems = request.getItems();

        if (checkoutItems == null || checkoutItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        PurchaseTransaction transaction = new PurchaseTransaction();
        transaction.setUserEmail(userEmail);
        transaction.setCreatedAt(LocalDateTime.now());

        double totalAmount = 0;

        for (CheckoutItemRequest checkoutItem : checkoutItems) {
            validateCheckoutItem(checkoutItem);

            Long productId = checkoutItem.getProductId();
            int quantityToBuy = checkoutItem.getQuantity();

            Product product = getValidatedProduct(productId, quantityToBuy);
            int availableQuantity =
                product.getQuantity() == null ? 0 : product.getQuantity();

            double unitPrice = product.getPrice() == null ? 0 : product.getPrice();
            double lineTotal = unitPrice * quantityToBuy;

            PurchaseTransactionItem transactionItem =
                    new PurchaseTransactionItem();
            transactionItem.setTransaction(transaction);
            transactionItem.setProductId(product.getId());
            transactionItem.setProductName(product.getName());
            transactionItem.setUnitPrice(unitPrice);
            transactionItem.setQuantity(quantityToBuy);
            transactionItem.setLineTotal(lineTotal);

            transaction.getItems().add(transactionItem);
            totalAmount += lineTotal;

            int remainingQuantity = availableQuantity - quantityToBuy;

            if (remainingQuantity <= 0) {
                productRepository.delete(product);
            } else {
                product.setQuantity(remainingQuantity);
                productRepository.save(product);
            }
        }

        transaction.setTotalAmount(totalAmount);

        PurchaseTransaction savedTransaction =
                purchaseTransactionRepository.save(transaction);

        return toTransactionHistoryResponse(savedTransaction);
    }

    public List<TransactionHistoryResponse> getUserHistory(String email) {

        String userEmail = normalizeEmail(email);

        if (!userRepository.existsByEmail(userEmail)) {
            throw new IllegalArgumentException("User does not exist");
        }

        return purchaseTransactionRepository
                .findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(this::toTransactionHistoryResponse)
            .toList();
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("User email is required");
        }

        return email.trim().toLowerCase();
    }

    private TransactionHistoryResponse toTransactionHistoryResponse(
            PurchaseTransaction transaction
    ) {
        TransactionHistoryResponse response =
                new TransactionHistoryResponse();
        response.setId(transaction.getId());
        response.setUserEmail(transaction.getUserEmail());
        response.setTotalAmount(transaction.getTotalAmount());
        response.setCreatedAt(transaction.getCreatedAt());

        List<TransactionHistoryItemResponse> itemResponses =
                transaction.getItems()
                        .stream()
                        .map(item -> {
                            TransactionHistoryItemResponse itemResponse =
                                    new TransactionHistoryItemResponse();
                            itemResponse.setProductId(item.getProductId());
                            itemResponse.setProductName(item.getProductName());
                            itemResponse.setUnitPrice(item.getUnitPrice());
                            itemResponse.setQuantity(item.getQuantity());
                            itemResponse.setLineTotal(item.getLineTotal());
                            return itemResponse;
                        })
                        .toList();

        response.setItems(itemResponses);
        return response;
    }

    private void validateCheckoutItem(CheckoutItemRequest checkoutItem) {
        if (checkoutItem.getProductId() == null) {
            throw new IllegalArgumentException("Product id is required");
        }

        if (checkoutItem.getQuantity() == null || checkoutItem.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
    }

    private Product getValidatedProduct(Long productId, int quantityToBuy) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Product not found: " + productId
                ));

        int availableQuantity = product.getQuantity() == null ? 0 : product.getQuantity();

        if (availableQuantity < quantityToBuy) {
            throw new IllegalStateException(
                    "Not enough stock for product: " + product.getName()
            );
        }

        return product;
    }
}