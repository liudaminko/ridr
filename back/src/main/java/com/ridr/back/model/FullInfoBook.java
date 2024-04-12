package com.ridr.back.model;

import lombok.Data;

import java.util.List;


@Data
public class FullInfoBook {
    private int id;
    private String imageUrl;
    private String title;
    private String authors;
    private String description;
    private int price;
    private String genre;
    private int pages;
    private int publicationYear;
    private String publisher;
    private String isbn;
    private String language;
}