package com.ridr.back.controller;

import com.ridr.back.model.Publisher;
import com.ridr.back.repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/publisher")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class PublisherController {
    private final PublisherRepository repository;

    @GetMapping
    public List<Publisher> getPublishers() {
        return repository.getAll();
    }
}
