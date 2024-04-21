package com.ridr.back.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeliveryAddress {
    private int id;
    private String city;
    private String region;
    private String address;
    private LocalDateTime lastEditedAt;

    public DeliveryAddress(String city, String region, String address) {
        this.city = city;
        this.region = region;
        this.address = address;
        this.lastEditedAt = LocalDateTime.now();
    }
}
