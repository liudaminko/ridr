package com.ridr.back.model;

import lombok.Data;

@Data
public class EditGenreDto {
    private String oldName;
    private String name;
}