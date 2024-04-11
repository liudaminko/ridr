package com.ridr.back.model;

import lombok.Data;

@Data
public class Author {
    private int id;
    private String firstName;
    private String lastName;
    private String biography;
}
