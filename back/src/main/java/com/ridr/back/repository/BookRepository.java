package com.ridr.back.repository;

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

    public List<ShortInfoBook> getBooks() {
        String query = "SELECT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price, " +
                "CASE WHEN w.id IS NULL THEN 0 ELSE 1 END AS liked " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "LEFT JOIN Book_Wishlist bw ON b.id = bw.book_id " +
                "LEFT JOIN Wishlist w ON w.id = bw.wishlist_id";

        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(ShortInfoBook.class));
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
