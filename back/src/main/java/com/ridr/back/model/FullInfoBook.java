package com.ridr.back.model;

import lombok.Data;

import java.util.List;


@Data
public class FullInfoBook {
    private int id;
    private String title;
    private String isbn;
    private String authors;
    private String description;
    private int price;
    private String genre;
    private String publisher;
    private int publicationYear;
    private String language;
    private int pages;
    private String imageUrl;

}