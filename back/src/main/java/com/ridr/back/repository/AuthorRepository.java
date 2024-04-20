package com.ridr.back.repository;

import com.ridr.back.model.Author;
import com.ridr.back.model.FullInfoBook;
import com.ridr.back.model.Genre;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AuthorRepository {
    private final JdbcTemplate jdbcTemplate;
    public List<Author> getAll() {
        String query = "SELECT id, first_name, last_name FROM Author";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(Author.class));
    }

    public Author getFullAuthorInfo(int authorId) {
        String query = "SELECT * FROM Author WHERE id = ?";
        return jdbcTemplate.queryForObject(query, new Object[]{authorId}, new BeanPropertyRowMapper<>(Author.class));
    }
}
