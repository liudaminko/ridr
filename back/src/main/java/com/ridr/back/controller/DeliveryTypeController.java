package com.ridr.back.controller;

import com.ridr.back.model.DeliveryType;
import com.ridr.back.repository.DeliveryTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/deliverytype")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class DeliveryTypeController {
    private final DeliveryTypeRepository repository;
    @GetMapping
    public List<DeliveryType> getDeliveryTypes() {
        return repository.getAll();
    }
}
