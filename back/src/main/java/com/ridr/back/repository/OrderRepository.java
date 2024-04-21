package com.ridr.back.repository;

import com.ridr.back.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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
}
