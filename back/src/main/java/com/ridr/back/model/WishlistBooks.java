package com.ridr.back.model;

import lombok.Data;

import java.util.List;

@Data
public class WishlistBooks {
    private Wishlist wishlist;
    private List<ShortInfoBook> books;
}
