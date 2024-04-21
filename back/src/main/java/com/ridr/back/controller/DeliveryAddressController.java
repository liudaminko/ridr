package com.ridr.back.controller;

import com.ridr.back.model.Delivery;
import com.ridr.back.model.DeliveryAddress;
import com.ridr.back.repository.DeliveryAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/deliveryaddress")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class DeliveryAddressController {
    private final DeliveryAddressRepository repository;

    @PostMapping
    public Integer createDeliveryAddress(@RequestBody DeliveryAddress request) {
        return repository.create(request);
    }
}
