package com.ridr.back.repository;

import com.ridr.back.model.ShoppingCart;
import com.ridr.back.model.ShortInfoBook;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ShoppingCartRepository {
    private final JdbcTemplate jdbcTemplate1;
    private final BookRepository bookRepository;

    public ShoppingCart addBookCart(int bookId, int userId) {
        String selectQuery = "SELECT COALESCE(MAX(sequence_number), 0) FROM Book_Cart WHERE customer_id = ?";
        Integer maxSequenceNumber = jdbcTemplate1.queryForObject(selectQuery, Integer.class, userId);

        int sequenceNumber = maxSequenceNumber != null ? maxSequenceNumber + 1 : 1;

        String insertQuery = "INSERT INTO Book_Cart (book_id, customer_id, sequence_number, quantity) VALUES (?, ?, ?, 1)";
        jdbcTemplate1.update(insertQuery, bookId, userId, sequenceNumber);


        ShortInfoBook shortInfo = bookRepository.getShortInfoBookAuthorized(userId, bookId);
        // Create a ShortInfoBook object for the newly added book
        ShortInfoBook shortInfoBook = new ShortInfoBook();
        shortInfoBook.setId(bookId); // Set the book ID
        shortInfoBook.setTitle(shortInfo.getTitle());
        shortInfoBook.setAuthors(shortInfoBook.getAuthors());
        shortInfoBook.setPrice(shortInfo.getPrice());
        shortInfoBook.setImageUrl(shortInfo.getImageUrl());
        shortInfoBook.setLiked(shortInfo.isLiked());

        ShoppingCart shoppingCart = new ShoppingCart(userId, bookId, sequenceNumber, 1, shortInfoBook);
        return shoppingCart;
    }


    public List<ShoppingCart> getCart(int userId) {
        String query = "SELECT DISTINCT bc.book_id, bc.customer_id, bc.sequence_number, bc.quantity, b.image_url, b.title, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price " +
                "FROM Book_Cart bc " +
                "JOIN Customer c ON c.id = bc.customer_id " +
                "JOIN Book b ON b.id = bc.book_id " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "WHERE c.id = ?";

        return jdbcTemplate1.query(query, new Object[]{userId}, (resultSet, i) -> {
            ShortInfoBook shortBookInfo = new ShortInfoBook();
            shortBookInfo.setId(resultSet.getInt("book_id"));
            shortBookInfo.setImageUrl(resultSet.getString("image_url"));
            shortBookInfo.setTitle(resultSet.getString("title"));
            shortBookInfo.setAuthors(resultSet.getString("authors"));
            shortBookInfo.setPrice(resultSet.getInt("price"));

            ShoppingCart cartItem = new ShoppingCart(resultSet.getInt("customer_id"), resultSet.getInt("book_id"), resultSet.getInt("sequence_number"), resultSet.getInt("quantity"), shortBookInfo);
            return cartItem;
        });
    }


    public int removeBookFromCart(int bookId, int userId) {
        String query = "DELETE FROM Book_Cart WHERE book_id = ? AND customer_id = ?";
        return jdbcTemplate1.update(query, bookId, userId);
    }

    public int changeQuantity(int bookId, int userId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0.");
        }

        String query = "UPDATE Book_Cart SET quantity = ? WHERE book_id = ? AND customer_id = ?";
        return jdbcTemplate1.update(query, quantity, bookId, userId);
    }

    public int removeCart(int userId) {
        String query = "DELETE FROM Book_Cart WHERE customer_id = ?";
        return jdbcTemplate1.update(query, userId);
    }
}
