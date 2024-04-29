package com.ridr.back.model;

import lombok.Data;

@Data
public class EditPublisherDto {
    private String oldName;
    private String name;
    private String address;
}
