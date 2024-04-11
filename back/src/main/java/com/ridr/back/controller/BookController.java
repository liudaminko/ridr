package com.ridr.back.controller;

import com.ridr.back.model.ShortInfoBook;
import com.ridr.back.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalog")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class BookController {
    private final BookRepository repository;

    @GetMapping
    public List<ShortInfoBook> getBooks() {
        return repository.getBooks();
    }
}
