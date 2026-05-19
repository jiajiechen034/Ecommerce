package com.chen.e_commerce_backend;

import java.util.List;

public class CheckoutRequest {

    private String userEmail;

    private List<CheckoutItemRequest> items;

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<CheckoutItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CheckoutItemRequest> items) {
        this.items = items;
    }
}