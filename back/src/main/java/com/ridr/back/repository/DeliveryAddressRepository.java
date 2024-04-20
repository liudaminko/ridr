package com.ridr.back.repository;

import com.ridr.back.model.DeliveryAddress;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DeliveryAddressRepository {
    private final JdbcTemplate jdbcTemplate;
    public ResponseEntity<Integer> create(DeliveryAddress request) {
        Integer maxId = jdbcTemplate.queryForObject("SELECT MAX(id) FROM Delivery_Address", Integer.class);

        int newId = (maxId != null) ? maxId + 1 : 1;

        jdbcTemplate.update(
                "INSERT INTO Delivery_Address (id, city, region, address, last_edited_at) VALUES (?, ?, ?, ?, ?)",
                newId, request.getCity(), request.getRegion(), request.getAddress(), LocalDateTime.now());

        return new ResponseEntity<>(newId, HttpStatus.CREATED);
    }
}
