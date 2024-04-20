package com.ridr.back.repository;

import com.ridr.back.model.DeliveryServiceProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DeliveryServiceProviderRepository {
    private final JdbcTemplate jdbcTemplate;

    public List<DeliveryServiceProvider> getAll() {
        String query = "SELECT * FROM Delivery_Service_Provider";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(DeliveryServiceProvider.class));
    }
}