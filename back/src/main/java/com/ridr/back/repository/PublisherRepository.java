package com.ridr.back.repository;

import com.ridr.back.model.EditPublisherDto;
import com.ridr.back.model.Publisher;
import com.ridr.back.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PublisherRepository {
    private final JdbcTemplate jdbcTemplate1;
    private final JdbcTemplate jdbcTemplate2;
    public List<Publisher> getAll() {
        String query = "SELECT id, name FROM Publisher";
        return jdbcTemplate1.query(query, BeanPropertyRowMapper.newInstance(Publisher.class));
    }
    public List<Publisher> getAllWithLimit(int limit) {
        String query = "SELECT ";
        if (limit > 0) {
            query += "TOP " + limit + " ";
        }
        query += "* FROM Publisher";
        return jdbcTemplate2.query(query, BeanPropertyRowMapper.newInstance(Publisher.class));
    }

    public List<Publisher> getPublishersByName(String name) {
        String query = "SELECT * FROM Publisher WHERE name LIKE '" + name + "%'";
        return jdbcTemplate2.query(query, BeanPropertyRowMapper.newInstance(Publisher.class));
    }
    public Publisher getPublisherInfoByName(String name) {
        String query = "SELECT * FROM Publisher WHERE name = ? ";
        return jdbcTemplate2.queryForObject(query, new Object[]{name}, new BeanPropertyRowMapper<>(Publisher.class));

    }
    public List<Publisher> getPublishersByAddress(String address) {
        String query = "SELECT * FROM Publisher WHERE address LIKE '" + address + "%'";
        return jdbcTemplate2.query(query, BeanPropertyRowMapper.newInstance(Publisher.class));
    }
    public int create(Publisher request) {
        String query = "INSERT INTO Publisher (name, address, last_edited_at) VALUES(?,?,?)";
        return jdbcTemplate2.update(query, request.getName(), request.getAddress(), LocalDateTime.now());
    }
    public int edit(EditPublisherDto editPublisherDto) {
        String query = "UPDATE Publisher SET name = ?, address = ?, last_edited_at = ? WHERE name = ?";
        return jdbcTemplate2.update(query, editPublisherDto.getName(), editPublisherDto.getAddress(), LocalDateTime.now(), editPublisherDto.getOldName());
    }
    public int delete(String name) {
        String query = "UPDATE Publisher SET is_active = 0 WHERE name = ?";
        return jdbcTemplate2.update(query, name);
    }
}
