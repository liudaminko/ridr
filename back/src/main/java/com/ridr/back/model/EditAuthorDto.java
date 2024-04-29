package com.ridr.back.model;

import lombok.Data;

@Data
public class EditAuthorDto {
    private String oldName;
    private String firstName;
    private String lastName;
    private String biography;
}
