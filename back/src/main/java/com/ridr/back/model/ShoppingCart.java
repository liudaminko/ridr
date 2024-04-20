package com.ridr.back.model;

import lombok.Data;

@Data
public class ShoppingCart {
    private int customerId;
    private int bookId;
    private int sequenceNumber;
    private int quantity;
    private ShortInfoBook shortInfoBook;
}
