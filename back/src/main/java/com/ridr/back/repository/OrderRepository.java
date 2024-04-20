package com.ridr.back.repository;

import com.ridr.back.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class OrderRepository {
    private final JdbcTemplate jdbcTemplate;

    public Order create(Order request) {
        Integer maxUserSeqNumber = jdbcTemplate.queryForObject("SELECT MAX(user_order_number) FROM Order_ WHERE customer_id = ?", Integer.class, request.getCustomerId());
        int newUserSeqNumId = (maxUserSeqNumber != null) ? maxUserSeqNumber + 1 : 1;

        Integer maxOrderId = jdbcTemplate.queryForObject("SELECT MAX(id) FROM Order_", Integer.class);
        int newOrderId = (maxOrderId != null) ? maxOrderId + 1 : 1;

        String insertQuery = "INSERT INTO Order_ VALUES(?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertQuery, newOrderId, request.getCustomerId(), newUserSeqNumId, LocalDate.now(), LocalTime.now(), request.getDeliveryId());

        Order order = new Order();
        order.setId(newOrderId);
        order.setCustomerId(request.getCustomerId());
        order.setUserOrderNumber(newUserSeqNumId);
        order.setDate(LocalDate.now());
        order.setTime(LocalTime.now());
        order.setDeliveryId(request.getDeliveryId());
        return order;
    }

}
