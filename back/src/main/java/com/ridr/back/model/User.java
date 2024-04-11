package com.ridr.back.model;

import lombok.Data;

import java.util.Date;

@Data
public class User {
    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private Date birthDate;
    private String gender;
}
