package com.ridr.back.repository;

import com.ridr.back.model.BookAuthorsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookAuthorsRepository {
    private final JdbcTemplate jdbcTemplate2;

    public int create(int authorId, int bookId) {
        String query = "INSERT INTO Book_Authors (author_id, book_id, last_edited_at) VALUES(?, ?, ?)";
        return jdbcTemplate2.update(query, authorId, bookId, LocalDateTime.now());
    }

    public int delete(int authorId, int bookId) {
        String query = "UPDATE Book_Authors SET is_active = 0 WHERE author_id = ? AND book_id = ?";
        return jdbcTemplate2.update(query, authorId, bookId);
    }

    public List<BookAuthorsDTO> getAll(int limit) {
        String query = "SELECT TOP " + limit + " CONCAT(a.first_name, ' ', a.last_name) as fullName, b.title FROM Book_Authors ba " +
                "JOIN Book b on b.id = ba.book_id " +
                "JOIN Author a on a.id = ba.author_id " +
                "WHERE b.is_active = 1 AND a.is_active = 1";
        return jdbcTemplate2.query(query, BeanPropertyRowMapper.newInstance(BookAuthorsDTO.class));
    }
}
