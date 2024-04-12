package com.ridr.back.repository;

import com.ridr.back.model.FullInfoBook;
import com.ridr.back.model.ShortInfoBook;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;


@Component
@RequiredArgsConstructor
public class BookRepository {
    private final JdbcTemplate jdbcTemplate;

    public List<ShortInfoBook> getBooks(int limit, int offset) {
        String query = "SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "ORDER BY b.id " +
                "OFFSET " + offset + " ROWS " +
                "FETCH NEXT " + limit + " ROWS ONLY";

        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(ShortInfoBook.class));
    }
    public List<ShortInfoBook> getBooksAuthorized(int limit, int offset, int userId) {
        String query = "SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price, " +
                "MAX(CASE WHEN w.id IS NOT NULL THEN 1 ELSE 0 END) OVER (PARTITION BY b.id) AS liked " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "LEFT JOIN Book_Wishlist bw ON b.id = bw.book_id " +
                "LEFT JOIN Wishlist w ON w.id = bw.wishlist_id AND w.customer_id = " + userId +
                " ORDER BY b.id " +
                "OFFSET " + offset + " ROWS " +
                "FETCH NEXT " + limit + " ROWS ONLY";

        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(ShortInfoBook.class));
    }

    public FullInfoBook getFullInfoBook(int bookId) {
        String query = "SELECT " +
                "b.id AS id, " +
                "b.image_url AS imageUrl, " +
                "b.title AS title, " +
                "(SELECT CONCAT('[', STRING_AGG(CONCAT('{\"id\":', a.id, ', \"name\":\"', a.first_name, ' ', a.last_name, '\"}'), ','), ']') " +
                " FROM Book_Authors ba INNER JOIN Author a ON ba.author_id = a.id WHERE ba.book_id = b.id) AS authors, " +
                "b.description AS description, " +
                "b.price AS price, " +
                "(SELECT CONCAT('{\"id\":', g.id, ', \"name\":\"', g.name, '\"}') FROM Genre g WHERE g.id = b.genre_id) AS genre, " +
                "b.pages AS pages, " +
                "b.publishing_year AS publicationYear, " +
                "(SELECT CONCAT('{\"id\":', p.id, ', \"name\":\"', p.name, '\"}') FROM Publisher p WHERE p.id = b.publisher_id) AS publisher, " +
                "b.isbn AS isbn, " +
                "b.language AS language " +
                "FROM Book b " +
                "WHERE b.id = ?";

        return jdbcTemplate.queryForObject(query, new Object[]{bookId}, new BeanPropertyRowMapper<>(FullInfoBook.class));
    }




//    public List<ShortInfoBook> getSortedBooks(String param, String order) {
//        String query = "select b.id, b.title, b.imageUrl, concat(a.firstName, ' ', a.lastName) AS authors, b.price, case when w.id is null then false else true end as liked) " +
//                "from Book b " +
//                "join Book_Authors ba on ba.book_id = b.id" +
//                "join Author a on a.id = ba.author_id" +
//                "join WishlistItem wi on b.id = wi.book_id " +
//                "join Wishlist w on w.id = wi.wishlist_id" +
//                "order by b." + param + " " + order;
//        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(ShortInfoBook.class));
//    }
}
