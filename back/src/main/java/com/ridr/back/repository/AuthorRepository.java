package com.ridr.back.repository;

import com.ridr.back.model.*;
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

    public int edit(EditAuthorDto editAuthorDto) {
        String query = "UPDATE Author SET first_name = ?, last_name = ?, biography = ?, last_edited_at = ? WHERE CONCAT(first_name, ' ', last_name) = ?";
        return jdbcTemplate2.update(query, editAuthorDto.getFirstName(), editAuthorDto.getLastName(),editAuthorDto.getBiography(), LocalDateTime.now(), editAuthorDto.getOldName());
    }

    public int delete(String name) {
        String query = "UPDATE Author SET is_active = 0 WHERE CONCAT(first_name, ' ', last_name) = ?";
        return jdbcTemplate2.update(query, name);
    }

    public List<Author> getAllWithLimit(int limit) {
        String query = "SELECT ";
        if (limit > 0) {
            query += "TOP " + limit + " ";
        }
        query += "* FROM Author";
        return jdbcTemplate2.query(query, BeanPropertyRowMapper.newInstance(Author.class));
    }

    public List<Author> findAuthorsThatMatchPattern(String fullName) {
        String query = "SELECT id, first_name, last_name FROM Author WHERE CONCAT(first_name, ' ', last_name) LIKE '" + fullName + "%'";
        return jdbcTemplate2.query(query, BeanPropertyRowMapper.newInstance(Author.class));
    }
}
