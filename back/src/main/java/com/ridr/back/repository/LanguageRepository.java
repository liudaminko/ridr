package com.ridr.back.repository;

import com.ridr.back.model.Language;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class LanguageRepository {
    private final JdbcTemplate jdbcTemplate;

    public List<Language> getAll() {
        String query = "SELECT DISTINCT language as name FROM Book";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(Language.class));
    }
}
