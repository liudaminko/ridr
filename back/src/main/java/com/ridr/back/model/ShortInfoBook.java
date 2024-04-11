package com.ridr.back.model;

import lombok.Data;

@Data
public class ShortInfoBook {
    private int id;
    private String title;
    private String imageUrl;
    private String authors;
    private int price;
    private boolean liked;
}
