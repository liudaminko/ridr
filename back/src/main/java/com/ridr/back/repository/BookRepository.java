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
    private final JdbcTemplate jdbcTemplate1;

    public List<ShortInfoBook> getBooks(int limit, int offset) {
        String query = "SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "ORDER BY b.id " +
                "OFFSET " + offset + " ROWS " +
                "FETCH NEXT " + limit + " ROWS ONLY";

        return jdbcTemplate1.query(query, BeanPropertyRowMapper.newInstance(ShortInfoBook.class));
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

        return jdbcTemplate1.query(query, BeanPropertyRowMapper.newInstance(ShortInfoBook.class));
    }

    public ShortInfoBook getShortInfoBookAuthorized(int userId, int bookId) {
        String query = "SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price, " +
                "MAX(CASE WHEN w.id IS NOT NULL THEN 1 ELSE 0 END) OVER (PARTITION BY b.id) AS liked " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "LEFT JOIN Book_Wishlist bw ON b.id = bw.book_id " +
                "LEFT JOIN Wishlist w ON w.id = bw.wishlist_id AND w.customer_id = ? " +
                "WHERE b.id = ?";

        return jdbcTemplate1.queryForObject(query, new Object[]{userId, bookId}, new BeanPropertyRowMapper<>(ShortInfoBook.class));
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

        return jdbcTemplate1.queryForObject(query, new Object[]{bookId}, new BeanPropertyRowMapper<>(FullInfoBook.class));
    }

    public List<ShortInfoBook> findAnyBooksFilter(String keywords) {
        String query = "SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "WHERE b.title LIKE ? OR CONCAT(a.first_name, ' ', a.last_name) LIKE ? OR b.isbn LIKE ? " +
                "ORDER BY b.id";

        return jdbcTemplate1.query(query, new Object[]{"%" + keywords + "%", "%" + keywords + "%", "%" + keywords + "%"}, new BeanPropertyRowMapper<>(ShortInfoBook.class));
    }

    public List<ShortInfoBook> getMostPopularBooksInLastMonth(int userId) {
        String query = "SELECT TOP 10 bs.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price, COALESCE(bs.total_sold, 0) AS sold, COALESCE(w.liked, 0) AS liked " +
                "FROM ( " +
                "SELECT bo.book_id AS id, SUM(bo.quantity) AS total_sold FROM Book_Order bo " +
                "JOIN Order_ o ON bo.order_id = o.id " +
                "WHERE o.date >= DATEADD(MONTH, -1, GETDATE()) " +
                "GROUP BY bo.book_id " +
                ") bs " +
                "JOIN Book b ON bs.id = b.id " +
                "JOIN Book_Authors ba ON b.id = ba.book_id " +
                "JOIN Author a ON ba.author_id = a.id " +
                "LEFT JOIN (" +
                "SELECT bw.book_id, 1 AS liked FROM Book_Wishlist bw " +
                "JOIN Wishlist w ON bw.wishlist_id = w.id " +
                "WHERE w.customer_id = ? " +
                ") w ON b.id = w.book_id " +
                "ORDER BY sold DESC";
        return jdbcTemplate1.query(query, new Object[]{userId}, new BeanPropertyRowMapper<>(ShortInfoBook.class));
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
