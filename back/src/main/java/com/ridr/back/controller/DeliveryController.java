package com.ridr.back.controller;

import com.ridr.back.model.Delivery;
import com.ridr.back.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/delivery")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class DeliveryController {
    private final DeliveryRepository repository;

    @PostMapping
    public Integer createDelivery(@RequestBody Delivery request) {
        return repository.createDelivery(request);
    }
}
