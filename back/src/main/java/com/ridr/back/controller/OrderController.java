package com.ridr.back.controller;

import com.ridr.back.model.Order;
import com.ridr.back.model.ShoppingCart;
import com.ridr.back.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class OrderController {
    private final OrderRepository repository;

    @PostMapping
    public Order createOrder(@RequestBody Order request) {
        return repository.create(request);
    }

}
