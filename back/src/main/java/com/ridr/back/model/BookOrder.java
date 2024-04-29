package com.ridr.back.model;

import lombok.Data;

@Data
public class BookOrder {
    private int orderId;
    private int bookId;
    private int sequenceNumber;
    private int quantity;
    private ShortInfoBook shortInfoBook;

    public BookOrder(int orderId, int bookId, int sequenceNumber, int quantity, ShortInfoBook shortBookInfo) {
        this.orderId = orderId;
        this.bookId = bookId;
        this.sequenceNumber = sequenceNumber;
        this.quantity = quantity;
        this.shortInfoBook = shortBookInfo;
    }
}
