package com.ridr.back.repository;

import com.ridr.back.model.FullInfoBook;
import com.ridr.back.model.Genre;
import com.ridr.back.model.ShortInfoBook;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;
import java.util.List;


@Component
@RequiredArgsConstructor
public class BookRepository {
    private final JdbcTemplate jdbcTemplate1;
    private final JdbcTemplate jdbcTemplate2;

    public List<ShortInfoBook> getBooks(int limit, int offset) {
        String query = "SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "WHERE b.is_active=1 " +
                "ORDER BY b.id " +
                "OFFSET " + offset + " ROWS " +
                "FETCH NEXT " + limit + " ROWS ONLY";

        return jdbcTemplate1.query(query, BeanPropertyRowMapper.newInstance(ShortInfoBook.class));
    }
    public int getBooksCount() {
        String query = "SELECT COUNT(*) FROM Book WHERE is_active = 1";
        return jdbcTemplate1.queryForObject(query, Integer.class);
    }
    public List<ShortInfoBook> getBooksAuthorized(int limit, int offset, int userId, int genre, int publisher, int author, String language) {
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price, ");
        queryBuilder.append("MAX(CASE WHEN w.id IS NOT NULL THEN 1 ELSE 0 END) OVER (PARTITION BY b.id) AS liked ");
        queryBuilder.append("FROM Book b ");
        queryBuilder.append("JOIN Book_Authors ba ON ba.book_id = b.id ");
        queryBuilder.append("JOIN Author a ON a.id = ba.author_id ");
        queryBuilder.append("LEFT JOIN Book_Wishlist bw ON b.id = bw.book_id ");
        queryBuilder.append("LEFT JOIN Wishlist w ON w.id = bw.wishlist_id AND w.customer_id = " + userId);
        queryBuilder.append(" WHERE b.is_active = 1 ");

        if (genre != -1) {
            queryBuilder.append("AND b.genre_id = " + genre + " ");
        }
        if (publisher != -1) {
            queryBuilder.append("AND b.publisher_id = " + publisher + " ");
        }
        if (author != -1) {
            queryBuilder.append("AND ba.author_id = " + author + " ");
        }
        if (!language.equals("-1")) {
            queryBuilder.append("AND b.language = '" + language + "' ");
        }

        queryBuilder.append("ORDER BY b.id ");
        queryBuilder.append("OFFSET " + offset + " ROWS ");
        queryBuilder.append("FETCH NEXT " + limit + " ROWS ONLY");

        String query = queryBuilder.toString();
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
                "WHERE b.id = ? AND b.is_active=1";

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
                "WHERE b.id = ? AND b.is_active=1";

        return jdbcTemplate1.queryForObject(query, new Object[]{bookId}, new BeanPropertyRowMapper<>(FullInfoBook.class));
    }

    public List<ShortInfoBook> findAnyBooksFilter(String keywords) {
        String query = "SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "WHERE b.title LIKE ? OR CONCAT(a.first_name, ' ', a.last_name) LIKE ? OR b.isbn LIKE ? AND b.is_active = 1" +
                "ORDER BY b.id";

        return jdbcTemplate1.query(query, new Object[]{"%" + keywords + "%", "%" + keywords + "%", "%" + keywords + "%"}, new BeanPropertyRowMapper<>(ShortInfoBook.class));
    }

    public List<ShortInfoBook> getNewBooksLastMonthAuthorized(int userId) {
        String query = "SELECT TOP 10 b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price, COALESCE(w.liked, 0) AS liked " +
                "From Book b " +
                "JOIN Book_Authors ba ON b.id = ba.book_id " +
                "JOIN Author a ON ba.author_id = a.id " +
                "LEFT JOIN (" +
                "SELECT bw.book_id, 1 AS liked FROM Book_Wishlist bw " +
                "JOIN Wishlist w ON bw.wishlist_id = w.id " +
                "WHERE w.customer_id = ? " +
                ") w ON b.id = w.book_id " +
                "WHERE b.added_at >= DATEADD(MONTH, -1, GETDATE()) AND b.is_active = 1";
        return jdbcTemplate1.query(query, new Object[]{userId}, new BeanPropertyRowMapper<>(ShortInfoBook.class));
    }

    public List<ShortInfoBook> getNewBooksLastMonthNotAuthorized() {
        String query = "SELECT TOP 10 b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price " +
                "From Book b " +
                "JOIN Book_Authors ba ON b.id = ba.book_id " +
                "JOIN Author a ON ba.author_id = a.id " +
                "WHERE b.added_at >= DATEADD(MONTH, -1, GETDATE()) AND b.is_active = 1";
        return jdbcTemplate1.query(query, new BeanPropertyRowMapper<>(ShortInfoBook.class));
    }

    public List<ShortInfoBook> getMostPopularBooksInLastMonthAuthorized(int userId) {
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
                "WHERE w.customer_id = ?" +
                ") w ON b.id = w.book_id " +
                "WHERE b.is_active = 1 " +
                "ORDER BY sold DESC";
        return jdbcTemplate1.query(query, new Object[]{userId}, new BeanPropertyRowMapper<>(ShortInfoBook.class));
    }
    public List<ShortInfoBook> getMostPopularBooksInLastMonthNotAuthorized() {
        String query = "SELECT TOP 10 bs.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price, COALESCE(bs.total_sold, 0) AS sold " +
                "FROM ( " +
                "SELECT bo.book_id AS id, SUM(bo.quantity) AS total_sold FROM Book_Order bo " +
                "JOIN Order_ o ON bo.order_id = o.id " +
                "WHERE o.date >= DATEADD(MONTH, -1, GETDATE()) " +
                "GROUP BY bo.book_id " +
                ") bs " +
                "JOIN Book b ON bs.id = b.id " +
                "JOIN Book_Authors ba ON b.id = ba.book_id " +
                "JOIN Author a ON ba.author_id = a.id " +
                "WHERE b.is_active = 1 " +
                "ORDER BY sold DESC";

        return jdbcTemplate1.query(query, new BeanPropertyRowMapper<>(ShortInfoBook.class));
    }

