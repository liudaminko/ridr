package com.ridr.back.model;

import lombok.Data;

@Data
public class ShoppingCart {
    private int customerId;
    private int bookId;
    private int sequenceNumber;
    private int quantity;
    private ShortInfoBook shortInfoBook;

    public ShoppingCart(int customerId, int bookId, int sequenceNumber, int quantity, ShortInfoBook shortInfoBook) {
        this.customerId = customerId;
        this.bookId = bookId;
        this.sequenceNumber = sequenceNumber;
        this.quantity = quantity;
        this.shortInfoBook = shortInfoBook;
    }
}
