package com.ridr.back.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeliveryAddress {
    private int id;
    private String city;
    private String region;
    private String address;
    private LocalDateTime last_edited_at;
}