    public List<FullInfoBook> getAllWithLimit(int limit) {
        String query = "SELECT ";

        if (limit > 0) {
            query += "TOP " + limit + " ";
        }
        query +="b.id AS id, " +
                "b.image_url AS imageUrl, " +
                "b.title AS title, " +
                "(SELECT STRING_AGG(CONCAT(a.first_name, ' ', a.last_name), ',') " +
                " FROM Book_Authors ba INNER JOIN Author a ON ba.author_id = a.id WHERE ba.book_id = b.id) AS authors, " +
                "b.description AS description, " +
                "b.price AS price, " +
                "(SELECT g.name FROM Genre g WHERE g.id = b.genre_id) AS genre, " +
                "b.pages AS pages, " +
                "b.publishing_year AS publicationYear, " +
                "(SELECT p.name FROM Publisher p WHERE p.id = b.publisher_id) AS publisher, " +
                "b.isbn AS isbn, " +
                "b.language AS language " +
                "FROM Book b ";
        return jdbcTemplate2.query(query, BeanPropertyRowMapper.newInstance(FullInfoBook.class));
    }

    public FullInfoBook create(FullInfoBook request) {
        Integer maxOrderId = jdbcTemplate2.queryForObject("SELECT MAX(id) FROM Book", Integer.class);
        int newMaxId = (maxOrderId != null) ? maxOrderId + 1 : 1;

        String query = "INSERT INTO Book (id, title, description, genre_id, publisher_id, publishing_year, pages, isbn, language, image_url, price, added_at, last_edited_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate2.update(query, newMaxId, request.getTitle(), request.getDescription(), Integer.parseInt(request.getGenre()), Integer.parseInt(request.getPublisher()),
                request.getPublicationYear(), request.getPages(), request.getIsbn(), request.getLanguage(),
                request.getImageUrl(), request.getPrice(), LocalDateTime.now(), LocalDateTime.now());

        request.setId(newMaxId);
        return request;
    }

    public int delete(String isbn) {
        String query = "UPDATE Book SET is_active = 0 WHERE isbn = ?";
        return jdbcTemplate2.update(query,isbn);
    }

    public List<ShortInfoBook> getBooksForKids() {
        String query = "SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "JOIN Genre g ON g.id = b.genre_id " +
                "WHERE g.name LIKE 'kid%' OR g.name LIKE 'child%' AND b.is_active = 1" +
                "ORDER BY b.id";

        return jdbcTemplate1.query(query, new BeanPropertyRowMapper<>(ShortInfoBook.class));
    }

    public List<ShortInfoBook> getAllBooks() {
        String query = "SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price " +
                "FROM Book b " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "JOIN Genre g ON g.id = b.genre_id " +
                "WHERE b.is_active = 1" +
                "ORDER BY b.id";

        return jdbcTemplate1.query(query, new BeanPropertyRowMapper<>(ShortInfoBook.class));
    }

    public List<ShortInfoBook> findAllBooksByFilters(List<Long> genres, List<String> languages, List<Long> publishers, List<Long> authors) {
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT DISTINCT b.id, b.title, b.image_url, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price ")
                .append("FROM Book b ")
                .append("JOIN Book_Authors ba ON ba.book_id = b.id ")
                .append("JOIN Author a ON a.id = ba.author_id ")
                .append("JOIN Genre g ON g.id = b.genre_id ")
                .append("WHERE b.is_active = 1");

        if (!genres.isEmpty()) {
            queryBuilder.append(" AND g.id IN (");
            for (int i = 0; i < genres.size(); i++) {
                queryBuilder.append(genres.get(i));
                if (i < genres.size() - 1) {
                    queryBuilder.append(", ");
                }
            }
            queryBuilder.append(")");
        }

        if (!publishers.isEmpty()) {
            queryBuilder.append(" AND b.publisher_id IN (");
            for (int i = 0; i < publishers.size(); i++) {
                queryBuilder.append(publishers.get(i));
                if (i < publishers.size() - 1) {
                    queryBuilder.append(", ");
                }
            }
            queryBuilder.append(")");
        }

        if (!authors.isEmpty()) {
            queryBuilder.append(" AND a.id IN (");
            for (int i = 0; i < authors.size(); i++) {
                queryBuilder.append(authors.get(i));
                if (i < authors.size() - 1) {
                    queryBuilder.append(", ");
                }
            }
            queryBuilder.append(")");
        }

        if (!languages.isEmpty()) {
            queryBuilder.append(" AND b.language IN (");
            for (int i = 0; i < languages.size(); i++) {
                queryBuilder.append(languages.get(i));
                if (i < languages.size() - 1) {
                    queryBuilder.append(", ");
                }
            }
            queryBuilder.append(")");
        }

        // Append ORDER BY clause
        queryBuilder.append(" ORDER BY b.id");

        String query = queryBuilder.toString();
        return jdbcTemplate1.query(query, new BeanPropertyRowMapper<>(ShortInfoBook.class));
        // Execute the query and return the result
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
