package com.ridr.back.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Wishlist {
    private int id;
    private String name;
    private int customerId;
    private LocalDateTime lastModifiedAt;
}
