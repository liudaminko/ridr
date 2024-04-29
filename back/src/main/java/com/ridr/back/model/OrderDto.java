package com.ridr.back.model;

import lombok.Data;

@Data
public class OrderDto {
    private int orderId;
    private String date;

    public OrderDto(int orderId, String date) {
        this.orderId = orderId;
        this.date = date;
    }
}
