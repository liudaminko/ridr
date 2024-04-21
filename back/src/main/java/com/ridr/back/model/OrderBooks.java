package com.ridr.back.model;

import lombok.Data;

@Data
public class OrderBooks {
    private int orderId;
    private int bookId;
    private int quantity;
    private int sequenceNumber;
    private int unitPrice;
}
