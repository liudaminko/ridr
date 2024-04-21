package com.ridr.back.controller;

import com.ridr.back.model.Publisher;
import com.ridr.back.repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/publisher")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://ridr.s3-website.eu-north-1.amazonaws.com/"})
public class PublisherController {
    private final PublisherRepository repository;

    @GetMapping
    public List<Publisher> getPublishers() {
        return repository.getAll();
    }
    @GetMapping(params = "name")
    public List<Publisher> getPublishersByName(@RequestParam String name) {
        return repository.getPublishersByName(name);
    }
    @GetMapping(params = "address")
    public List<Publisher> getPublishersByAddress(@RequestParam String address) {
        return repository.getPublishersByAddress(address);
    }
    @GetMapping(params = "limit")
    public List<Publisher> getPublishersLimited(@RequestParam int limit) {
        return repository.getAllWithLimit(limit);
    }
    @PostMapping
    public int createPublisher(@RequestBody Publisher request) {
        return repository.create(request);
    }
}
