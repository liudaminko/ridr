package com.ridr.back.repository;

import com.ridr.back.model.ShortInfoBook;
import com.ridr.back.model.Wishlist;
import com.ridr.back.model.WishlistBooks;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class WishlistRepository {
    private final JdbcTemplate jdbcTemplate1;
    public List<Wishlist> getUserWishlists(int userId) {
        String query = "SELECT w.id, w.name, w.last_modified_at, c.id AS userId " +
                "FROM Wishlist w " +
                "JOIN Customer c ON c.id = w.customer_id " +
                "WHERE c.id = " + userId +
                " ORDER BY w.last_modified_at DESC";

        return jdbcTemplate1.query(query, BeanPropertyRowMapper.newInstance(Wishlist.class));
    }

    public Wishlist getLastModifiedUserWishlist(int userId) {
        String query = "SELECT TOP 1 w.id, w.name, w.last_modified_at, c.id AS userId " +
                "FROM Wishlist w " +
                "JOIN Customer c ON c.id = w.customer_id " +
                "WHERE c.id = ? " +
                "ORDER BY w.last_modified_at DESC";

        return jdbcTemplate1.queryForObject(query, new Object[]{userId}, new BeanPropertyRowMapper<>(Wishlist.class));
    }

    public WishlistBooks getUserWishlistById(int userId, int wishlistId) {
        String wishlistQuery = "SELECT w.id, w.name, w.last_modified_at, c.id AS userId " +
                "FROM Wishlist w " +
                "JOIN Customer c ON c.id = w.customer_id " +
                "WHERE c.id = ? AND w.id = ?";

        Wishlist wishlist = jdbcTemplate1.queryForObject(wishlistQuery, new Object[]{userId, wishlistId}, new BeanPropertyRowMapper<>(Wishlist.class));

        String booksQuery = "SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price, " +
                "MAX(CASE WHEN w.id IS NOT NULL THEN 1 ELSE 0 END) OVER (PARTITION BY b.id) AS liked, bw.sequence_number " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "LEFT JOIN Book_Wishlist bw ON b.id = bw.book_id " +
                "LEFT JOIN Wishlist w ON w.id = bw.wishlist_id AND w.customer_id = ? " +
                "WHERE w.id = ? " +
                "ORDER BY bw.sequence_number";

        List<ShortInfoBook> books = jdbcTemplate1.query(booksQuery, new Object[]{userId, wishlistId}, BeanPropertyRowMapper.newInstance(ShortInfoBook.class));

        WishlistBooks wishlistBooks = new WishlistBooks();
        wishlistBooks.setWishlist(wishlist);
        wishlistBooks.setBooks(books);

        return wishlistBooks;
    }


    public Wishlist createWishlist(String name, int userId) {
        String insertQuery = "INSERT INTO Wishlist (name, customer_id, last_modified_at) VALUES (?, ?, CURRENT_TIMESTAMP)";
        jdbcTemplate1.update(insertQuery, name, userId);

        String selectQuery = "SELECT * FROM Wishlist WHERE name = ? AND customer_id = ?";
        return jdbcTemplate1.queryForObject(selectQuery, new Object[]{name, userId}, new BeanPropertyRowMapper<>(Wishlist.class));
    }

    public int addBookToWishlist(Integer wishlistId, Integer userId, Integer bookId) {
        try {
            String sequenceQuery = "SELECT COALESCE(MAX(sequence_number), 0) + 1 as sequence_number FROM Book_Wishlist WHERE book_id = ? AND wishlist_id = ?";
            int sequenceNumber = jdbcTemplate1.queryForObject(sequenceQuery, Integer.class, bookId, wishlistId);

            String insertQuery = "INSERT INTO Book_Wishlist (wishlist_id, book_id, sequence_number) VALUES (?, ?, ?)";
            jdbcTemplate1.update(insertQuery, wishlistId, bookId, sequenceNumber);

            String updateQuery = "UPDATE Wishlist SET last_modified_at = CURRENT_TIMESTAMP WHERE id = ? AND customer_id = ?";
            return jdbcTemplate1.update(updateQuery, wishlistId, userId);
        } catch (DuplicateKeyException e) {
            System.err.println("Duplicate entry detected. The book is already in the wishlist.");
            return -1;
        }
    }

    @Transactional
    public int delete(int userId, int wishlistId) {
        String deleteBooksFromWishlistQuery = "DELETE FROM Book_Wishlist WHERE wishlist_id = ?";
        jdbcTemplate1.update(deleteBooksFromWishlistQuery, wishlistId);

        String deleteWishlistQuery = "DELETE FROM Wishlist WHERE customer_id = ? AND id = ?";
        return jdbcTemplate1.update(deleteWishlistQuery, userId, wishlistId);
    }

    public int updateWishlistName(Integer wishlistId, Integer userId, String newName) {
        String query = "UPDATE Wishlist SET name = ?, last_modified_at = ? WHERE id = ? AND customer_id = ?";
        return  jdbcTemplate1.update(query, newName, LocalDateTime.now(), wishlistId, userId);
    }
}
