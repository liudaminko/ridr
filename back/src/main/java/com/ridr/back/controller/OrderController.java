package com.ridr.back.controller;

import com.ridr.back.model.FullOrderInfo;
import com.ridr.back.model.Order;
import com.ridr.back.model.ShoppingCart;
import com.ridr.back.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://ridr.s3-website.eu-north-1.amazonaws.com/"})
public class OrderController {
    private final OrderRepository repository;

    @PostMapping
    public Order createOrder(@RequestBody FullOrderInfo request) {
        return repository.create(request.getOrder().getCustomerId(), request.getDelivery(), request.getDeliveryAddress(), request.getCartItems());
    }

}
