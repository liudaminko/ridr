package com.ridr.back.repository;

import com.ridr.back.model.DeliveryType;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DeliveryTypeRepository {
    private final JdbcTemplate jdbcTemplate1;

    public List<DeliveryType> getAll() {
        String query = "SELECT * FROM Delivery_Type";
        return jdbcTemplate1.query(query, BeanPropertyRowMapper.newInstance(DeliveryType.class));
    }
}
