package com.ridr.back.model;

import lombok.Data;

import java.awt.print.Book;

@Data
public class BookAuthors {
    private Author author;
    private Book book;
}
