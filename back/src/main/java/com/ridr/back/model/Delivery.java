package com.ridr.back.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class Delivery {
    private int id;
    private int deliveryTypeId;
    private int deliveryServiceProviderId;
    private int deliveryAddressId;
    private String recipientName;
    private String recipientPhone;
    private double cost;
    private double weight;
    private LocalDate estimatedDeliveryDate;
}
