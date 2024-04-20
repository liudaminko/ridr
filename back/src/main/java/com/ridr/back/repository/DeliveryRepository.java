package com.ridr.back.repository;

import com.ridr.back.model.Delivery;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DeliveryRepository {
    private final JdbcTemplate jdbcTemplate;

    public ResponseEntity<Integer> createDelivery(Delivery request) {
        Integer maxId = jdbcTemplate.queryForObject("SELECT MAX(id) from Delivery", Integer.class);

        int newId = (maxId != null) ? maxId + 1 : 1;

        jdbcTemplate.update(
                "INSERT INTO Delivery (id, delivery_type_id, delivery_service_provider_id, delivery_address_id, recipient_name, recipient_phone_number) VALUES (?, ?, ?, ?, ?, ?)",
                newId, request.getDeliveryTypeId(), request.getDeliveryServiceProviderId(), request.getDeliveryAddressId(), request.getRecipientName(), request.getRecipientPhone());

        return new ResponseEntity<>(newId, HttpStatus.CREATED);
    }
}
