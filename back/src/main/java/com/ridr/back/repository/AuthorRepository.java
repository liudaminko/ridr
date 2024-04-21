package com.ridr.back.repository;

import com.ridr.back.model.Author;
import com.ridr.back.model.FullInfoBook;
import com.ridr.back.model.Genre;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AuthorRepository {
    private final JdbcTemplate jdbcTemplate1;
    private final JdbcTemplate jdbcTemplate2;

    public List<Author> getAll() {
        String query = "SELECT id, first_name, last_name FROM Author";
        return jdbcTemplate1.query(query, BeanPropertyRowMapper.newInstance(Author.class));
    }

    public Author getFullAuthorInfo(int authorId) {
        String query = "SELECT * FROM Author WHERE id = ?";
        return jdbcTemplate1.queryForObject(query, new Object[]{authorId}, new BeanPropertyRowMapper<>(Author.class));
    }

    public int create(Author request) {
        String query = "INSERT INTO Author (first_name, last_name, biography, last_edited_at) VALUES(?,?,?,?)";
        return jdbcTemplate2.update(query, request.getFirstName(), request.getLastName(), request.getBiography(), LocalDateTime.now());
    }

    public Author edit(Author request) {
        String query = "UPDATE Author SET first_name = ?, last_name = ?, biography = ?, last_edited_at = ? " +
                "WHERE id = ?";
        return jdbcTemplate2.queryForObject(query, new Object[]{request.getFirstName(), request.getLastName(), request.getBiography(), LocalDateTime.now(), request.getId()}, new BeanPropertyRowMapper<>(Author.class));
    }
}
