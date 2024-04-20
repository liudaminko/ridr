package com.ridr.back.controller;

import com.ridr.back.model.DeliveryServiceProvider;
import com.ridr.back.repository.DeliveryServiceProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/deliveryservice")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class DeliveryServiceProviderController {
    private final DeliveryServiceProviderRepository repository;
    @GetMapping
    public List<DeliveryServiceProvider> getDeliveryServices() {
        return repository.getAll();
    }
}
