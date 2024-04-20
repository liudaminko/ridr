package com.ridr.back.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class Order {
    private int id;
    private int customerId;
    private int userOrderNumber;
    private LocalDate date;
    private LocalTime time;
    private int deliveryId;
}
