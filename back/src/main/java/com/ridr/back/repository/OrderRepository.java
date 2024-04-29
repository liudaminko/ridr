package com.ridr.back.repository;

import com.ridr.back.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class OrderRepository {
    private final JdbcTemplate jdbcTemplate1;
    private final DeliveryRepository deliveryRepository;
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final BookRepository bookRepository;

    @Transactional
    public Order create(int customerId, Delivery delivery, DeliveryAddress deliveryAddress, List<ShoppingCart> cartItems) {
        // Create delivery address
        Integer deliveryAddressId = deliveryAddressRepository.create(deliveryAddress);

        // Create delivery
        delivery.setDeliveryAddressId(deliveryAddressId);
        Integer deliveryId = deliveryRepository.createDelivery(delivery);

        // Create order
        Integer maxUserSeqNumber = jdbcTemplate1.queryForObject("SELECT MAX(user_order_number) FROM Order_ WHERE customer_id = ?", Integer.class, customerId);
        int newUserSeqNumId = (maxUserSeqNumber != null) ? maxUserSeqNumber + 1 : 1;

        Integer maxOrderId = jdbcTemplate1.queryForObject("SELECT MAX(id) FROM Order_", Integer.class);
        int newOrderId = (maxOrderId != null) ? maxOrderId + 1 : 1;

        String insertQuery = "INSERT INTO Order_ VALUES(?, ?, ?, ?, ?, ?)";
        jdbcTemplate1.update(insertQuery, newOrderId, customerId, newUserSeqNumId, LocalDate.now(), LocalTime.now(), deliveryId);

        ShortInfoBook shortInfoBook;
        String insertBookOrderQuery = "INSERT INTO Book_Order (order_id, book_id, quantity, sequence_number, unit_price) VALUES (?, ?, ?, ?, ?)";
        for (ShoppingCart cartItem : cartItems) {
            shortInfoBook = bookRepository.getShortInfoBookAuthorized(customerId, cartItem.getBookId());
            jdbcTemplate1.update(insertBookOrderQuery, newOrderId, cartItem.getBookId(), cartItem.getQuantity(), cartItem.getSequenceNumber(), shortInfoBook.getPrice());
        }
        // Clear cart
        shoppingCartRepository.removeCart(customerId);

        Order order = new Order();
        order.setId(newOrderId);
        order.setCustomerId(customerId);
        order.setUserOrderNumber(newUserSeqNumId);
        order.setDate(LocalDate.now());
        order.setTime(LocalTime.now());
        order.setDeliveryId(deliveryId);
        order.setDelivery(delivery);
        order.setDeliveryAddress(deliveryAddress);

        return order;
    }

    public List<OrderDto> getUserOrders(int userId) {
        String query = "SELECT id, date AS created_at FROM Order_ WHERE customer_id = ? ORDER BY date DESC, time DESC";
        List<OrderDto> userOrders = new ArrayList<>();
        jdbcTemplate1.query(query, new Object[]{userId}, (ResultSet rs) -> {
            try {
                int orderId = rs.getInt("id");
                String createdAt = rs.getString("created_at");
                userOrders.add(new OrderDto(orderId, createdAt));
            } catch (SQLException e) {
                e.printStackTrace();
            }
        });
        return userOrders;
    }

    public List<BookOrder> getOrder(int orderId) {
        String query = "SELECT DISTINCT bo.order_id, bo.book_id, bo.sequence_number, bo.quantity, b.image_url, b.title, CONCAT(a.first_name, ' ', a.last_name) AS authors, b.price " +
                "FROM Book_Order bo " +
                "JOIN Book b ON b.id = bo.book_id " +
                "JOIN Book_Authors ba ON ba.book_id = b.id " +
                "JOIN Author a ON a.id = ba.author_id " +
                "WHERE bo.order_id = ?";

        return jdbcTemplate1.query(query, new Object[]{orderId}, (resultSet, i) -> {
            ShortInfoBook shortBookInfo = new ShortInfoBook();
            shortBookInfo.setId(resultSet.getInt("book_id"));
            shortBookInfo.setImageUrl(resultSet.getString("image_url"));
            shortBookInfo.setTitle(resultSet.getString("title"));
            shortBookInfo.setAuthors(resultSet.getString("authors"));
            shortBookInfo.setPrice(resultSet.getInt("price"));

            BookOrder bookOrder = new BookOrder(resultSet.getInt("order_id"), resultSet.getInt("book_id"), resultSet.getInt("sequence_number"), resultSet.getInt("quantity"), shortBookInfo);
            return bookOrder;
        });
    }

}
