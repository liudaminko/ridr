package com.ridr.back.repository;

import com.ridr.back.model.Genre;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GenreRepository {
    private final JdbcTemplate jdbcTemplate;
    public List<Genre> getAll() {
        String query = "SELECT * FROM Genre";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(Genre.class));
    }
}
