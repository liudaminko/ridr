package com.ridr.back.model;

import lombok.Data;

import java.util.List;

@Data
public class FullOrderInfo {
    private Order order;
    private Delivery delivery;
    private DeliveryAddress deliveryAddress;
    private List<ShoppingCart> cartItems;
}
