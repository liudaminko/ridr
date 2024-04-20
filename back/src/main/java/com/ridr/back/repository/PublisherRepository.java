package com.ridr.back.repository;

import com.ridr.back.model.Publisher;
import com.ridr.back.model.ShortInfoBook;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PublisherRepository {
    private final JdbcTemplate jdbcTemplate;
    public List<Publisher> getAll() {
        String query = "SELECT id, name FROM Publisher";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(Publisher.class));
    }
}
