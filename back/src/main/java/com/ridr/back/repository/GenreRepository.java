package com.ridr.back.repository;

import com.ridr.back.model.EditGenreDto;
import com.ridr.back.model.Genre;
import com.ridr.back.model.Publisher;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class GenreRepository {
    private final JdbcTemplate jdbcTemplate1;
    private final JdbcTemplate jdbcTemplate2;
    public List<Genre> getAll() {
        String query = "SELECT * FROM Genre";
        return jdbcTemplate1.query(query, BeanPropertyRowMapper.newInstance(Genre.class));
    }
    public List<Genre> getAllWithLimit(int limit) {
        String query = "SELECT ";
        if (limit > 0) {
            query += "TOP " + limit + " ";
        }
        query += "* FROM Genre";
        return jdbcTemplate2.query(query, BeanPropertyRowMapper.newInstance(Genre.class));
    }

    public List<Genre> getGenreByName(String name) {
        String query = "SELECT * FROM Genre WHERE name LIKE '" + name + "%'";
        return jdbcTemplate2.query(query, BeanPropertyRowMapper.newInstance(Genre.class));
    }

    public int create(Genre request) {
        String query = "INSERT INTO Genre (name, last_edited_at) VALUES(?,?)";
        return jdbcTemplate2.update(query, request.getName(), LocalDateTime.now());
    }

    public int edit(EditGenreDto editGenreDto) {
        String query = "UPDATE Genre SET name = ?, last_edited_at = ? WHERE name = ?";
        return jdbcTemplate2.update(query, editGenreDto.getName(), LocalDateTime.now(), editGenreDto.getOldName());
    }

    public int delete(String name) {
        String query = "UPDATE Genre SET is_active = 0 WHERE name = ?";
        return jdbcTemplate2.update(query, name);
    }

    public List<Genre> getTop10GenresInLastMonth() {
        String query = "SELECT TOP 10 g.id, g.name " +
                "FROM Genre g " +
                "JOIN Book b ON b.genre_id = g.id " +
                "JOIN Book_Order bo ON bo.book_id = b.id " +
                "JOIN Order_ o ON o.id = bo.order_id " +
                "WHERE o.date >= DATEADD(MONTH, -1, GETDATE()) " +
                "GROUP BY g.id, g.name " +
                "ORDER BY SUM(bo.quantity) DESC;";
        return jdbcTemplate1.query(query, BeanPropertyRowMapper.newInstance(Genre.class));
    }
}
