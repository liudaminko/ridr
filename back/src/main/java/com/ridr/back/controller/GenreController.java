package com.ridr.back.controller;

import com.ridr.back.model.Genre;
import com.ridr.back.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/genre")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class GenreController {
    private final GenreRepository repository;

    @GetMapping
    public List<Genre> getPublishers() {
        return repository.getAll();
    }
}
